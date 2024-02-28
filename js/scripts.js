let canHeaderHide = true;

// making a scroll-responsive header
let prevScrollPos = window.pageYOffset;
window.onscroll = function () {
  if (canHeaderHide) {
    const currentScrollPos = window.pageYOffset;
    if (prevScrollPos > currentScrollPos) {
      document.getElementById("main-header").style.top = "0";
    } else {
      document.getElementById("main-header").style.top = "-50px"; // Adjust this value based on your header height
    }
    prevScrollPos = currentScrollPos;
  } else {
    console.log("Header is temporarily prevented from hiding.");
  }
};

//opening and closing pop-up tabs, animating buttons
document.addEventListener('DOMContentLoaded', function () {
  var closeButtons = document.querySelectorAll('.close-button');
  var audio = new Audio('audio/click-tear.wav');
  audio.volume = 0.7;

  document.getElementById("about").addEventListener('click', function () {
    audio.play();
    document.getElementById("help-page").classList.remove("active");
    document.getElementById("progress-page").classList.remove("active");
    document.getElementById("about-page").classList.toggle("active");
  });

  document.getElementById("help").addEventListener('click', function () {
    audio.play();
    document.getElementById("about-page").classList.remove("active");
    document.getElementById("progress-page").classList.remove("active");
    document.getElementById("help-page").classList.toggle("active");
  });

  document.getElementById("progress").addEventListener('click', function () {
    audio.play();
    document.getElementById("help-page").classList.remove("active");
    document.getElementById("about-page").classList.remove("active");
    document.getElementById("progress-page").classList.toggle("active");
  });

  closeButtons.forEach(function (closeButton) {
    closeButton.addEventListener("click", function () {
      var audio = new Audio('audio/click-tear.wav');
      audio.play();
      canHeaderHide = false;
      document.getElementById("main-header").style.top = "0";
      document.getElementById("about-page").classList.remove("active");
      document.getElementById("help-page").classList.remove("active");
      document.getElementById("progress-page").classList.remove("active");
      setTimeout(() => {
        canHeaderHide = true;
      }, 500);
    });
  });

  var buttons = document.querySelectorAll('.button');

  buttons.forEach(function (button) {
    button.addEventListener('click', function () {
      button.classList.add('active');
      // Check if the clicked element has type "submit"
      if (button.getAttribute('type') === 'submit') {
        var audio = new Audio('audio/click2.mp3');
        audio.volume = 0.7;
        audio.play();
      } else {
        var audio = new Audio('audio/click1.mp3');
        audio.volume = 0.7;
        audio.play();
      }
      // Set a timeout to deactivate the button after 250 milliseconds (0.25 seconds)
      setTimeout(function () {
        // Deactivate the button (remove the "active" class)
        button.classList.remove('active');
      }, 250);
    });
  });
});



//Track player's use of hints
// localStorage.removeItem('hintUse');
// reset progress
document.addEventListener("DOMContentLoaded", function () {
  var hintUse = JSON.parse(localStorage.getItem('hintUse')) || [];
  var currentPage = document.body.getAttribute("data-page-id");
  var clueTexts = document.querySelectorAll(".clue-text");

  function noteHintUse(elementId) {
    // Get the existing hintUse array from localStorage or initialize it if it doesn't exist

    // Push the data of the clicked element and currentPage to the hintUse array
    hintUse.push({ elementId: elementId, currentPage: currentPage });

    // Update the hintUse array in localStorage
    localStorage.setItem('hintUse', JSON.stringify(hintUse));
  }

  document.getElementById("hint1").addEventListener("click", function () {
    clueTexts.forEach(function (clue) {
      clue.classList.add("bold");
    });
    document.getElementById("hint1").classList.add("helpful");
    noteHintUse("hint1");
  });
  document.getElementById("hint2").addEventListener("click", function () {
    document.getElementById("clue2").classList.remove("hidden");
    document.getElementById("hint2").classList.add("helpful");
    noteHintUse("hint2")
  });
  document.getElementById("hint3").addEventListener("click", function () {
    document.getElementById("clue3").classList.remove("hidden");
    document.getElementById("hint3").classList.add("helpful");
    noteHintUse("hint3")
  });



});

// Update hintUse in localStorage before leaving the page
window.addEventListener('beforeunload', function () {
  // Update the hintUse array in localStorage
  localStorage.setItem('hintUse', JSON.stringify(hintUse));
});



// localStorage.removeItem('gameProgress'); reset progress

