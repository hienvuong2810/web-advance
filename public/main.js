
$(document).ready(() => {
  $('#notification-success').hide();
  $('#notification-error').hide();


  const noDataElement = $(`
    <span class="font-italic">No data here...</span>
  `)
 

  if(!(location.pathname == '/login')){
    let socket = io();
  
    socket.on('connect', handleConnection)
    socket.on('notification', handleNotification)
  
    
    function handleConnection() {
      console.log('Connect socket')
    }
  
    function handleNotification(msg){
      notifyNotification(msg)
    }
  }

  
  

  /* 
  * Login page
  */
    if(location.pathname == '/login'){
      $('#btn-login-google').click((e)  =>{ 
        window.location.href = 'google'       
      });

      $('#btn-login').click(e => {
        loginNormal();
      })
      
      $('input[name="password"]').keyup((e)  =>{ 
        if(e.keyCode === 13){
          loginNormal();
        }
      });

      function loginNormal(){
        const url = 'http://localhost:3000/login';

        fetch(url, {
          method: 'POST',
          headers:{
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "username": $("input[name=username]").val(),
            "password": $("input[name=password]").val()
          })
        })
        .then(data => data.json())
        .then(res => {
          console.log(res)
          if(res.code == 200){
            location.pathname = '/'
          }else{
            notifyError(res.msg);
          }
        })
      }
    }

  /*
  * Navbar
  */

  if(location.pathname.includes('all-notification')){
    $('#dashboard-nav').removeClass('active');
    $('#all-notify-nav').removeClass('active');
    $('#by-department-nav').removeClass('active');
    
    $('#all-notify-nav').addClass('active');
  }else if(location.pathname.includes('all-department')  || location.pathname.includes('by-department')){
    $('#dashboard-nav').removeClass('active');
    $('#all-notify-nav').removeClass('active');
    $('#by-department-nav').removeClass('active');
    
    $('#by-department-nav').addClass('active');
  }else{
    $('#dashboard-nav').removeClass('active');
    $('#all-notify-nav').removeClass('active');
    $('#by-department-nav').removeClass('active');
    
    $('#dashboard-nav').addClass('active');
  }


   $('#btn-hide-navbar').click(() => {
     if($('#navbar-side').hasClass('hide-nav')){
      $('#navbar-side').removeClass('hide-nav');
      $('#div-content-right').removeClass('hide-nav');
    }else{
      $('#navbar-side').addClass('hide-nav');
      $('#div-content-right').addClass('hide-nav');
    }
   })

   $('.auth__btn-logout').click(e => {
     location.pathname = '/logout'; 
   })

   
   $('#dashboard-nav').click(e => {
     location.pathname = ''
   });

   $('#all-notify-nav').click(e => {
     
     location.pathname = 'all-notification'
   });

   $('#by-department-nav').click(e => {
     location.href = 'http://localhost:3000/all-department'
   });

  /*
  * News feed
  */
 
  
  if(!location.pathname.includes('all-notification') && !location.pathname.includes('all-department') && !(location.pathname == '/login') && !(location.pathname.includes('by-department'))){
    let allPosts = []
    let pagePost = 1;
    
    const queryId = location.search?.replace('?idPost=', '');
    if(queryId){
      console.log(queryId)
      getPostByIdUser(queryId);
    }else{
      getAllPost();
    }

    $('#btn-post').click((e) => {
      const content = $('textarea#post-value').val();
      const youtubeUrl = $('#script-yb').val();
      const url = 'http://localhost:3000/post/createPost'
      let formData = new FormData();
  
      formData.append('content', content);
      formData.append('youtubeUrl', youtubeUrl);
      let file = $('#file-img')[0].files;
      for (let i = 0; i < file.length; i++) {
        formData.append('image', file[i]);
      }
      fetch(url, {
        method: 'POST',
        body: formData
      })
      .then(data => data.json())
      .then(res => {
        if(res.code === 200){
          notifySuccess(res.msg)
          postModalHide()
          $('#file-img').val('')
          $('textarea#post-value').val('')
          $('#script-yb').val('');
          if(queryId){
            getPostByIdUser(queryId);
          }else{
            getAllPost();
          }
        }else{
          notifyError(res.msg)
          postModalHide()
        }
      })
    })
  
    function getPostByIdUser(id, reset = true){
      const url = `http://localhost:3000/post/all/${id}/${pagePost}`;
      fetch(url, {
        method: 'GET'
      })
      .then(data => data.json())
      .then(res => {
        if(res.code == 200){
          allPosts = res.msg;
          console.log(allPosts)
          updatePost(allPosts, reset)
          activatedDeletePost();
          activatedNameClick();
          activatedCommentPost();
          activatedDeleteComment();
        }
      })
    }
  
     function getAllPost(reset = true){
         console.log('get posts')
       const url = 'http://localhost:3000/post/getPost/' + pagePost
      fetch(url, {
        method: 'GET'
      })
      .then(data => data.json())
      .then(res => {
        if(res.code == 200){
          allPosts = res.msg;
          console.log(allPosts)
          updatePost(allPosts, reset)
          activatedDeletePost();
          activatedNameClick();
          activatedCommentPost();
          activatedDeleteComment();
        }
      })
     }
     
  
     function postModalHide(){
      $('#postModal').modal('hide');
      $('textarea#post-value').val('')
     }
  
     function updatePost(arr, reset = true){
       if(reset){
         $('#news-feed').empty();
       }
       if(arr.length == 10){
         $('#btn-load-more').css('visibility', 'visible')
      }else{
         $('#btn-load-more').css('visibility', 'hidden')
       }
       arr.forEach(post => {
         let imgDiv = '';
         let videoDiv = '';

         if(post.files.length !== 0){
           const urlImg = `http://localhost:3000/images/${post.files[0]}`
           imgDiv = `
              <div class="content__img">
                  <img src="${urlImg}"
                      alt="img">
              </div>
           `
         }
         let commentDiv = ''; 
         if(post.comment.length !== 0){
            post.comment.forEach(comment => {
               commentDiv +=  `
                <div class="user-comment d-inline-flex py-2">
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
                       ` 
              }) 
          }
         let content = post.content
         let youtubeId = ''
         if(post.content.includes('---youtubebreakurl---')){
           const arrContent = content.split('---youtubebreakurl---');
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
           `
         }

          const postDiv = $(`
          <div class="post my-2 rounded shadow-lg">
          <div id="${post._id}" class="post__header pt-2 px-3 d-flex justify-content-between">
              <div class="header__auth d-flex">
                  <img src="${post.author.avatar}" alt="avatar" class="rounded-circle">
                  <div class="d-flex flex-column px-2 py-1">
                      <span class="auth__name" data-id="${post.author._id}">${post.author.displayName}</span>
                      <span class="auth__date">${post.createAt}</span>
                  </div>
              </div>
              <div class="header__option">
                  <button class="rounded-circle">
                      <i class="fas fa-ellipsis-h"></i>
                      <ul class="options__content p-0 m-0 border rounded shadow-lg">
                          <li  data-id="${post._id}" class="delete-post p-2">Xóa post</li>
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
                          <span class="">${post.comment?.length > 1 ? post.comment?.length + ' comments' : post.comment?.length + ' comment'}</span>
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
                  <div id="comments-post-area-${post._id}" class="comments-post d-flex flex-column">
                  ${commentDiv}
                  </div>
                  <div class="comment-action d-flex p-3">
                    <input id="comment-value-${post._id}" type="text" placeholder="Write a public comment" class="w-100 border p-2 rounded">
                    <button class="btn-comment ml-2 rounded border" data-id="${post._id}">Comment</button>
                </div>
              </div>
          </div>
      </div>
          `);
          $('#news-feed').append(postDiv)
      });
     }

     function activatedCommentPost(){
       $('.btn-comment').click(e => {
         const {id} = e.target.dataset;
        let commentValue = $(`#comment-value-${id}`).val();

        console.log(commentValue)
        if(commentValue.trim() !== ''){
          postCommentPost(id, commentValue)
          .then(res => {
            console.log(res)
            if(res.code == 200){
              const limit = pagePost*1;
              if(queryId){
                for(let i = 1; i <= limit; i++){
                  pagePost = i
                  if(i == 1){
                    getPostByIdUser(queryId);
                  }else{
                    getPostByIdUser(queryId, false);
                  }
                }
              }else{
                for(let i = 1; i <= limit; i++){
                  pagePost = i
                  if(i == 1){
                    getAllPost();
                  }else{
                    getAllPost(false);
                  }
                }
              }
            }
          })
        }
       })
     }

     function activatedDeleteComment(){
       $('.delete-comment').click(e => {
         const {idcmt, idpost} = e.target.dataset;
         console.log(idcmt, idpost)
       })
     }

     function postCommentPost(id, comment){
        const url = `http://localhost:3000/comment/add`;
        const body = {
          postId: id,
          content: comment
        }
        return fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        })
        .then(data => data.json())
     }
  
      function activatedDeletePost(){
        $('.delete-post').click(e => {
            const {id} = e.target.dataset;
            $('#confirmModal').modal('show');
            $('#btn-confirm').attr('data-id', id)
        })
      }
      $('#btn-confirm').on('click', e => {
        const {id} = e.target.dataset;
        const url = 'http://localhost:3000/post/deletePost'
        let body = {"deleteId": id};
        console.log(body)
        fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
        .then(data => data.json())
        .then(res => {
            if(res.code == 200){
                notifySuccess(res.msg)
                $('#confirmModal').modal('hide');
                const limit = pagePost*1;
                console.log(limit, queryId)
                if(queryId){
                  for(let i = 1; i <= limit; i++){
                    pagePost = i
                    if(i == 1){
                      getPostByIdUser(queryId);
                    }else{
                      getPostByIdUser(queryId, false);
                    }
                  }
                }else{
                  for(let i = 1; i <= limit; i++){
                    pagePost = i
                    if(i == 1){
                      getAllPost();
                    }else{
                      getAllPost(false);
                    }
                  }
                }
            }else{
                notifyError(res.msg)
                $('#confirmModal').modal('hide');
            }
        })
      });
  
      function activatedNameClick(){
        $('.auth__name').click(e => {
          const {id} = e.target.dataset
          console.log(id)
          location.search = `?idPost=${id}`
        })
      }
  
      $('#btn-load-more').click(e => {
        pagePost = pagePost + 1;
        if(queryId){
          console.log(queryId)
          getPostByIdUser(queryId, false);
        }else{
          getAllPost(false)
        }
      })
      
     
  }

   
   
   
   
   /*
   * Department-list
   */
  if(location.pathname == '/all-department'){
    if(location.search !== ''){
    }
    let allDepartment = []
    console.log(location)
  
    
    getAllDepartment()
      .then(res => {
        if(res.code == 200){
          allDepartment = res.msg;
          updateDepartment();
          activatedDepartmentClick();
        }
      })
    
    function updateDepartment(){
      allDepartment.forEach(dep => {
        const departmentDiv = `
        <div class=" col-12 col-md-6 d-flex">
          <span data-id="${dep._id}" class="department-card border rounded shadow my-1 p-3 w-100"
            title="Click to see all notification of this department">${dep.name}</span>
        </div>
        `
        $('#list-department').append(departmentDiv);
        
      })
    }

   
  
    function activatedDepartmentClick(){
      $('.department-card').click(e => {
        const {id} = e.target.dataset;
        location.pathname = `/by-department/${id}`
      })
    }
  }

 /*
  * notification-list
  */
  if(location.pathname == '/all-notification'){
    let url = 'http://localhost:3000/notification/list/notification/';
   console.log(location)
    let searchUrl = location.search;
    if(searchUrl == ''){
      location.search = 'page=1'
    }
   
    let pageIndexAllNotify = parseInt(searchUrl.replace('?page=', ''))
    if(pageIndexAllNotify < 1){
      location.search = 'page=1'
    }
    if(pageIndexAllNotify <= 1){
      $('#btn-pre-list-notification').attr('disabled', true)
    }
    console.log(pageIndexAllNotify)
    let allNotify = []

    getNotification(url, pageIndexAllNotify)
    .then(res => {
      if(res.code == 200){
        allNotify = res.msg;
        console.log(res)
        if(allNotify.length == 0 || allNotify.length < 10){
          $('#btn-nex-list-notification').attr('disabled', true)
        }
        console.log(res)
        updateNotificationList(allNotify)
        activateNotificationCard()
      }
    });

    $('#btn-nex-list-notification').click(e => {
      console.log('click');
      if(allNotify.length != 0){
        pageIndexAllNotify += 1;
        location.search = `page=${pageIndexAllNotify}`
      }
    });
    $('#btn-pre-list-notification').click(e => {
      if(pageIndexAllNotify > 1){
        pageIndexAllNotify -= 1;
        location.search = `page=${pageIndexAllNotify}`
      }
    })

  }

  function getNotification(url, pageIndex = null){
    let newURl = url + (pageIndex ? pageIndex.toString() : '')
    return fetch(newURl, {
      method: 'GET'
    })
    .then(data => data.json())
    
  }

  function updateNotificationList(notification){
    if(notification.length !== 0){
      notification.forEach(n => { 
        const cardEle = $(`
        <div data-id="${n._id}" class=" col-12 col-md-12 d-flex">
            <div data-id="${n._id}" class="notification-card border rounded shadow my-1 p-3 w-100 d-flex flex-column"
                title="Click to see detail">
                <span class="notification-card-title">${n.title}</span>
                <span class="notification-card-title font-italic text-secondary">From: ${n.author.displayName} | ${n.department.name} | ${n.createAt}</span>
                <span class="notification-card-content" >${n.content.length < 300 ? n.content : n.content.slice(0, 300) + '...'}</span>
            </div>
        </div>
        `)
        $('#list-notification').append(cardEle);
      });
    }else{
      $('#list-notification').append(noDataElement);
      
    }
  }

  function activateNotificationCard(){
    $('.notification-card').click(e => {
      const {id} = e.currentTarget.dataset;

      location.href = `http://localhost:3000/all-notification/${id}`;
    })
  }

  
 /*
  * notification-list by department
  */
 if(location.pathname.includes('by-department')){
    let idDepartment =  location.pathname.replace('/by-department/', '');
    let url = `http://localhost:3000/notification/list/department/${idDepartment}`;
    let urlDepartment = `http://localhost:3000/notification/specific/department/${idDepartment}`;
    $('#btn-pre-list-notification').css('display', 'none')
    $('#btn-nex-list-notification').css('display', 'none')
    let allNotify = []

    console.log(urlDepartment)
    getDepartment(urlDepartment)
    .then(res => {
      console.log('hello', res)
      if(res.code == 200){
        $('#title-all-notification').html(res.msg.name)
      }
    })

    getNotification(url)
    .then(res => {
      if(res.code == 200){
        allNotify = res.msg;
        console.log(res)
        updateNotificationList(allNotify)
        activateNotificationCard()
      }
    });
 }

 function getDepartment(url){
   console.log('run')
   return fetch(url, {
     method: 'GET'
   }).then(data => data.json())
 }






  // ADMIN && DEPARTMENT
  if(location.pathname === '/admin' || location.pathname == '/department-dashboard'){
    let allDepartment = [];

    getDepartmentNotification()
      .then(res => {
        if(res.code == 200){
          allDepartment = res.msg;
          console.log(allDepartment)
          updateSelectDepartment()
          updateSelectedDepartmentNotification()
        }
      });

    function getDepartmentNotification(){
      const url = 'http://localhost:3000/notification/role-department/list'
      return fetch(url, {
        method: 'GET'
      }).then(data => data.json())
    }

    function updateSelectedDepartmentNotification(){
      allDepartment.forEach(d => {

        const optionEle = $(`
          <option value="${d._id}">${d.name}</option>
        `)
        $('#department-notification-create-notify').append(optionEle)
      })
    }

    function updateSelectDepartment(){
      allDepartment.forEach(d => {

        const checkboxDiv = $(`
        <div class="col-12 col-lg-6 ">
          <input type="checkbox" id="${d._id}" value="${d._id}">
          <label for="${d._id}"> ${d.name}</label>
        </div>
        `);

        $('#department-select-area').append(checkboxDiv);
      })
    }

    $('#btn-create-account').click(e => {
      let arrDepartmentChecked = [] 
      $('input[type="checkbox"]:checked').each((i, v) => {
        arrDepartmentChecked.push(v.value)
      })
      const body = {
        name: $('#name-create-account').val(),
        username: $('#username-create-account').val(),
        password: $('#password-create-account').val(),
        department: arrDepartmentChecked,
      }

      const url = 'http://localhost:3000/manage/register'
      fetch(url, {
        method: 'POST',
        headers:{
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })
      .then(data => data.json())
      .then(res => {
        if(res.code == 200){
          createAccountModalHide();
          notifySuccess(res.msg)
          arrDepartmentChecked = [] 
          $('#name-create-account').val(''),
          $('#username-create-account').val(''),
          $('#password-create-account').val(''),
          $('input[type="checkbox"]:checked').each((i, v) => {
            v.checked = false
          })
        }else{
          createAccountModalHide()
          notifyError(res.msg)
        }
      })
    })

    $('#btn-create-notify').click(e => {
      const url = 'http://localhost:3000/notification/add'
      fetch(url, {
        method: 'POST',
        headers:{
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: $('#title-notification-create-notify').val(),
          content: $('#content-notification-create-notify').val(),
          department: $('#department-notification-create-notify').val()
        })
      })
      .then(data => data.json())
      .then(res => {
        if(res.code == 200){
          createNotificationModalHide();
          notifySuccess(res.msg)
          $('#title-notification-create-notify').val('');
          $('#content-notification-create-notify').val('');
        }else{
          createNotificationModalHide()
          notifyError(res.msg)
        }
      })
    })

    function createAccountModalHide(){
      $('#createAccountModal').modal('hide');
    }
  }

    
 /*
  * notification-detail 
  */

 if(location.pathname.includes('/all-notification/')){
   const idNotification = location.pathname.replace('/all-notification/', '');
   getNotificationById(idNotification)
 }

 function getNotificationById(idNotification){
  const url = 'http://localhost:3000/notification/' + idNotification;
  fetch(url, {
    method: 'GET'
  })
  .then(data => data.json())
  .then(res => {
    if(res.code == 200){
      updateDetailNotification(res.msg)
    }
  })
 }

 function updateDetailNotification(data){
     const detailDiv = $(`
     <h2>${data.title}</h2>
     <span class="font-italic text-secondary">
         From: ${data.author.displayName} | ${data.department.name} | ${data.createAt}
     </span>
     <hr class="mt-04rem">
     <span>
         ${data.content}
     </span>
     `)
     $('#detail-notification').append(detailDiv)
 }
 


  // COMMON notify
  function notifySuccess(msg){
    $('#notification-success').html(msg);
    $('#notification-success').show();
    setTimeout(() => {
      $('#notification-success').hide();
    }, 3000)
   }
  function notifyError(msg){
  $('#notification-error').html(msg);
  $('#notification-error').show();
  setTimeout(() => {
    $('#notification-error').hide();
  }, 3000)
  }
  function notifyNotification(msg){
    const idNotify = msg.data._id
    const url = 'http://localhost:3000/by-department/' + idNotify;
    const notifyDiv = $(`
    <div id="${msg.data._id}" class="rounded m-2 py-3 px-4 bg-success text-white">
    ${msg.user} đã thêm một thông báo mới. <a href="${url}">Read now</a>
    </div>
    `)
    $('#notification-notify').append(notifyDiv)
    setTimeout(() => {
      $(`#${idNotify}`).remove();
    }, 4000)
  }

  function getAllDepartment(){
    const url = 'http://localhost:3000/notification/list/department';
    return fetch(url, {
      method: 'GET'
    })
    .then(data => data.json());
  }
  function createNotificationModalHide(){
    $('#createNotifyModal').modal('hide');
  }
  $('#video-post').click(e => {
    emptyValuePostModal()
    $('#sub-body-post-title').html('Link Youtube Video')
    $('#file-img').css('display', 'none')
    $('#script-yb').css('display', 'block')
  })

  $('#photo-post').click(e => {
    emptyValuePostModal()
    $('#sub-body-post-title').html('Photo')
    $('#file-img').css('display', 'block')
    $('#script-yb').css('display', 'none')
  })
  $('#status-post').click(e => {
    emptyValuePostModal()
    $('#sub-body-post-title').html('Photo')
    $('#file-img').css('display', 'block')
    $('#script-yb').css('display', 'none')
  })

  function emptyValuePostModal(){
    $('#file-img').val('')
    $('textarea#post-value').val('')
    $('#script-yb').val('');
  }

})