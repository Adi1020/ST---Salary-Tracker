// app.js - improved segment-based rate handling

document.getElementById('calculate').addEventListener('click', () => {
  const startTime = document.getElementById('start').value;
  const endTime = document.getElementById('end').value;
  const day = document.getElementById('day').value;

  const parseTime = t => {
    const [h, m] = t.split(":").map(Number);
    return h + m / 60;
  };

  let start = parseTime(startTime);
  let end = parseTime(endTime);
  if (end <= start) end += 24;

  let total = 0;
  const base = 60;

  const add = (rate) => total += base * rate;

  for (let h = start; h < end; h++) {
    const hour = h % 24;
    let rate = 1;

    if (day === "Friday") {
      if (hour >= 15 && hour < 19) rate = 1;
      else if (hour >= 19 && hour < 22) rate = 1.5;
      else if (hour >= 22 && hour < 23) rate = 1.75;
      else rate = 1;
    } else if (day === "Saturday") {
      if (hour >= 15 && hour < 20) rate = 1.15;
      else if (hour >= 20 && hour < 23) rate = 1.5;
      else if (hour >= 23 || hour < 7) rate = (h - start) < 7 ? 1.15 : 1.25;
      else rate = 1.5;
    } else if (day === "Sunday" || day === "Monday" || day === "Tuesday" || day === "Wednesday" || day === "Thursday") {
      if (hour >= 23 || hour < 7) rate = (h - start) < 7 ? 1.15 : 1.25;
      else rate = 1;
    } else {
      rate = 1;
    }

    add(rate);
  }

  const resultDiv = document.getElementById('result');
  resultDiv.textContent = `Total Pay: ₪${total.toFixed(2)}`;
  resultDiv.classList.remove('hidden');
});
