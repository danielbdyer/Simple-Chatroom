var modal = document.getElementById("usernameModal"),
  body = document.getElementsByTagName("body"),
  container = document.getElementById("main-display"),
  btnOpen = document.getElementById("openModal"),
  btnClose = document.getElementById("closeModal");

(btnOpen.onclick = function() {
  (modal.className = "modal is-visuallyHidden"),
    setTimeout(function() {
      (container.className = "parentcontainer is-blurred"),
        (modal.className = "modal");
    }, 100),
    (body.className = "modalopen");
}),
  (btnClose.onclick = function() {
    (modal.className = "modal is-hidden is-visuallyHidden"),
      (body.className = ""),
      (container.className = "parentcontainer"),
      (body.className = "");
  }),
  (window.onclick = function(e) {
    e.target == modal &&
      ((modal.className = "modal is-hidden"),
      (body.className = ""),
      (container.className = "parentcontainer"),
      (body.className = ""));
  });
