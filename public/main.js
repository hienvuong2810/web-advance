
$(document).ready(() => {

  $('#notification-success').hide();
  $('#notification-error').hide();
  


  /* 
  * Login page
  */
    $('#btn-login-google').click(function (e) { 
        window.location.href = 'google'       
    });

    $('#btn-login').click(e => {
      const url = 'http://localhost:3000/login';
      fetch(url, {
        method: 'POST',
        headers:{
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "username": $("input[name=email]").val(),
          "password": $("input[name=password]").val()
        })
      })
      .then(data => data.json())
      .then(res => {
        if(res.code == 200){
          
        }
      })
    })


  /*
  * Navbar
  */

  if(location.pathname.includes('all-notification')){
    $('#dashboard-nav').removeClass('active');
    $('#all-notify-nav').removeClass('active');
    $('#by-department-nav').removeClass('active');
    
    $('#all-notify-nav').addClass('active');
  }else if(location.pathname.includes('all-department')){
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

   $('#dashboard-nav').click(e => {
     console.log('click')
     location.href = 'http://localhost:3000/dashboard'
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
     location.pathname = 'all-department'
   });

  /*
  * Dashboard
  */

  
  if(location.pathname.includes('dashboard')){
    let allPosts = []
    let pagePost = 1;

    const queryId = location.search?.replace('?id=', '');
    if(queryId){
      console.log(queryId)
      getPostById(queryId);
    }else{
      getAllPost();
    }

    $('#btn-post').click((e) => {
      const content = $('textarea#post-value').val();
      const url = 'http://localhost:3000/post/createPost'
      let formData = new FormData();
  
      formData.append('content', content);
      formData.append('image', '');
  
      fetch(url, {
        method: 'POST',
        body: formData
      })
      .then(data => data.json())
      .then(res => {
        if(res.code === 200){
         notifySuccess(res.msg)
         postModalHide()
         getAllPost()
        }else{
          notifyError(res.msg)
          postModalHide()
        }
      })
      
    })
  
    function getPostById(id, reset = true){
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
       if(arr.length != 10){
         $('#btn-load-more').css('visibility', 'hidden')
       }
       arr.forEach(post => {
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
                  ${post.content}
                  </span>
              </div>
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
                  </div>
                  <div class="comment d-flex">
                      <input type="text" placeholder="Write a public comment"
                          class="w-100 border m-3 p-2 rounded">
                  </div>
              </div>
          </div>
      </div>
          `);
          $('#news-feed').append(postDiv)
      });
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
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
              body: JSON.stringify(body)
          })
          .then(data => data.json())
          .then(res => {
              if(res.code == 200){
                  notifySuccess(res.msg)
                  $('#confirmModal').modal('hide');
                  getAllPost();
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
          location.search = `?id=${id}`
        })
      }
  
      $('#btn-load-more').click(e => {
        pagePost = pagePost + 1;
        if(!!!queryId){
          getPostById(queryId, false)
        }else{
          getAllPost(false)
        }
  
      })
      
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
  }

   
   
   
   
   /*
   * Department-list
   */
  if(location.pathname.includes('all-department')){
    let allDepartment = []
  
    getAllDepartment()
    function getAllDepartment(){
      const url = 'http://localhost:3000/notification/list/department';
      
      fetch(url, {
        method: 'GET'
      })
      .then(data => data.json())
      .then(res => {
        if(res.code == 200){
          allDepartment = res.msg;
          updateDepartment();
          activatedDepartmentClick();
        }
      })
    }
    
    function updateDepartment(){
      allDepartment.forEach(dep => {
        const departmentDiv = `
        <div class=" col-12 col-md-6 d-flex">
          <span data-id="${dep._id}" class="department-card border rounded shadow my-2 p-3 w-100"
            title="Click to see all notification of this department">${dep.name}</span>
        </div>
        `
        $('#list-department').append(departmentDiv);
      })
  
     
    }
  
    function activatedDepartmentClick(){
      $('.department-card').click(e => {
        const {id} = e.target.dataset;
      })
    }
  }



})