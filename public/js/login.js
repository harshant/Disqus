/**
*using froms for login lead to page refresh
*to overcome page refresh and to get user logged in 
*when pressing on password field registering an eventlistner
*/

// Get the input field
var input = document.getElementById("user_pass");

input.addEventListener("keyup", function (event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    event.preventDefault();
    // Triggering login button
    document.getElementById("login").click();
  }
});

//Login function
login = () => {
  fetch("http://localhost:4000/login/", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: `user_name=${document.getElementById("user_name").value}&user_pass=${document.getElementById("user_pass").value}`
  })
    .then(response => response.json())
    .then(async (json) => {
      if (json.token) {
        //storing jwt token
        await localStorage.setItem("jwt_token", json.token);

        //Popup for successfull login
        let x = document.getElementById("snackbar");
        x.innerHTML = "LoggedIn Successful";
        x.className = "show";
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);

        //User input for creating post
        let Post = document.getElementById("credentials");
        Post.innerHTML = "";
        Post.innerHTML = `
            <div class="input_name">Create Post:</div>
            <textarea class="input" type="text" id="post_main" style="height: 200px;" >
            </textarea>
            <br /><br />
            <button class="button" value="Submit" onclick="post()" id="login">Post</button>
        `
        let User = document.getElementById("user_image");
        User.innerHTML = `LogOut <img src="/images/${JSON.parse(window.atob(localStorage.getItem("jwt_token").split(".")[1]))["https://hasura.io/jwt/claims"]["x-hasura-avatar_no"]}.svg" alt="avatar" height="30" width="30" />`
      }
      else {
        //error message
        let x = document.getElementById("snackbar");
        x.innerHTML = json.msg;
        x.className = "show";
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
      }

      return json;
    })
    .catch(function (error) {
      //Show the error popup message
      let x = document.getElementById("snackbar");
      x.innerHTML = "Something Went Wrong";
      x.className = "show";
      setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
    });
}