
$(document).ready(() => {

  let allPosts = []
  let pagePost = 1;
  getAllPost();
  
  $('#notification-dashboard-success').hide();
  $('#notification-dashboard-error').hide();

  /* 
  * Login page
  */
    $('#btn-login-google').click(function (e) { 
        window.location.href = 'google'       
    });


  /*
  * Navbar
  */
   $('#btn-hide-navbar').click(() => {
     if($('#navbar-side').hasClass('hide-nav')){
      $('#navbar-side').removeClass('hide-nav');
      $('#div-content-right').removeClass('hide-nav');
    }else{
      $('#navbar-side').addClass('hide-nav');
      $('#div-content-right').addClass('hide-nav');
    }
   })

  /*
  * Dashboard
  */

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

   function getAllPost(){
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
        updatePost(allPosts)
        activatedDeletePost();
      }
    })

   }

   function postModalHide(){
    $('#postModal').modal('hide');
    $('textarea#post-value').val('')
   }

   function updatePost(arr){
     $('#news-feed').empty();
     arr.forEach(post => {
        const postDiv = $(`
        <div class="post my-2 rounded shadow-lg">
        <div id="${post._id}" class="post__header pt-2 px-3 d-flex justify-content-between">
            <div class="header__auth d-flex">
                <img src="${post.author.avatar}" alt="avatar" class="rounded-circle">
                <div class="d-flex flex-column px-2 py-1">
                    <span class="auth__name">${post.author.displayName}</span>
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
    })
    
   function notifySuccess(msg){
    $('#notification-dashboard-success').html(msg);
    $('#notification-dashboard-success').show();
    setTimeout(() => {
      $('#notification-dashboard-success').hide();
    }, 3000)
   }
   function notifyError(msg){
    $('#notification-dashboard-error').html(msg);
    $('#notification-dashboard-error').show();
    setTimeout(() => {
      $('#notification-dashboard-error').hide();
    }, 3000)
   }
})
