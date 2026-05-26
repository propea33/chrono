const targetDate = new Date(2026, 5, 19, 15, 45, 0, 0);

const units = {
  days: document.querySelector("#days"),
  hours: document.querySelector("#hours"),
  minutes: document.querySelector("#minutes"),
  seconds: document.querySelector("#seconds"),
};

const message = document.querySelector("#message");
const board = document.querySelector(".board");
const canvas = document.querySelector("#drawingCanvas");
const context = canvas.getContext("2d");
const drawToggle = document.querySelector("#drawToggle");
const clearDrawing = document.querySelector("#clearDrawing");

let drawingEnabled = false;
let isDrawing = false;
let lastPoint = null;

function pad(value, length = 2) {
  return String(value).padStart(length, "0");
}

function updateCountdown() {
  const now = new Date();
  const remaining = Math.max(targetDate - now, 0);

  const days = Math.floor(remaining / 86_400_000);
  const hours = Math.floor((remaining % 86_400_000) / 3_600_000);
  const minutes = Math.floor((remaining % 3_600_000) / 60_000);
  const seconds = Math.floor((remaining % 60_000) / 1_000);

  units.days.textContent = pad(days);
  units.hours.textContent = pad(hours);
  units.minutes.textContent = pad(minutes);
  units.seconds.textContent = pad(seconds);

  if (remaining === 0) {
    message.textContent = "Bonnes vacances!";
  }

  requestAnimationFrame(updateCountdown);
}

updateCountdown();

function resizeCanvas() {
  const rect = board.getBoundingClientRect();
  const previous = document.createElement("canvas");
  const previousContext = previous.getContext("2d");
  const scale = window.devicePixelRatio || 1;

  previous.width = canvas.width;
  previous.height = canvas.height;
  previousContext.drawImage(canvas, 0, 0);

  canvas.width = Math.round(rect.width * scale);
  canvas.height = Math.round(rect.height * scale);
  canvas.style.width = `${rect.width}px`;
  canvas.style.height = `${rect.height}px`;

  context.setTransform(1, 0, 0, 1, 0, 0);
  context.scale(scale, scale);
  context.lineCap = "round";
  context.lineJoin = "round";
  context.strokeStyle = "rgba(255, 248, 220, 0.9)";
  context.lineWidth = 7;

  if (previous.width && previous.height) {
    context.drawImage(previous, 0, 0, previous.width / scale, previous.height / scale);
  }
}

function getPoint(event) {
  const rect = canvas.getBoundingClientRect();

  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}

function drawLine(point) {
  if (!lastPoint) {
    lastPoint = point;
  }

  context.beginPath();
  context.moveTo(lastPoint.x, lastPoint.y);
  context.lineTo(point.x, point.y);
  context.stroke();

  lastPoint = point;
}

drawToggle.addEventListener("click", () => {
  drawingEnabled = !drawingEnabled;
  drawToggle.setAttribute("aria-pressed", String(drawingEnabled));
  board.classList.toggle("drawing-mode", drawingEnabled);

  if (!drawingEnabled) {
    isDrawing = false;
    lastPoint = null;
  }
});

clearDrawing.addEventListener("click", () => {
  context.clearRect(0, 0, canvas.width, canvas.height);
});

canvas.addEventListener("pointerdown", (event) => {
  if (!drawingEnabled) {
    return;
  }

  isDrawing = true;
  lastPoint = getPoint(event);
  canvas.setPointerCapture(event.pointerId);
});

canvas.addEventListener("pointermove", (event) => {
  if (!drawingEnabled || !isDrawing) {
    return;
  }

  drawLine(getPoint(event));
});

canvas.addEventListener("pointerup", () => {
  isDrawing = false;
  lastPoint = null;
});

canvas.addEventListener("pointercancel", () => {
  isDrawing = false;
  lastPoint = null;
});

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
