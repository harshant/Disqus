
//for handeling closing of modal
var modal = document.querySelector(".modal");
var closeButton = document.querySelector(".close-button");

function toggleModal() {
  modal.classList.toggle("show-modal");
}

function windowOnClick(event) {
  if (event.target === modal) {
    toggleModal();
  }
}

closeButton.addEventListener("click", toggleModal);
window.addEventListener("click", windowOnClick);

//function to display model
reply_box = (comment_id) => {
  //storing the comment_id of reply
  localStorage.setItem("reply_on", comment_id);
  //show modal
  document.querySelector(".modal").classList.toggle("show-modal")
}