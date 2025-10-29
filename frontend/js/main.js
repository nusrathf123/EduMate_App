// Auth Page Toggle Script
const toggleLink = document.getElementById("toggle-link");
const formTitle = document.getElementById("form-title");
const authForm = document.getElementById("auth-form");

if (toggleLink) {
  toggleLink.addEventListener("click", () => {
    if (formTitle.textContent === "Login") {
      formTitle.textContent = "Sign Up";
      authForm.innerHTML = `
        <input type="text" placeholder="Full Name" required />
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">Sign Up</button>
      `;
      toggleLink.textContent = "Login";
      toggleLink.parentElement.innerHTML = `Already have an account? <span id="toggle-link">Login</span>`;
    } else {
      location.reload(); // reloads login form
    }
  });
}

// Navigation function
function navigate(page) {
  window.location.href = page;
}

// Logout function
function logout() {
  alert("You have been logged out!");
  window.location.href = "auth.html";
}

// ---------- STUDY PLANNER SCRIPT ----------
// ---------------------- PLANNER PAGE LOGIC ----------------------

let tasks = {};
let currentDate = new Date();
let selectedDate = new Date();

function navigate(page) {
  window.location.href = page;
}

// --- Notification Helper ---
function showNotification(message, overdue = false) {
  const container = document.getElementById("notification-container");
  const note = document.createElement("div");
  note.className = `notification ${overdue ? "overdue" : ""}`;
  note.textContent = message;
  container.appendChild(note);
  setTimeout(() => note.remove(), 5000);
}

// --- Calendar Rendering ---
const calendarDays = document.querySelector(".calendar-days");
const monthYear = document.getElementById("month-year");
const prevMonthBtn = document.getElementById("prev-month");
const nextMonthBtn = document.getElementById("next-month");

function renderCalendar(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  monthYear.textContent = `${date.toLocaleString("default", {
    month: "long",
  })} ${year}`;
  calendarDays.innerHTML = "";
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDay = firstDay.getDay();

  for (let i = 0; i < startDay; i++) {
    calendarDays.appendChild(document.createElement("div"));
  }

  for (let day = 1; day <= lastDay.getDate(); day++) {
    const dayDiv = document.createElement("div");
    dayDiv.textContent = day;

    const today = new Date();
    if (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    ) {
      dayDiv.classList.add("today");
    }

    if (
      day === selectedDate.getDate() &&
      month === selectedDate.getMonth() &&
      year === selectedDate.getFullYear()
    ) {
      dayDiv.classList.add("selected");
    }

    dayDiv.addEventListener("click", () => {
      selectedDate = new Date(year, month, day);
      renderCalendar(currentDate);
      document.getElementById("selected-date").textContent =
        selectedDate.toDateString();
      loadTasks();
    });

    calendarDays.appendChild(dayDiv);
  }
}

prevMonthBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar(currentDate);
});
nextMonthBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar(currentDate);
});
renderCalendar(currentDate);
document.getElementById("selected-date").textContent =
  selectedDate.toDateString();

// --- Task Logic ---
function addTask() {
  const input = document.getElementById("task-input");
  const deadlineInput = document.getElementById("deadline-input");
  const text = input.value.trim();
  const deadline = deadlineInput.value ? new Date(deadlineInput.value) : null;
  if (!text) return alert("Please enter a task!");

  const dateKey = selectedDate.toDateString();
  if (!tasks[dateKey]) tasks[dateKey] = [];

  tasks[dateKey].push({ text, done: false, deadline });
  input.value = "";
  deadlineInput.value = "";
  saveTasks();
  loadTasks();
}

function loadTasks() {
  const list = document.getElementById("task-list");
  list.innerHTML = "";
  const dateKey = selectedDate.toDateString();
  const dayTasks = tasks[dateKey] || [];

  dayTasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.classList.toggle("completed", task.done);

    let deadlineText = "";
    if (task.deadline) {
      const deadline = new Date(task.deadline);
      const isOverdue = deadline < new Date() && !task.done;
      const timeLeft = Math.ceil((deadline - new Date()) / (1000 * 60));
      deadlineText = isOverdue
        ? `<span style="color:#b94a4a">Overdue!</span>`
        : `<small>⏰ ${timeLeft} min left</small>`;
    }

    li.innerHTML = `
      <div>${task.text} ${deadlineText}</div>
      <div>
        <button onclick="toggleComplete(${index})">✔</button>
        <button onclick="deleteTask(${index})">✖</button>
      </div>
    `;
    list.appendChild(li);
  });

  updateProgress();
}

function toggleComplete(index) {
  const dateKey = selectedDate.toDateString();
  tasks[dateKey][index].done = !tasks[dateKey][index].done;
  saveTasks();
  loadTasks();
}

function deleteTask(index) {
  const dateKey = selectedDate.toDateString();
  tasks[dateKey].splice(index, 1);
  saveTasks();
  loadTasks();
}

function clearTasks() {
  const dateKey = selectedDate.toDateString();
  tasks[dateKey] = [];
  saveTasks();
  loadTasks();
}

function saveTasks() {
  localStorage.setItem("plannerTasks", JSON.stringify(tasks));
}

function loadSavedTasks() {
  const saved = localStorage.getItem("plannerTasks");
  if (saved) tasks = JSON.parse(saved);
}

// --- Progress Bar ---
function updateProgress() {
  const dateKey = selectedDate.toDateString();
  const dayTasks = tasks[dateKey] || [];
  const doneTasks = dayTasks.filter((t) => t.done).length;
  const percent = dayTasks.length ? (doneTasks / dayTasks.length) * 100 : 0;
  document.getElementById("progress-fill").style.width = `${percent}%`;
}

