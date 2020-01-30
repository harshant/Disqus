//function to create post(comment)

post = () => {
  fetch("http://localhost:4000/post/", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": `Bearer ${localStorage.getItem("jwt_token")}`
    },
    body: `post=${document.getElementById("post_main").value}`
  })
    .then(response => response.json())
    .then(json => {

      if (json.success) {
        //page refresh
        location.reload();
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
      x.innerHTML = "Something Went Wrong. Are you loggedin?";
      x.className = "show";
      setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
    });
}

//function to create post reply
post_reply = () => {
  fetch("http://localhost:4000/post/reply", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": `Bearer ${localStorage.getItem("jwt_token")}`
    },
    body: `reply=${document.getElementById("reply_main").value}&&reply_on=${localStorage.getItem("reply_on")}`
  })
    .then(response => response.json())
    .then(json => {

      if (json.success) {
        //page refresh
        location.reload();
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
      x.innerHTML = "Something Went Wrong. Are you loggedin?";
      x.className = "show";
      setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
    });
}
