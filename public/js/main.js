document.addEventListener("DOMContentLoaded", () => {
  const alertElement = document.querySelector(".alert");

  if (alertElement) {
    alertElement.classList.add("fade-in");
    setTimeout(function() {
      alertElement.classList.remove("fade-in");

      alertElement.classList.add("fade-out");
    }, 4000);
  }
});