//tracking user progress and checking passwords
document.addEventListener('DOMContentLoaded', function () {
  var currentPage = document.body.getAttribute("data-page-id");
  var puzzleSolved = false; // Initialize puzzleSolved variable
  // Retrieve the 'gameProgress' from local storage and parse it as JSON
  var gameProgress = JSON.parse(localStorage.getItem('gameProgress'));
  // If 'gameProgress' doesn't exist or is not an array, initialize a new array with "index" in the 0 spot
  if (!Array.isArray(gameProgress)) {
    gameProgress = ["index"];
  } else {
    // If 'gameProgress' exists and is an array, but it's empty, you can also initialize it with "index" in the 0 spot
    if (gameProgress.length === 0) {
      gameProgress.push("index");
    }
  }

  // Update local storage with the modified gameProgress array
  if (!gameProgress.includes(currentPage)) {
    gameProgress.push(currentPage);
  }
  console.log(gameProgress);
  localStorage.setItem('gameProgress', JSON.stringify(gameProgress));
  // }

  // Get the element where you want to display the progress list
  var progressListElement = document.getElementById("progress-list");

  // Create an unordered list
  var ul = document.createElement("ul");

  // Iterate through gameProgress and create list items with links
  gameProgress.forEach(function (pageId) {
    var li = document.createElement("li");
    var link = document.createElement("a");

    // Set the link href based on the pageId (replace "PageX" with your actual page names)
    link.href = pageId + ".html";

    // Set the link text content (replace with your desired content)
    link.textContent = pageId;

    // Append the link to the list item
    li.appendChild(link);

    // Append the list item to the unordered list
    ul.appendChild(li);
  });

  // Append the unordered list to the progress list element
  progressListElement.appendChild(ul);



  //Check passwords
  // Initialize an object to store page IDs and their respective correct passwords
  var pagePasswords = {
    "initiation": "l",
    "file": "placeholder",
    "architect": "river",
    "collapse": "UHall will not fall into the Oldman River.",
  };
  var correctPassword = pagePasswords[currentPage];
  var pageNextStep = {
    "initiation": "luck",
    "file": "fog",
    "fog": "architect",
    "collapse": "puzzle",
  };
  var correctNextStep = pageNextStep[currentPage];

  document.getElementById("my-form").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the form from submitting and reloading the page

    // Get the current page ID using cookies
    // var currentPage = getCurrentPage();

    // Check the entered password based on the current page
    var enteredPassword = document.getElementById("file-pass").value;

    if (enteredPassword === correctPassword) {
      puzzleSolved = true; // Set puzzleSolved to TRUE when the correct password is entered
      // updateProgressList(currentPage); // Update the progress list for the current page
      // gameProgress.push(currentPage);
      // localStorage.setItem("gameProgress", currentPage);
      // Flash the screen green for a second
      // updateGameProgress();
      document.body.style.backgroundColor = 'var(--green-light)';
      // document.main.style.backgroundColor = 'var(--green-medium)';
      setTimeout(function () {
        // Reset the background color to its original state
        document.body.style.backgroundColor = '';
        // document.main.style.backgroundColor = '';
        // Redirect to the next page if the password is correct
        window.location.href = correctNextStep + ".html";
      }, 1000);
    } else {
      document.body.style.backgroundColor = 'var(--red-light)';
      // document.main.style.backgroundColor = 'var(--red-medium)';
      setTimeout(function () {
        alert('Hmm... not what I was expecting. Try again.');
        // Reset the background color to its original state
        document.body.style.backgroundColor = '';
        // document.main.style.backgroundColor = '';
      }, 1000);
    }
  });
});








// document.addEventListener('DOMContentLoaded', function () {
//   const canvas = document.querySelector('.scratch-canvas');
//   const ctx = canvas.getContext('2d');
//   const image = new Image();
//   image.src = 'images\bldg-plan2.png';

//   image.onload = function () {
//     canvas.width = image.width;
//     canvas.height = image.height;
//     ctx.fillStyle = 'brown'; // Set fill color to brown
//     ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill canvas with brown color
//     ctx.globalCompositeOperation = 'destination-out';

//     // canvas.addEventListener('mousemove', function (e) {
//     //   const rect = canvas.getBoundingClientRect();
//     //   const x = e.clientX - rect.left;
//     //   const y = e.clientY - rect.top;

//     //   ctx.beginPath();
//     //   ctx.arc(x, y, 20, 0, Math.PI * 2);
//     //   ctx.fill();
//     // });
//   };
// });



