// document.addEventListener("DOMContentLoaded", () => {
//   // ========== Theme Toggle Setup ==========
//   const themeToggle = document.getElementById('theme-toggle');

//   function applyTheme(theme) {
//     if (theme === 'dark') {
//       document.body.classList.add('manual-dark');
//       themeToggle.textContent = '☀️ Light Mode';
//     } else {
//       document.body.classList.remove('manual-dark');
//       themeToggle.textContent = '🌙 Dark Mode';
//     }
//   }

//   if (themeToggle) {
//     const savedTheme = localStorage.getItem('theme') || 'light';
//     applyTheme(savedTheme);

//     themeToggle.addEventListener('click', () => {
//       const isDark = document.body.classList.toggle('manual-dark');
//       const theme = isDark ? 'dark' : 'light';
//       localStorage.setItem('theme', theme);
//       applyTheme(theme);
//     });
//   }

//   // ========== Salary Calculation ==========
//   const calculateBtn = document.getElementById('calculate');
//   calculateBtn.addEventListener('click', () => {
//     const startTime = document.getElementById('start').value;
//     const endTime = document.getElementById('end').value;
//     const day = document.getElementById('day').value;

//     const parseTime = t => {
//       const [h, m] = t.split(":").map(Number);
//       return h + m / 60;
//     };

//     let start = parseTime(startTime);
//     let end = parseTime(endTime);
//     if (end <= start) end += 24;

//     let total = 0;
//     const base = 60;
//     const add = (rate) => total += base * rate;

//     for (let h = start; h < end; h++) {
//       const hour = h % 24;
//       let rate = 1;

//       if (day === "Friday") {
//         if (hour >= 15 && hour < 19) rate = 1;
//         else if (hour >= 19 && hour < 22) rate = 1.5;
//         else if (hour >= 22 && hour < 23) rate = 1.75;
//       } else if (day === "Saturday") {
//         if (hour >= 15 && hour < 20) rate = 1.15;
//         else if (hour >= 20 && hour < 23) rate = 1.5;
//         else if (hour >= 23 || hour < 7) rate = (h - start) < 7 ? 1.15 : 1.25;
//         else rate = 1.5;
//       } else if (["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"].includes(day)) {
//         if (hour >= 23 || hour < 7) rate = (h - start) < 7 ? 1.15 : 1.25;
//       }

//       add(rate);
//     }

//     const resultDiv = document.getElementById('result');
//     resultDiv.textContent = `Total Pay: ₪${total.toFixed(2)}`;
//     resultDiv.classList.remove('hidden');
//   });
// });

function parseTime(t) {
  const [h, m] = t.split(":").map(Number);
  return h + m / 60;
}

function setShiftTimes(shift) {
  const startInput = document.getElementById("start");
  const endInput = document.getElementById("end");
  if (shift === "morning") {
    startInput.value = "07:00";
    endInput.value = "15:00";
  } else if (shift === "evening") {
    startInput.value = "15:00";
    endInput.value = "23:00";
  } else if (shift === "night") {
    startInput.value = "23:00";
    endInput.value = "07:00";
  } else {
    startInput.value = "";
    endInput.value = "";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const darkToggle = document.getElementById("darkToggle");
  const root = document.documentElement;
  const themeMeta = document.getElementById("theme-color-meta");

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    root.classList.add("dark");
    darkToggle.checked = true;
    themeMeta.setAttribute("content", "#121212");
  }

  darkToggle.addEventListener("change", () => {
    const isDark = darkToggle.checked;
    root.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
    themeMeta.setAttribute("content", isDark ? "#121212" : "#f9fafb");
  });

  document.getElementById("shift").addEventListener("change", (e) => {
    setShiftTimes(e.target.value);
  });

  document.getElementById("calculate").addEventListener("click", () => {
    const startVal = document.getElementById("start").value;
    const endVal = document.getElementById("end").value;
    const day = document.getElementById("day").value;

    if (!day || !startVal || !endVal) {
      alert("Please select a day and fill in start and end time.");
      return;
    }

    const start = parseTime(startVal);
    const end = parseTime(endVal);
    let actualStart = start;
    let actualEnd = end <= start ? end + 24 : end;

    let total = 0;
    const base = 60;
    const minutes = Math.round((actualEnd - actualStart) * 60);

    for (let i = 0; i < minutes; i++) {
      const h = Math.floor((actualStart * 60 + i) / 60) % 24;
      const minIdx = Math.floor(i / 60);
      let rate = 1;

      if (day === "Friday") {
        if (h >= 15 && h < 19) rate = 1;
        else if (h >= 19 && h < 22) rate = 1.5;
        else if (h >= 22 && h < 23) rate = 1.75;
      } else if (day === "Saturday") {
        if (h >= 15 && h < 20) rate = 1.15;
        else if (h >= 20 && h < 23) rate = 1.5;
        else if (h >= 23 || h < 7) rate = minIdx < 7 ? 1.15 : 1.25;
        else rate = 1.5;
      } else if (["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"].includes(day)) {
        if (h >= 23 || h < 7) rate = minIdx < 7 ? 1.15 : 1.25;
      }

      total += (base / 60) * rate;
    }

    const result = document.getElementById("result");
    result.textContent = `Total Pay: \u20AA${total.toFixed(2)}`;
    result.classList.remove("hidden");
    document.getElementById("back-button").classList.remove("hidden");
  });
});
