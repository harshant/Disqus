//function to upvote or downvote a comment

vote = async (comment_id, value) => {
  fetch("http://localhost:4000/vote/", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": `Bearer ${await localStorage.getItem("jwt_token")}`
    },
    body: `comment_id=${comment_id}&vote=${value}`
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
};