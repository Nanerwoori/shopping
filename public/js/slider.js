const slides = document.querySelectorAll(".slide");

function nextSlide() {
  // Get Current class
  const current = document.querySelector(".current");

  // Remove current class
  current.classList.remove("current");

  // Check for next slide

  if (current.nextElementSibling) {
    // Add current class to next slibling
    current.nextElementSibling.classList.add("current");
  } else {
    slides[0].classList.add("current");
  }
}

function init() {
  if (slides) {
    setInterval(nextSlide, 3000);
  }
}

init();
