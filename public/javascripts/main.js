$(document).ready(() => {
  // $(window).resize(() => {
  //   if ($(window).innerWidth() <= 645) {
  //     if(!($("#navbar-side").hasClass("hide-nav"))){
  //       $("#navbar-side").addClass("hide-nav");
  //       $("#div-content-right").addClass("hide-nav");
  //     }
  //   }
  // });
  //Fire it when the page first loads:
  const host = "https://tdtu-notify.herokuapp.com";
  $("#notification-success").hide();
  $("#notification-error").hide();

  const noDataElement = $(`
    <span class="font-italic">No data here...</span>
  `);

  if (!(location.pathname == "/login")) {
    let socket = io();

    socket.on("connect", handleConnection);
    socket.on("notification", handleNotification);

    function handleConnection() {
      console.log("Connect socket");
    }

    function handleNotification(msg) {
      notifyNotification(msg);
    }
  }

  /*
   * Login page
   */
  if (location.pathname == "/login") {
    $("#btn-login-google").click((e) => {
      window.location.href = "google";
    });

    $("#btn-login").click((e) => {
      loginNormal();
    });

    $('input[name="password"]').keyup((e) => {
      if (e.keyCode === 13) {
        loginNormal();
      }
    });

    function loginNormal() {
      const url = host + "/login";

      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: $("input[name=username]").val(),
          password: $("input[name=password]").val(),
        }),
      })
        .then((data) => data.json())
        .then((res) => {
          if (res.code == 200) {
            location.pathname = "/";
          } else {
            notifyError(res.msg);
          }
        });
    }
  }

  /*
   * Navbar
   */

  if (location.pathname.includes("all-notification")) {
    $("#dashboard-nav").removeClass("active");
    $("#all-notify-nav").removeClass("active");
    $("#by-department-nav").removeClass("active");

    $("#all-notify-nav").addClass("active");
  } else if (
    location.pathname.includes("all-department") ||
    location.pathname.includes("by-department")
  ) {
    $("#dashboard-nav").removeClass("active");
    $("#all-notify-nav").removeClass("active");
    $("#by-department-nav").removeClass("active");

    $("#by-department-nav").addClass("active");
  } else {
    $("#dashboard-nav").removeClass("active");
    $("#all-notify-nav").removeClass("active");
    $("#by-department-nav").removeClass("active");

    $("#dashboard-nav").addClass("active");
  }

  $("#btn-hide-navbar").click(() => {
    if (!($(window).innerWidth() < 645)) {
      if ($("#navbar-side").hasClass("hide-nav")) {
        $("#navbar-side").removeClass("hide-nav");
        $("#div-content-right").removeClass("hide-nav");
      } else {
        $("#navbar-side").addClass("hide-nav");
        $("#div-content-right").addClass("hide-nav");
      }
    }
  });

  $(".auth__btn-logout").click((e) => {
    location.pathname = "/logout";
  });

  $("#dashboard-nav").click((e) => {
    location.pathname = "";
  });

  $("#all-notify-nav").click((e) => {
    location.pathname = "all-notification";
  });

  $("#by-department-nav").click((e) => {
    location.href = host + "/all-department";
  });

  /*
   * News feed
   */

  if (
    !location.pathname.includes("all-notification") &&
    !location.pathname.includes("all-department") &&
    !(location.pathname == "/login") &&
    !location.pathname.includes("by-department")
  ) {
    let allPosts = [];
    let pagePost = 1;

    const queryId = location.search?.replace("?idPost=", "");
    if (queryId) {
      getPostByIdUser(queryId);
    } else {
      getAllPost();
    }

    $("#btn-post").click(function(e) {
      $(this).attr("disabled", true);
      const content = $("textarea#post-value").val();
      const youtubeUrl = $("#script-yb").val();
      const url = host + "/post/createPost";
      let formData = new FormData();

      formData.append("content", content);
      formData.append("youtubeUrl", youtubeUrl);
      let file = $("#file-img")[0].files;
      for (let i = 0; i < file.length; i++) {
        formData.append("image", file[i]);
      }
      fetch(url, {
        method: "POST",
        body: formData,
      })
        .then((data) => data.json())
        .then((res) => {
          $(this).attr("disabled", false);
          if (res.code === 200) {
            notifySuccess(res.msg);
            postModalHide();
            $("#file-img").val("");
            $("textarea#post-value").val("");
            $("#script-yb").val("");
            if (queryId) {
              getPostByIdUser(queryId);
            } else {
              getAllPost();
            }
          } else {
            notifyError(res.msg);
            postModalHide();
          }
        });
    });

    function getPostByIdUser(id, reset = true) {
      const url = `${host}/post/all/${id}/${pagePost}`;
      fetch(url, {
        method: "GET",
      })
        .then((data) => data.json())
        .then((res) => {
          if (res.code == 200) {
            allPosts = res.msg;
            updatePost(allPosts, reset);
            activatedDeletePost();
            activatedNameClick();
            activatedCommentPost();
            activatedDeleteComment();
            activatedEditPost();
          }
        });
    }

    function getAllPost(reset = true) {
      const url = host + "/post/getPost/" + pagePost;
      fetch(url, {
        method: "GET",
      })
        .then((data) => data.json())
        .then((res) => {
          if (res.code == 200) {
            allPosts = res.msg;
            updatePost(allPosts, reset);
            activatedDeletePost();
            activatedNameClick();
            activatedCommentPost();
            activatedDeleteComment();
            activatedEditPost();
          }
        });
    }

    function postModalHide() {
      $("#postModal").modal("hide");
      $("textarea#post-value").val("");
    }

    function editPostModalHide() {
      $("#editPostModal").modal("hide");
    }

    function updatePost(arr, reset = true) {
      if (reset) {
        $("#news-feed").empty();
      }
      if (arr.length == 10) {
        $("#btn-load-more").css("visibility", "visible");
      } else {
        $("#btn-load-more").css("visibility", "hidden");
      }
      arr.forEach((post) => {
        let imgDiv = "";
        let videoDiv = "";

        if (post.files.length !== 0) {
          const urlImg = `${host}/images/${post.files[0]}`;
          imgDiv = `
              <div class="content__img">
                  <img src="${urlImg}"
                      alt="img">
              </div>
           `;
        }
        let commentDiv = "";
        if (post.comment.length !== 0) {
          post.comment.forEach((comment) => {
            commentDiv += `
                <div id="user-comment-${comment._id}" class="user-comment d-inline-flex py-2">
                    <img src="${comment.author.avatar}" 
                    alt="avatar" class="rounded-circle"> 
                    <div class="message ml-2 px-2 py-1 rounded"> 
                      <span class="user-comment__name"> 
                        ${comment.author.displayName} 
                      </span> 
                      <br />
                      <span>
                        ${comment.content}
                      </span> 
                    </div> 
                    <div class="option_comment">
                        <button class=" rounded-circle mx-2">
                            <i class="fas fa-ellipsis-h"></i>
                            <ul class="options__content p-0 m-0 border rounded shadow-lg">
                                <li class="delete-comment py-2 px-3" 
                                data-idPost="${comment.commentAt}"
                                data-idCmt="${comment._id}">
                                 Xóa
                                </li>
                            </ul>
                        </button>
                    </div>
                  </div>
                       `;
          });
        }
        let content = post.content;
        let youtubeId = "";
        if (post.content.includes("---youtubebreakurl---")) {
          const arrContent = content.split("---youtubebreakurl---");
          content = arrContent[0];
          youtubeId = arrContent[1];
          videoDiv = `
            <div class="content__video">
              <iframe width="1520" height="500" 
                src="https://www.youtube.com/embed/${youtubeId}" title="YouTube video player" 
                frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
              </iframe>
            </div>
           `;
        }

        const postDiv = $(`
          <div class="post my-2 rounded shadow-lg">
          <div id="${
            post._id
          }" class="post__header pt-2 px-3 d-flex justify-content-between">
              <div class="header__auth d-flex">
                  <img src="${
                    post.author.avatar
                  }" alt="avatar" class="rounded-circle">
                  <div class="d-flex flex-column px-2 py-1">
                      <span class="auth__name" data-id="${post.author._id}">${
          post.author.displayName
        }</span>
                      <span class="auth__date">${post.createdAt}</span>
                  </div>
              </div>
              <div class="header__option">
                  <button class="rounded-circle">
                      <i class="fas fa-ellipsis-h"></i>
                      <ul class="options__content p-0 m-0 border rounded shadow-lg">
                          <li  data-id="${post._id}" class="delete-post p-2">
                            Xóa post
                          </li>
                          <li  data-id="${post._id}" class="edit-post p-2">
                            Sửa post
                          </li>
                      </ul>
                  </button>
              </div>
          </div>
          <div class="post__content">
              <div class="content__text py-2 px-3">
                  <span>
                  ${content}
                  </span>
              </div>
              ${imgDiv ? imgDiv : videoDiv}
          </div>
          <div class="post__react px-3">
              <div class="react__action">
                  <div class="quantity py-2 d-flex justify-content-between">
                      <div class="like">
                          <i class="far fa-thumbs-up"></i>
                          <span class="mx-2">0</span>
                      </div>
                      <div class="comment">
                          <span id="total-comment-${post._id}" class="">${
          post.comment?.length > 1
            ? post.comment?.length + " comments"
            : post.comment?.length + " comment"
        }</span>
                      </div>
                  </div>
                  <div class="react border-bottom border-top d-flex justify-content-center">
                      <button>
                          <i class="far fa-thumbs-up"></i>
                          <span class="mx-2">Like</span>
                      </button>
                      <button>
                          <i class="far fa-comment-alt"></i>
                          <span class="mx-2">Comment</span>
                      </button>
                  </div>
                  <div id="comments-post-area-${
                    post._id
                  }" class="comments-post d-flex flex-column">
                  ${commentDiv}
                  </div>
                  <div class="comment-action d-flex p-3">
                    <input id="comment-value-${
                      post._id
                    }" type="text" placeholder="Write a public comment" class="w-100 border p-2 rounded">
                    <button class="btn-comment ml-2 rounded border" data-id="${
                      post._id
                    }">Comment</button>
                </div>
              </div>
          </div>
      </div>
          `);
        $("#news-feed").append(postDiv);
      });
    }

    function activatedCommentPost() {
      $(".btn-comment").click(function(e) {
        const { id } = e.target.dataset;
        let commentValue = $(`#comment-value-${id}`).val();

        if (commentValue.trim() !== "") {
          $(this).attr("disabled", true);
          postCommentPost(id, commentValue).then((res) => {
            $(this).attr("disabled", false);
            if (res.code == 200) {
              notifySuccess(res.msg);
              updateOnlyCommentElement(res.data);
            }
          });
        }
      });
    }

    function updateOnlyCommentElement(data) {
      $(`#comment-value-${data._id}`).val("");
      $(`#total-comment-${data._id}`).empty();
      $(`#comments-post-area-${data._id}`).empty();
      let totalComment =
        data.comment?.length > 1
          ? data.comment?.length + " comments"
          : data.comment?.length + " comment";
      $(`#total-comment-${data._id}`).html(totalComment);
      data.comment.forEach((comment) => {
        const commentDiv = $(`
          <div id="user-comment-${comment._id}" class="user-comment d-inline-flex py-2">
              <img src="${comment.author.avatar}" 
              alt="avatar" class="rounded-circle"> 
              <div class="message ml-2 px-2 py-1 rounded"> 
                <span class="user-comment__name"> 
                  ${comment.author.displayName} 
                </span> 
                <br />
                <span>
                  ${comment.content}
                </span> 
              </div> 
              <div class="option_comment">
                  <button class=" rounded-circle mx-2">
                      <i class="fas fa-ellipsis-h"></i>
                      <ul class="options__content p-0 m-0 border rounded shadow-lg">
                          <li class="delete-comment py-2 px-3" 
                          data-idPost="${comment.commentAt}"
                          data-idCmt="${comment._id}">
                           Xóa
                          </li>
                      </ul>
                  </button>
              </div>
            </div>
                 `);
        $(`#comments-post-area-${data._id}`).append(commentDiv);
      });
    }

    function deleteCommentPost(id) {
      url = host + "/comment/delete";

      return fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ commentId: id }),
      }).then((data) => data.json());
    }

    function activatedDeleteComment() {
      $("body").delegate(".delete-comment", "click", (e) => {
        const { idcmt, idpost } = e.target.dataset;
        $("#confirmDeleteCommentModal").modal("show");
        $("#btn-confirm-delete-comment").attr("data-id", idcmt);
        $("#btn-confirm-delete-comment").attr("data-idpost", idpost);
      });
    }

    $("#btn-confirm-delete-comment").click((e) => {
      const { id, idpost } = e.target.dataset;

      deleteCommentPost(id).then((res) => {
        if (res.code == 200) {
          let totalComment = $(`#total-comment-${idpost}`).text().split(" ");
          totalComment[0] = totalComment[0] * 1 - 1;
          if (totalComment[0] <= 1) {
            totalComment[1] = "comment";
          } else {
            totalComment[1] = "comments";
          }
          let newTotal = totalComment.join(" ");
          $(`#total-comment-${idpost}`).text(newTotal);
          notifySuccess(res.msg);
          $(`#user-comment-${id}`).remove();
          $("#confirmDeleteCommentModal").modal("hide");
        } else {
          $("#confirmDeleteCommentModal").modal("hide");
          notifyError(res.msg);
        }
      });
    });

    function postCommentPost(id, comment) {
      const url = host + `/comment/add`;
      const body = {
        postId: id,
        content: comment,
      };
      return fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }).then((data) => data.json());
    }

    function activatedEditPost() {
      $(".edit-post").click((e) => {
        const { id } = e.target.dataset;
        $("#post-value-edit").val("");
        $("#file-img-edit").val("");
        $("#script-yb-edit").val("");
        getDetailPostById(id).then((res) => {
          if (res.code == 200) {
            if (res.msg.content.includes("---youtubebreakurl---")) {
              let contentArr = res.msg.content.split("---youtubebreakurl---");
              $("#file-img-edit").hide();
              $("#sub-body-edit-post-title").html("YouTube video link:");
              $("#post-value-edit").val(contentArr[0]);
              $("#script-yb-edit").show();
              $("#script-yb-edit").val(contentArr[1]);
            } else if (res.msg.files.length !== 0) {
              $("#script-yb-edit").hide();
              $("#file-img-edit").show();
              $("#sub-body-edit-post-title").html("Img file:");
              $("#post-value-edit").val(res.msg.content);
              $("#img-edit-post").attr(
                "src",
                `${host}/images/${res.msg.files[0]}`
              );
            } else {
              $("#post-value-edit").val(res.msg.content);
            }
            $("#editPostModal").modal("show");
            $("#btn-edit-confirm").attr("data-id", id);
          } else {
            notifyError(res.msg);
          }
        });
      });
    }

    $("#btn-edit-confirm").click((e) => {
      const { id } = e.target.dataset;

      const url = host + "/post/updatePost";
      let formData = new FormData();
      formData.append("id", id);
      formData.append("content", $("#post-value-edit").val());
      formData.append("youtubeUrl", $("#script-yb-edit").val());
      let file = $("#file-img-edit")[0].files;
      for (let i = 0; i < file.length; i++) {
        formData.append("image", file[i]);
      }
      fetch(url, {
        method: "POST",
        body: formData,
      })
        .then((data) => data.json())
        .then((res) => {
          if (res.code === 200) {
            notifySuccess(res.msg);
            editPostModalHide();
            $("#script-yb-edit").val("");
            $("#file-img-edit").val("");
            if (queryId) {
              getPostByIdUser(queryId);
            } else {
              getAllPost();
            }
          } else {
            notifyError(res.msg);
            editPostModalHide();
          }
        });
    });

    function getDetailPostById(id) {
      const url = host + "/post/getDetailPost/" + id;
      return fetch(url, {
        method: "GET",
      }).then((data) => data.json());
    }

    function activatedDeletePost() {
      $(".delete-post").click((e) => {
        const { id } = e.target.dataset;
        $("#confirmModal").modal("show");
        $("#btn-confirm").attr("data-id", id);
      });
    }
    $("#btn-confirm").on("click", (e) => {
      const { id } = e.target.dataset;
      const url = host + "/post/deletePost";
      let body = { deleteId: id };
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })
        .then((data) => data.json())
        .then((res) => {
          if (res.code == 200) {
            notifySuccess(res.msg);
            $("#confirmModal").modal("hide");

            if (queryId) {
              getPostByIdUser(queryId);
            } else {
              getAllPost();
            }
          } else {
            notifyError(res.msg);
            $("#confirmModal").modal("hide");
          }
        });
    });

    function activatedNameClick() {
      $(".auth__name").click((e) => {
        const { id } = e.target.dataset;
        location.search = `?idPost=${id}`;
      });
    }

    $("#btn-load-more").click((e) => {
      pagePost = pagePost + 1;
      if (queryId) {
        getPostByIdUser(queryId, false);
      } else {
        getAllPost(false);
      }
    });
  }

  /*
   * Department-list
   */
  if (location.pathname == "/all-department") {
    if (location.search !== "") {
    }
    let allDepartment = [];

    getAllDepartment().then((res) => {
      if (res.code == 200) {
        allDepartment = res.msg;
        updateDepartment();
        activatedDepartmentClick();
      }
    });

    function updateDepartment() {
      allDepartment.forEach((dep) => {
        const departmentDiv = `
        <div class=" col-12 col-md-6 d-flex">
          <span data-id="${dep._id}" class="department-card border rounded shadow my-1 p-3 w-100"
            title="Click to see all notification of this department">${dep.name}</span>
        </div>
        `;
        $("#list-department").append(departmentDiv);
      });
    }

    function activatedDepartmentClick() {
      $(".department-card").click((e) => {
        const { id } = e.target.dataset;
        location.pathname = `/by-department/${id}`;
      });
    }
  }

  /*
   * notification-list
   */
  if (location.pathname == "/all-notification") {
    let url = host + "/notification/list/notification/";
    let searchUrl = location.search;
    if (searchUrl == "") {
      location.search = "page=1";
    }

    let pageIndexAllNotify = parseInt(searchUrl.replace("?page=", ""));
    if (pageIndexAllNotify < 1) {
      location.search = "page=1";
    }
    if (pageIndexAllNotify <= 1) {
      $("#btn-pre-list-notification").attr("disabled", true);
    }
    //console.log(pageIndexAllNotify);
    let allNotify = [];

    getNotification(url, pageIndexAllNotify).then((res) => {
      if (res.code == 200) {
        allNotify = res.msg;
        //console.log(res);
        if (allNotify.length == 0 || allNotify.length < 10) {
          $("#btn-nex-list-notification").attr("disabled", true);
        }
        //console.log(res);
        updateNotificationList(allNotify);
        activateNotificationCard();
      }
    });

    $("#btn-nex-list-notification").click((e) => {
      //console.log("click");
      if (allNotify.length != 0) {
        pageIndexAllNotify += 1;
        location.search = `page=${pageIndexAllNotify}`;
      }
    });
    $("#btn-pre-list-notification").click((e) => {
      if (pageIndexAllNotify > 1) {
        pageIndexAllNotify -= 1;
        location.search = `page=${pageIndexAllNotify}`;
      }
    });
  }

  function getNotification(url, pageIndex = null) {
    let newURl = url + (pageIndex ? pageIndex.toString() : "");
    return fetch(newURl, {
      method: "GET",
    }).then((data) => data.json());
  }

  function updateNotificationList(notification) {
    if (notification.length !== 0) {
      notification.forEach((n) => {
        const cardEle = $(`
        <div data-id="${n._id}" class=" col-12 col-md-12 d-flex">
            <div data-id="${
              n._id
            }" class="notification-card border rounded shadow my-1 p-3 w-100 d-flex flex-column"
                title="Click to see detail">
                <span class="notification-card-title">${n.title}</span>
                <span class="notification-card-title font-italic text-secondary">From: ${
                  n.author.displayName
                } | ${n.department.name} | ${n.createdAt}</span>
                <span class="notification-card-content" >${
                  n.content.length < 300
                    ? n.content
                    : n.content.slice(0, 300) + "..."
                }</span>
            </div>
        </div>
        `);
        $("#list-notification").append(cardEle);
      });
    } else {
      $("#list-notification").append(noDataElement);
    }
  }

  function activateNotificationCard() {
    $(".notification-card").click((e) => {
      const { id } = e.currentTarget.dataset;

      location.href = `${host}/all-notification/${id}`;
    });
  }

  /*
   * notification-list by department
   */
  if (location.pathname.includes("by-department")) {
    let idDepartment = location.pathname.replace("/by-department/", "");
    let url = `${host}/notification/list/department/${idDepartment}`;
    let urlDepartment = `${host}/notification/specific/department/${idDepartment}`;
    $("#btn-pre-list-notification").css("display", "none");
    $("#btn-nex-list-notification").css("display", "none");
    let allNotify = [];

    //console.log(urlDepartment);
    getDepartment(urlDepartment).then((res) => {
      //console.log("hello", res);
      if (res.code == 200) {
        $("#title-all-notification").html(res.msg.name);
      }
    });

    getNotification(url).then((res) => {
      if (res.code == 200) {
        allNotify = res.msg;
        //console.log(res);
        updateNotificationList(allNotify);
        activateNotificationCard();
      }
    });
  }

  function getDepartment(url) {
    //console.log("run");
    return fetch(url, {
      method: "GET",
    }).then((data) => data.json());
  }

  // ADMIN && DEPARTMENT
  if (
    location.pathname === "/admin" ||
    location.pathname == "/department-dashboard"
  ) {
    let allDepartment = [];

    getDepartmentNotification().then((res) => {
      if (res.code == 200) {
        allDepartment = res.msg;
        //console.log(allDepartment);
        updateSelectDepartment();
        updateSelectedDepartmentNotification();
      }
    });

    function getDepartmentNotification() {
      const url = host + "/notification/role-department/list";
      return fetch(url, {
        method: "GET",
      }).then((data) => data.json());
    }

    function updateSelectedDepartmentNotification() {
      allDepartment.forEach((d) => {
        const optionEle = $(`
          <option value="${d._id}">${d.name}</option>
        `);
        $("#department-notification-create-notify").append(optionEle);
      });
    }

    function updateSelectDepartment() {
      allDepartment.forEach((d) => {
        const checkboxDiv = $(`
        <div class="col-12 col-lg-6 ">
          <input type="checkbox" id="${d._id}" value="${d._id}">
          <label for="${d._id}"> ${d.name}</label>
        </div>
        `);

        $("#department-select-area").append(checkboxDiv);
      });
    }

    $("#btn-create-account").click((e) => {
      let arrDepartmentChecked = [];
      $('input[type="checkbox"]:checked').each((i, v) => {
        arrDepartmentChecked.push(v.value);
      });
      const body = {
        name: $("#name-create-account").val(),
        username: $("#username-create-account").val(),
        password: $("#password-create-account").val(),
        department: arrDepartmentChecked,
      };

      const url = host + "/manage/register";
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })
        .then((data) => data.json())
        .then((res) => {
          if (res.code == 200) {
            createAccountModalHide();
            notifySuccess(res.msg);
            arrDepartmentChecked = [];
            $("#name-create-account").val(""),
              $("#username-create-account").val(""),
              $("#password-create-account").val(""),
              $('input[type="checkbox"]:checked').each((i, v) => {
                v.checked = false;
              });
          } else {
            createAccountModalHide();
            notifyError(res.msg);
          }
        });
    });

    $("#btn-create-notify").click((e) => {
      const url = host + "/notification/add";
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: $("#title-notification-create-notify").val(),
          content: $("#content-notification-create-notify").val(),
          department: $("#department-notification-create-notify").val(),
        }),
      })
        .then((data) => data.json())
        .then((res) => {
          if (res.code == 200) {
            createNotificationModalHide();
            notifySuccess(res.msg);
            $("#title-notification-create-notify").val("");
            $("#content-notification-create-notify").val("");
          } else {
            createNotificationModalHide();
            notifyError(res.msg);
          }
        });
    });

    function createAccountModalHide() {
      $("#createAccountModal").modal("hide");
    }
  }

  /*
   * notification-detail
   */

  if (location.pathname.includes("/all-notification/")) {
    const idNotification = location.pathname.replace("/all-notification/", "");
    getNotificationById(idNotification);
  }

  function getNotificationById(idNotification) {
    const url = host + "/notification/" + idNotification;
    fetch(url, {
      method: "GET",
    })
      .then((data) => data.json())
      .then((res) => {
        if (res.code == 200) {
          updateDetailNotification(res.msg);
        }
      });
  }

  function updateDetailNotification(data) {
    const detailDiv = $(`
     <h2>${data.title}</h2>
     <span class="font-italic text-secondary">
         From: ${data.author.displayName} | ${data.department.name} | ${data.createdAt}
     </span>
     <hr class="mt-04rem">
     <span>
         ${data.content}
     </span>
     `);
    $("#detail-notification").append(detailDiv);
  }

  // COMMON notify
  function notifySuccess(msg) {
    $("#notification-success").html(msg);
    $("#notification-success").show();
    setTimeout(() => {
      $("#notification-success").hide();
    }, 3000);
  }
  function notifyError(msg) {
    $("#notification-error").html(msg);
    $("#notification-error").show();
    setTimeout(() => {
      $("#notification-error").hide();
    }, 3000);
  }
  function notifyNotification(msg) {
    const idNotify = msg.data._id;
    const url = host + "/all-notification/" + idNotify;
    const notifyDiv = $(`
    <div id="${msg.data._id}" class="rounded m-2 py-3 px-4 bg-success text-white">
    ${msg.user} đã thêm một thông báo mới. <a href="${url}">Read now</a>
    </div>
    `);
    $("#notification-notify").append(notifyDiv);
    setTimeout(() => {
      $(`#${idNotify}`).remove();
    }, 4000);
  }

  function getAllDepartment() {
    const url = host + "/notification/list/department";
    return fetch(url, {
      method: "GET",
    }).then((data) => data.json());
  }
  function createNotificationModalHide() {
    $("#createNotifyModal").modal("hide");
  }
  $("#video-post").click((e) => {
    emptyValuePostModal();
    $("#sub-body-post-title").html("Link Youtube Video");
    $("#file-img").css("display", "none");
    $("#script-yb").css("display", "block");
  });

  $("#photo-post").click((e) => {
    emptyValuePostModal();
    $("#sub-body-post-title").html("Photo");
    $("#file-img").css("display", "block");
    $("#script-yb").css("display", "none");
  });
  $("#status-post").click((e) => {
    emptyValuePostModal();
    $("#sub-body-post-title").html("Photo");
    $("#file-img").css("display", "block");
    $("#script-yb").css("display", "none");
  });

  function emptyValuePostModal() {
    $("#file-img").val("");
    $("textarea#post-value").val("");
    $("#script-yb").val("");
  }
});
