const form = document.getElementById("scheduleForm");
const ownerTable = document.getElementById("ownerTable").querySelector("tbody");
const monthFilter = document.getElementById("monthFilter");
const formView = document.getElementById("formView");
const ownerView = document.getElementById("ownerView");
const ownerLogin = document.getElementById("ownerLogin");
const loginError = document.getElementById("loginError");

let schedules = [];

window.onload = function () {
  const saved = localStorage.getItem("schedules");
  if (saved) {
    schedules = JSON.parse(saved);
  }
};

// ✅ Add delivery form submit
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const entry = {
    name: document.getElementById("name").value,
    position: document.getElementById("position").value,
    truckNumber: parseInt(document.getElementById("truckNumber").value),
    location: document.getElementById("location").value,
    timeOut: document.getElementById("timeOut").value,
    timeIn: document.getElementById("timeIn").value,
    date: document.getElementById("deliveryDate").value,
  };

  schedules.push(entry);
  localStorage.setItem("schedules", JSON.stringify(schedules));
  form.reset();
  alert("✅ Done!");
});

// ⬅️ Back to delivery form
function showFormView() {
  formView.style.display = "block";
  ownerView.style.display = "none";
  ownerLogin.style.display = "none";
}

// 🔐 Go to owner login
function requestOwnerLogin() {
  formView.style.display = "none";
  ownerLogin.style.display = "block";
  ownerView.style.display = "none";
}

// 🔐 Check owner password
function checkOwnerAccess() {
  const password = document.getElementById("ownerPassword").value;
  if (password === "dwagon123") {
    loginError.textContent = "";
    ownerLogin.style.display = "none";
    ownerView.style.display = "block";
    renderOwnerTable();
  } else {
    loginError.textContent = "Incorrect password!";
  }
}

// 📋 Filter by month
monthFilter.addEventListener("change", renderOwnerTable);

// 📊 Render owner table only
function renderOwnerTable() {
  const selectedMonth = monthFilter.value;
  ownerTable.innerHTML = "";

  const filtered = schedules.filter((entry) => {
    if (selectedMonth === "all") return true;
    return entry.date.split("-")[1] === selectedMonth;
  });

  filtered.forEach((entry, index) => {
    const row = ownerTable.insertRow();
    row.innerHTML = `
      <td>${entry.name}</td>
      <td>${entry.position}</td>
      <td>${entry.truckNumber}</td>
      <td>${entry.location}</td>
      <td>${entry.timeOut}</td>
      <td>${entry.timeIn}</td>
      <td>${entry.date}</td>
      <td><button onclick="deleteSchedule(${index})">❌</button></td>
    `;
  });
}

// ❌ Delete schedule entry
function deleteSchedule(index) {
  if (confirm("Are you sure you want to delete this schedule?")) {
    schedules.splice(index, 1);
    localStorage.setItem("schedules", JSON.stringify(schedules));
    renderOwnerTable();
  }
}

// 👁️ Show/hide password toggle
document.getElementById("togglePassword").addEventListener("change", function () {
  const passwordInput = document.getElementById("ownerPassword");
  passwordInput.type = this.checked ? "text" : "password";
});
