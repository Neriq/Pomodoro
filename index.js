document.addEventListener("DOMContentLoaded", () => {
  const settingsMenu = document.getElementById("settings-menu");
  const workTitle = document.getElementById("work");
  const breakTitle = document.getElementById("break");
  const workDurationInput = document.getElementById("work-duration");
  const breakDurationInput = document.getElementById("break-duration");
  const autoStartCheckbox = document.getElementById("auto-start");
  const cyclesInput = document.getElementById("cycles");
  const minutesElement = document.getElementById("minutes");
  const secondsElement = document.getElementById("seconds");
  const startButton = document.getElementById("start");
  const resetButton = document.getElementById("reset");
  const hamburgerButton = document.getElementById("hamburger");
  const endSound = new Audio("end-sound.mp3");

  let workTime = parseInt(workDurationInput.value);
  let breakTime = parseInt(breakDurationInput.value);
  let seconds = 0;
  let isWorkSession = true;
  let interval;
  let cycles = parseInt(cyclesInput.value);
  let completedCycles = 0;

  const toggleSettings = () => {
    settingsMenu.classList.toggle("show");
  };

  const updateDisplay = () => {
    const minutes = isWorkSession ? workTime : breakTime;
    minutesElement.textContent = minutes < 10 ? `0${minutes}` : minutes;
    secondsElement.textContent = seconds < 10 ? `0${seconds}` : seconds;
  };

  const startTimer = () => {
    startButton.style.display = "none";
    resetButton.style.display = "block";

    interval = setInterval(() => {
      if (seconds === 0) {
        if (isWorkSession) {
          if (workTime === 0) {
            endSound.play();
            isWorkSession = false; // Перехід до break сесії
            workTitle.classList.remove("active");
            breakTitle.classList.add("active");
            breakTime = parseInt(breakDurationInput.value);
            workTime = parseInt(workDurationInput.value); // Скидаємо work час на початковий
            seconds = 0; // Секунди скидаємо на 0
            updateDisplay();
          } else {
            workTime--;
            seconds = 59;
          }
        } else {
          if (breakTime === 0) {
            endSound.play();
            completedCycles++;
            if (completedCycles >= cycles) {
              clearInterval(interval); // Зупиняємо таймер після завершення всіх циклів
              workTitle.classList.add("active"); // Відображаємо work як активний екран
              breakTitle.classList.remove("active");
              startButton.style.display = "block";
              resetButton.style.display = "none";
              isWorkSession = true; // Перемикаємо на work сесію для подальших дій
              return;
            }
            isWorkSession = true; // Перехід до work сесії
            breakTitle.classList.remove("active");
            workTitle.classList.add("active");
            seconds = 0; // Секунди скидаємо на 0
            updateDisplay();
          } else {
            breakTime--;
            seconds = 59;
          }
        }
      } else {
        seconds--;
      }
      updateDisplay();
    }, 1000);
  };

  hamburgerButton.addEventListener("click", toggleSettings);

  document.addEventListener("click", (event) => {
    if (
      !settingsMenu.contains(event.target) &&
      !hamburgerButton.contains(event.target)
    ) {
      settingsMenu.classList.remove("show");
    }
  });

  startButton.addEventListener("click", startTimer);

  workDurationInput.addEventListener("input", () => {
    workTime = parseInt(workDurationInput.value);
    updateDisplay();
  });

  breakDurationInput.addEventListener("input", () => {
    breakTime = parseInt(breakDurationInput.value);
    updateDisplay();
  });

  cyclesInput.addEventListener("input", () => {
    cycles = parseInt(cyclesInput.value);
  });

  // Початковий стан - відображення Work
  workTitle.classList.add("active");
  breakTitle.classList.remove("active");
  updateDisplay();
});
