const targetDate = new Date(2026, 5, 19, 15, 45, 0, 0);

const units = {
  days: document.querySelector("#days"),
  hours: document.querySelector("#hours"),
  minutes: document.querySelector("#minutes"),
  seconds: document.querySelector("#seconds"),
};

const message = document.querySelector("#message");

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
