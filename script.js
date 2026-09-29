const form = document.getElementById("enrollmentForm");
const successMessage = document.getElementById("successMessage");
const majorGroup = document.getElementById("majorGroup");
const courseSelect = document.getElementById("course");
const recordsBody = document.getElementById("recordsBody");


const textRules = {
  studentId:  { label: "Student ID",  required: true,  min: 5 },
  prefix:     { label: "Prefix",      required: false, min: 2 },
  firstName:  { label: "First name",  required: true,  min: 3 },
  middleName: { label: "Middle name", required: false, min: 2 },
  lastName:   { label: "Last name",   required: true,  min: 2 },
  suffix:     { label: "Suffix",      required: false, min: 2 }
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getValue(id) {
  return document.getElementById(id).value.trim();
}


function validateField(id) {
  const value = getValue(id);

  if (textRules[id]) {
    const { label, required, min } = textRules[id];
    if (!value) return required ? label + " is required." : "";
    if (value.length < min) return label + " must be at least " + min + " characters.";
    return "";
  }

  switch (id) {
    case "email":
      if (!value) return "Email is required.";
      if (!emailPattern.test(value)) return "Enter a valid email address, like name@example.com.";
      return "";
    case "course":
      return value ? "" : "Select a course.";
    case "major":
      if (getValue("course") !== "BSIT") return "";
      return value ? "" : "Select a major for BSIT.";
    case "year":
      return value ? "" : "Select a year level.";
  }
  return "";
}

function showError(id, message) {
  document.getElementById(id + "-error").textContent = message;
  document.getElementById(id).classList.toggle("invalid", Boolean(message));
}

function clearError(id) {
  showError(id, "");
}


function updateMajorVisibility() {
  const isBSIT = courseSelect.value === "BSIT";
  majorGroup.hidden = !isBSIT;
  if (!isBSIT) {
    document.getElementById("major").value = "";
    clearError("major");
  }
}

function addRecordRow(data) {
  const emptyRow = document.getElementById("emptyRow");
  if (emptyRow) emptyRow.remove();

  const fullName = [data.prefix, data.firstName, data.middleName, data.lastName, data.suffix]
    .filter(Boolean)
    .join(" ");

  const cells = [data.studentId, fullName, data.email, data.course, data.major || "—", data.year];
  const row = document.createElement("tr");
  cells.forEach(function (text) {
    const td = document.createElement("td");
    td.textContent = text; // textContent keeps user input from being read as HTML
    row.appendChild(td);
  });
  recordsBody.appendChild(row);
}


form.addEventListener("input", function (e) {
  if (e.target.id) clearError(e.target.id);
  successMessage.hidden = true;
});

form.addEventListener("change", function (e) {
  if (e.target.id) clearError(e.target.id);
  if (e.target.id === "course") updateMajorVisibility();
});

form.addEventListener("submit", function (e) {
  e.preventDefault();
  successMessage.hidden = true;

  const fieldIds = Object.keys(textRules).concat(["email", "course", "major", "year"]);
  let firstInvalid = null;

  fieldIds.forEach(function (id) {
    const message = validateField(id);
    showError(id, message);
    if (message && !firstInvalid) firstInvalid = document.getElementById(id);
  });

  if (firstInvalid) {
    firstInvalid.focus();
    return;
  }

  const data = {};
  fieldIds.forEach(function (id) { data[id] = getValue(id); });

  addRecordRow(data);

  successMessage.textContent = data.firstName + " " + data.lastName + " (" + data.studentId + ") was enrolled successfully.";
  successMessage.hidden = false;

  form.reset();
  updateMajorVisibility();
});
