
let secretCode = ['5','0','5','0'];
let gameOver = false;
let memoryMode = false;
const gameContainer = document.getElementById("game-container");

const correctSound = new Audio('sounds/correct.wav');
const existsSound = new Audio('sounds/exists.wav');
const wrongSound = new Audio('sounds/wrong.wav');
const winSound = new Audio('sounds/win.wav');
const clickSound = new Audio('sounds/click.wav');
const inputSound = new Audio('sounds/input.wav');

function playSound(type) {
  if (type === "correct") correctSound.play();
  else if (type === "exists") existsSound.play();
  else if (type === "win") winSound.play();
  else if (type === "click") clickSound.play();
  else if (type === "input") inputSound.play();
  else wrongSound.play();
}

function showMessage(text) {
  const box = document.getElementById("message-box");
  const msg = document.getElementById("message-text");
  msg.textContent = text;
  box.classList.remove("hidden");
}

function closeMessage() {
  document.getElementById("message-box").classList.add("hidden");
}

function generateRandomCode() {
  secretCode = Array.from({length: 4}, () => Math.floor(Math.random() * 10).toString());
  showMessage("تم إنشاء كود عشوائي بنجاح!");
  resetGame();
}

function setSecret() {
  const input = document.getElementById("secret-input");
  const value = input.value;
  if (value.length === 4 && /^[0-9]{4}$/.test(value)) {
    secretCode = value.split("");
    input.value = "";
    showMessage("تم تعيين الكود الخاص!");
    resetGame();
  } else {
    showMessage("الرجاء إدخال كود مكون من 4 أرقام.");
  }
}

function toggleMode() {
  memoryMode = !memoryMode;
  document.getElementById("mode-label").textContent = memoryMode ? "محترف" : "عادي";
}

function createRow() {
  if (gameOver) return;

  const row = document.createElement("div");
  row.className = "row";

  for (let i = 0; i < 4; i++) {
    const input = document.createElement("input");
    input.type = "text";
    input.maxLength = 1;
    input.className = "box";
    input.inputMode = "numeric";

    input.addEventListener("input", () => {
      playSound("input");
      if (input.value.length === 1) {
        const inputs = row.querySelectorAll("input");
        const index = Array.from(inputs).indexOf(input);
        if (index < 3) inputs[index + 1].focus();
        else setTimeout(() => checkRow(row), 200);
      }
    });

    row.appendChild(input);
  }

  gameContainer.appendChild(row);
  row.querySelector("input").focus();
}

function checkRow(row) {
  const inputs = row.querySelectorAll("input");
  const guess = Array.from(inputs).map(i => i.value);
  let tempSecret = [...secretCode];
  const state = Array(4).fill("wrong");

  guess.forEach((val, i) => {
    if (val === secretCode[i]) {
      state[i] = "correct";
      tempSecret[i] = null;
      guess[i] = null;
    }
  });

  guess.forEach((val, i) => {
    if (val && tempSecret.includes(val)) {
      state[i] = "exists";
      tempSecret[tempSecret.indexOf(val)] = null;
    }
  });

  let allCorrect = true;
  inputs.forEach((input, i) => {
    input.classList.add(state[i]);
    input.disabled = true;
    playSound(state[i]);
    if (state[i] !== "correct") allCorrect = false;
  });

  if (memoryMode) {
    setTimeout(() => {
      inputs.forEach(input => {
        input.classList.remove("correct", "exists", "wrong");
        input.value = "";
        input.disabled = false;
      });
      inputs[0].focus();
    }, 1500);
    return;
  }

  if (allCorrect) {
    gameOver = true;
    setTimeout(() => {
      showMessage("🎉 تهانينا! لقد خمّنت الرقم بشكل صحيح!");
      playSound("win");
    }, 300);
  } else {
    setTimeout(createRow, 500);
  }
}

function resetGame() {
  gameOver = false;
  gameContainer.innerHTML = "";
  createRow();
}

window.onload = () => {
  createRow();
  document.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => playSound("click"));
  });
};
