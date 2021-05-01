
$(document).ready(() => {

  let allPosts = []
  
  $('#notification-dashboard-success').hide();
  $('#notification-dashboard-error').hide();
  getAllPost();

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
     console.log('hello')
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

   $('#status-post').click(e => {
    $('#btn-post').click((e) => {
      console.log('hello')
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
        }else{
          notifyError(res.msg)
          postModalHide()
        }
      })
      
    })
   })

   function getAllPost(){
     const url = 'http://localhost:3000/post/getPost'
    fetch(url, {
      method: 'GET'
    })
    .then(data => data.json())
    .then(res => {
      if(res.code == 200){
        allPosts = res.msg;
        console.log(allPosts)
        updatePost()
      }
    })

   }

   function postModalHide(){
    $('#postModal').modal('hide');
    $('textarea#post-value').val('')
   }

   function updatePost(){
    //  $('#news-feed').empty();
     const postDiv = $(`
     <div class="post my-2 rounded shadow-lg">
     <div class="post__header pt-2 px-3 d-flex justify-content-between">
         <div class="header__auth d-flex">
             <img src="{{user.avatar}}" alt="avatar" class="rounded-circle">
             <div class="d-flex flex-column px-2 py-1">
                 <span class="auth__name">{{user.displayName}}</span>
                 <span class="auth__date">December 23, 2021</span>
             </div>
         </div>
         <div class="header__option">
             <button class="rounded-circle">
                 <i class="fas fa-ellipsis-h"></i>
             </button>
         </div>
     </div>
     <div class="post__content">
         <div class="content__text py-2 px-3">
             <span>
                 Test trạng thái
             </span>
         </div>
         <div class="content__img">
             <img src="https://images.pexels.com/photos/132037/pexels-photo-132037.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260"
                 alt="img">
         </div>
     </div>
     <div class="post__react px-3">
         <div class="react__action">
             <div class="quantity py-2 d-flex justify-content-between">
                 <div class="like">
                     <i class="far fa-thumbs-up"></i>
                     <span class="mx-2">11</span>
                 </div>
                 <div class="comment">
                     <span class="">11 comments</span>
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
             <div class="comments d-flex flex-column">
                 <div class="user-comment d-inline-flex py-2">
                     <img src="{{user.avatar}}" alt="avatar" class="rounded-circle">
                     <div class="message ml-2 px-2 py-1 rounded">
                         <span class="user-comment__name">
                             {{user.displayName}}
                         </span>
                         <br />
                         <span>
                             Lorem ipsum dolor sit amet consectetur adipisicing elit. A, fugiat
                             impedit? Dignissimos esse impedit voluptates minus odio fuga,
                             explicabo blanditiis ullam eaque quo perspiciatis! Voluptas
                             voluptatem soluta iste, laudantium impedit aut reprehenderit
                             excepturi nihil! Nostrum numquam reprehenderit nulla blanditiis amet
                             recusandae incidunt ut fuga. Ab esse laborum inventore iure
                             suscipit. Possimus recusandae non rem perferendis magni minima ex
                             totam deleniti nostrum mollitia amet tempora, accusamus eveniet
                             labore dicta beatae numquam reiciendis quasi fugiat incidunt debitis
                             harum repudiandae at? Suscipit accusantium voluptate laudantium sunt
                             explicabo vitae nesciunt architecto maxime officia perferendis.
                             Eligendi commodi asperiores aliquid in fuga reprehenderit molestias
                             quis. Eligendi!
                         </span>
                     </div>
                     <div class="option">
                         <button class="rounded-circle mx-2">
                             <i class="fas fa-ellipsis-h"></i>
                         </button>
                     </div>
                 </div>
                 <div class="user-comment d-inline-flex py-2">
                     <img src="{{user.avatar}}" alt="avatar" class="rounded-circle">
                     <div class="message ml-2 px-2 py-1 rounded">
                         <span class="user-comment__name">
                             {{user.displayName}}
                         </span>
                         <br />
                         <span>
                             This is test message
                         </span>
                     </div>
                     <div class="option">
                         <button class="rounded-circle mx-2">
                             <i class="fas fa-ellipsis-h"></i>
                         </button>
                     </div>
                 </div>
             </div>
         </div>
     </div>
 </div>
     `)
   }
    
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