// --- Deadline Notification System ---
function checkDeadlines() {
  const now = new Date();
  Object.keys(tasks).forEach((dateKey) => {
    tasks[dateKey].forEach((task) => {
      if (!task.done && task.deadline) {
        const deadline = new Date(task.deadline);
        const diff = (deadline - now) / (1000 * 60); // minutes

        if (diff <= 1 && diff > 0) {
          showNotification(`⏰ Task "${task.text}" is due soon!`);
        } else if (diff <= 0 && diff > -1) {
          showNotification(`⚠️ Task "${task.text}" is now overdue!`, true);
        }
      }
    });
  });
}

// Run every minute
setInterval(checkDeadlines, 60000);

// --- Daily Quote ---
const quotes = [
  "Success is the sum of small efforts repeated daily.",
  "Discipline is the bridge between goals and accomplishment.",
  "Don’t let what you cannot do interfere with what you can do.",
  "Dream big, stay positive, work hard, and enjoy the journey.",
  "Push yourself because no one else is going to do it for you.",
];
document.getElementById("daily-quote").textContent =
  quotes[Math.floor(Math.random() * quotes.length)];

// --- Init ---
loadSavedTasks();
loadTasks();
checkDeadlines();

// ---------------- SMART NOTES SUMMARIZER (FRONTEND ONLY) ----------------

// When user clicks "Upload & Summarize"
const uploadBtn = document.getElementById("uploadBtn");
if (uploadBtn) {
  uploadBtn.addEventListener("click", () => {
    const fileInput = document.getElementById("fileInput");
    const summaryOutput = document.getElementById("summaryOutput");

    if (fileInput.files.length === 0) {
      summaryOutput.innerHTML = "<p style='color:#ffb3b3'>⚠️ Please select a file to summarize.</p>";
      return;
    }

    const file = fileInput.files[0];
    const fileName = file.name;

    // Temporary UI response (backend will handle actual summary)
    summaryOutput.innerHTML = `
      <p>📂 File Uploaded: <b>${fileName}</b></p>
      <p>⏳ Generating Summary... Please wait.</p>
    `;

    // Simulate summary (for now)
    setTimeout(() => {
      summaryOutput.innerHTML = `
        <h4>🧠 Summary Preview:</h4>
        <p>This is a simulated summary for <b>${fileName}</b>. 
        Once the backend AI module is connected, this area will automatically display 
        the generated key points and condensed notes from your uploaded file.</p>
        <ul>
          <li>• Main concepts and keywords extracted</li>
          <li>• Concise explanation of important ideas</li>
          <li>• Easy-to-revise bullet format</li>
        </ul>
      `;
    }, 2000);
  });
}

// ---------------- AI QUIZ GENERATOR (FRONTEND ONLY) ----------------
const generateQuizBtn = document.getElementById("generateQuizBtn");
if (generateQuizBtn) {
  generateQuizBtn.addEventListener("click", () => {
    const fileInput = document.getElementById("quizFileInput");
    const quizOutput = document.getElementById("quizOutput");
    const checkBtn = document.getElementById("checkAnswersBtn");

    if (fileInput.files.length === 0) {
      quizOutput.innerHTML = "<p style='color:#ffb3b3'>⚠️ Please select a file to generate a quiz.</p>";
      checkBtn.style.display = "none";
      return;
    }

    const file = fileInput.files[0];
    const fileName = file.name;

    // Temporary UI message
    quizOutput.innerHTML = `
      <p>📂 File Uploaded: <b>${fileName}</b></p>
      <p>🧠 Generating quiz... Please wait.</p>
    `;

    // Simulated quiz generation (backend will replace this)
    setTimeout(() => {
      const sampleQuiz = [
        {
          question: "1. What is Artificial Intelligence?",
          options: [
            "A: Human intelligence",
            "B: Machine performing tasks that require human intelligence",
            "C: Natural behavior of humans",
            "D: None of the above"
          ],
          correct: "B"
        },
        {
          question: "2. Which of the following is a supervised learning algorithm?",
          options: ["A: K-Means", "B: Linear Regression", "C: PCA", "D: Autoencoders"],
          correct: "B"
        },
        {
          question: "3. What does NLP stand for?",
          options: [
            "A: Natural Learning Process",
            "B: Natural Language Processing",
            "C: Neural Linguistic Programming",
            "D: None of the above"
          ],
          correct: "B"
        }
      ];

      quizOutput.innerHTML = "";
      sampleQuiz.forEach((q, index) => {
        const div = document.createElement("div");
        div.className = "quiz-question";
        div.innerHTML = `<p>${q.question}</p>`;
        q.options.forEach(opt => {
          const optionDiv = document.createElement("div");
          optionDiv.className = "quiz-option";
          const id = `q${index}_${opt[0]}`;
          optionDiv.innerHTML = `
            <input type="radio" name="q${index}" id="${id}" value="${opt[0]}" />
            <label for="${id}">${opt}</label>
          `;
          div.appendChild(optionDiv);
        });
        quizOutput.appendChild(div);
      });

      checkBtn.style.display = "block";

      // When "Check Answers" is clicked
      checkBtn.onclick = () => {
        const questions = quizOutput.querySelectorAll(".quiz-question");
        let score = 0;
        questions.forEach((q, i) => {
          const selected = q.querySelector("input[type='radio']:checked");
          if (selected && selected.value === sampleQuiz[i].correct) {
            score++;
            q.style.color = "#a7f3d0";
          } else {
            q.style.color = "#ffb3b3";
          }
        });
        alert(`✅ You scored ${score} / ${sampleQuiz.length}`);
      };
    }, 2000);
  });
}
