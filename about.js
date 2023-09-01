// Listen for the 'DOMContentLoaded' event, which means the HTML is fully loaded.
document.addEventListener("DOMContentLoaded", function() {
  
    // Get the element with the ID "cv-icon" from the HTML document and store it in a constant variable named cvIcon.
    const cvIcon = document.getElementById("cv-icon");

      // Add an 'click' event listener to the cvIcon element.
    cvIcon.addEventListener("click", function() {

       // Open the PDF file located at "CV/cmv.pdf" in a new browser tab.
      window.open("CV/cmv.pdf", "_blank");
    });
  });
  