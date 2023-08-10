"use strict";

// ? Extracting all HTML elements to work with
const timerEntry = document.getElementById("time__enter");
const incrementButton = document.getElementById("time__increment");
const decrementButton = document.getElementById("time__decrement");
const startBtn = document.getElementById("time__start");
const minsDisplay = document.getElementById("time__mins");
const secsDisplay = document.getElementById("time__secs");
const pauseResumeButton = document.getElementById("time__pause");
const resetButton = document.getElementById("time__reset");

// ? Make audio available
const timesUp = new Audio("alerts/times_up.wav");
const timerTicking = new Audio("alerts/timer_ticking.wav");

// ? State variables
let timerOn = false;
let paused = false;
let countdown;

let mins = 0;
let secs = 0;

// * Setting up default for mins & secs for countdown
function setShowMins(m = 5) {
  mins = m;
  minsDisplay.textContent = mins;
  secs = mins * 60;
}

// * updates time being displayed
const showMins = (m) => {
  minsDisplay.textContent = m;
};

// ? To let user manually enter countdown minutes
timerEntry.addEventListener("click", () => {
  const m = parseInt(prompt("Enter Minutes"));
  if (!isNaN(m)) setShowMins(m);
});

// ? changes the state of the UI once the time starts or finishes
const switchState = () => {
  timerOn = timerOn ? false : true;
  // console.log(timerOn);
  decrementButton.classList.toggle("hidden");
  incrementButton.classList.toggle("hidden");
  startBtn.classList.toggle("hidden");
  pauseResumeButton.classList.toggle("hidden");
  timerEntry.classList.toggle("hidden");
  secsDisplay.classList.toggle("hidden");
  secsDisplay.textContent = "";
};

// ? increase minute count by 1
incrementButton.addEventListener("click", () => {
  setShowMins(mins + 1);
});

// ? decrease minute count by 1
decrementButton.addEventListener("click", () => {
  // console.log(mins);
  if (mins > 0) {
    setShowMins(mins - 1);
  }
});

// ? SET local storage (cookie)
function setCookie() {
  // console.log(mins, secs);
  let userTimer = { mins: mins, secs: secs };
  // console.log(userTimer);
  localStorage.setItem("userTimer", JSON.stringify(userTimer));
  // console.log(JSON.parse(localStorage.getItem("userTimer")));
}

// ? Checks if user has previous pending countdowns
const timerCookie = JSON.parse(localStorage.getItem("userTimer"));
// * then it loads previous countdown
if (timerCookie) {
  mins = timerCookie.mins;
  secs = timerCookie.secs;
  switchState();
  pauseResumeTimer();
  showMins(mins - 1);
  secsDisplay.textContent = secs % 60;
} else {
  setShowMins();
}

// ? countdown logic
function startCountdown() {
  // console.log(mins);
  // console.log(secs % 60);
  // ? when timer starts we need to show -1 min
  showMins(mins - 1);
  secs = secs - 1;
  // ? shows the seconds
  secsDisplay.textContent = secs % 60;
  // * store mins and secs to the cookie
  setCookie();
  // ? resets the timer if 0 seconds are left
  if (secs === 0) {
    clearInterval(countdown);
    timerTicking.pause();
    timesUp.play();
    resetTimer();
    // ? or min decreases by 1 if seconds is fully divisible by 60
  } else if (secs % 60 === 0) {
    mins = mins - 1;
    showMins(mins);
  }
}

// * to trigger to start the countdown
startBtn.addEventListener("click", () => {
  if (timerOn === false && mins > 0) {
    switchState();
    timerTicking.play();
    countdown = setInterval(startCountdown, 1000);
    // console.log(countdown);
  }
});

// ? UI for Pause Button
function setPauseButton() {
  pauseResumeButton.innerText = "Pause";
  if (secs !== 0) resetButton.classList.toggle("hidden");
  pauseResumeButton.classList.remove("btn-success");
  pauseResumeButton.classList.add("btn-primary");
}

// ? UI Resume Button
function setResumeButton() {
  pauseResumeButton.innerText = "Resume";
  resetButton.classList.toggle("hidden");
  pauseResumeButton.classList.remove("btn-primary");
  pauseResumeButton.classList.add("btn-success");
}

// ? logic after user clicks Play/Pause button
function pauseResumeTimer() {
  // console.log("clicked");
  paused = paused ? false : true;
  if (paused) {
    timerTicking.pause();
    clearInterval(countdown);
    setResumeButton();
  } else {
    timerTicking.play();
    countdown = setInterval(startCountdown, 1000);
    setPauseButton();
  }
}

pauseResumeButton.addEventListener("click", pauseResumeTimer);

// ? Reset Logic
function resetTimer() {
  localStorage.removeItem("userTimer");
  paused = false;
  setPauseButton();
  switchState();
  setShowMins();
}

resetButton.addEventListener("click", resetTimer);
