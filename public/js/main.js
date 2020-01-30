localStorage.setItem("offset", 0);
// Begin once DOM loaded
document.addEventListener("DOMContentLoaded", disqus);

function disqus() {

  //check if logged in
  if (localStorage.getItem("jwt_token")) {

    //replate the username password with post input box
    let Post = document.getElementById("credentials");
    Post.innerHTML = `
            <div class="input_name">Create Post:</div>
            <textarea class="input" type="text" id="post_main" style="height: 200px;" >
            </textarea>
            <br /><br />
            <button class="button" value="Submit" onclick="post()" id="login">Post</button>
        `
    //display user avatar using avatar_no from jwt_token
    let User = document.getElementById("user_image");
    User.innerHTML = `LogOut <img src="/images/${JSON.parse(window.atob(localStorage.getItem("jwt_token").split(".")[1]))["https://hasura.io/jwt/claims"]["x-hasura-avatar_no"]}.svg" alt="avatar" height="30" width="30" />`
  }

  //logout
  logout = () => {
    //modifying according to logout view
    let User = document.getElementById("user_image");
    User.innerHTML = ""

    let Post = document.getElementById("credentials");
    Post.innerHTML = `
              <div class="input_name">User Name:</div>
              <input class="input" type="text" id="user_name" value="" />
              
              <div class="input_name">Password:</div>
              <input class="input" type="password" id="user_pass" value="" />
              <br /><br />
              <button class="button" value="Submit" onclick="login()" id="login">Login/Signup</button>
        `
    //removing JWT
    localStorage.removeItem("jwt_token");
  }

  //declaring array as queue for BFS
  let queue = [];

  //function to get replies of main post(comment)
  get_replies = async (comment_id) => {

    try {
      let response = await fetch("http://localhost:4000/comments/replys", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `comment_id=${comment_id}`
      })
      let json = await response.json();

      if (json.data) {
        let Reply = document.getElementById(`comment${comment_id}`);
        Reply.innerHTML = "";
        for (let i = 0; i < json.data.length; i++) {
          Reply.innerHTML += `
            <div class="thread">
                  <div class="image">
                    <img src="/images/${json.data[i].commentByReply.user.avatar_no}.svg" alt="avatar" height="42" width="42" />
                  </div>
                  <div class="votes">
                    <div onclick="vote(${json.data[i].commentByReply.comment_id},1)">˄</div>
                    <div>${json.data[i].commentByReply.votes_aggregate.aggregate.sum.value == null ? "0" :
              json.data[i].commentByReply.votes_aggregate.aggregate.sum.value}</div>
                    <div onclick="vote(${json.data[i].commentByReply.comment_id},-1)">˅</div>
                  </div>
                  <div class="topic">
                    <div class="name_time">
                      <div class="name">
                      ${json.data[i].commentByReply.user.user_name}
                      </div>
                      <div class="time">
                      ${new Date(json.data[i].commentByReply.timestamp * 1000).toString().substring(4, 10) + " " + new Date(json.data[i].commentByReply.timestamp * 1000).toString().substring(16, 21) + " hr"}

                      </div>
                    </div>
                    <div class="main_comment">
                    ${json.data[i].commentByReply.comment}
                    </div>
                    <div class="reply" onclick="reply_box(${json.data[i].commentByReply.comment_id})">
                      reply
                    </div>
                    <div class="comments" id="comment${json.data[i].commentByReply.comment_id}">
                      
                    </div>
                  </div>
                </div>`

          //pushing the comment_id into queue
          queue.push(json.data[i].commentByReply.comment_id);
        }

      } else {
        let x = document.getElementById("snackbar");
        x.innerHTML = `${json.msg}`;
        x.className = "show";
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
      }

      return json;
    } catch (error) {
      let x = document.getElementById("snackbar");
      x.innerHTML = "Something Went Wrong";
      x.className = "show";
      setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
    };

  }

  //Loading comments
  get_comments = (increase) => {

    fetch("http://localhost:4000/comments/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: `offset=${localStorage.getItem("offset")}`
    })
      .then(response => response.json())
      .then(async (json) => {

        if (json.data) {
          let Posts = document.getElementById("posts");
          Posts.innerHTML = "";
          for (let i = 0; i < json.data.length; i++) {

            Posts.innerHTML += `
          <div class="thread">
                  <div class="image">
                    <img src="/images/${json.data[i].user.avatar_no}.svg" alt="avatar" height="42" width="42" />
                  </div>
                  <div class="votes">
                    <div onclick="vote(${json.data[i].comment_id},1)">˄</div>
                    <div>${json.data[i].votes_aggregate.aggregate.sum.value == null ? "0" : json.data[i].votes_aggregate.aggregate.sum.value}</div>
                    <div onclick="vote(${json.data[i].comment_id},-1)">˅</div>
                  </div>
                  <div class="topic">
                    <div class="name_time">
                      <div class="name">
                      ${json.data[i].user.user_name}
                      </div>
                      <div class="time">
                        ${new Date(json.data[i].timestamp * 1000).toString().substring(4, 10) + " " + new Date(json.data[i].timestamp * 1000).toString().substring(16, 21) + " hr"}
                      </div>
                    </div>
                    <div class="main_comment">
                    ${json.data[i].comment}
                    </div>
                    <div class="reply" onclick="reply_box(${json.data[i].comment_id})">
                      reply
                    </div>
                    <div class="comments" id="comment${json.data[i].comment_id}">
                      
                    </div>
                  </div>
                </div>`

            //inserting visited comment in queue
            queue.push(json.data[i].comment_id);

            while (queue.length > 0) {
              //Using BFS traversal to get all replys
              let comment_id = queue.shift()
              await get_replies(comment_id);
            }
          }

          //increment offset according to increase is positive or negative
          if (increase && json.data.length > 0)
            localStorage.setItem("offset", parseInt(localStorage.getItem("offset")) + 5);
          else if (!increase && localStorage.getItem("offset") >= 5)
            localStorage.setItem("offset", parseInt(localStorage.getItem("offset")) - 5);
          else {
            let x = document.getElementById("snackbar");
            x.innerHTML = `Nothing more to Show`;
            x.className = "show";
            setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
          }

        } else {
          let x = document.getElementById("snackbar");
          x.innerHTML = `${json.msg}`;
          x.className = "show";
          setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
        }

        return json;
      })
      .catch(function (error) {
        let x = document.getElementById("snackbar");
        x.innerHTML = "Something Went Wrong";
        x.className = "show";
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
      });
  }

  get_comments(true);
}
