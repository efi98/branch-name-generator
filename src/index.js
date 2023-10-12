const typeEnum = {
  1: "Requirement",
  2: "Task",
  3: "Bug",
};

const outputContent = document.querySelector(".output-content");
const NumInput = document.getElementById("num");
const NameInput = document.getElementById("name");
const TaskNumInput = document.getElementById("taskNum");
const TaskNameInput = document.getElementById("taskName");
const copyButton = document.getElementById("copyButton");
const typeBtns = document.querySelectorAll(".type-btn");
let selectedType = 2;

window.onload = (event) => {
  typeBtnClicked({ target: typeBtns[1] });
};

copyButton.addEventListener("click", copyButtonClicked);

// Check if all fields are filled to enable the 'Copy' button
NumInput.addEventListener("input", checkFields);
NameInput.addEventListener("input", checkFields);
TaskNumInput.addEventListener("input", checkFields);
TaskNameInput.addEventListener("input", checkFields);

typeBtns.forEach((typeBtn) => {
  typeBtn.addEventListener("click", typeBtnClicked);
});

function typeBtnClicked(event) {
  const currBtn = event.target;
  const currValue = currBtn.getAttribute("value");

  // Update the selectedButton variable
  selectedType = currValue;

  // Access the corresponding enum value
  const typeEnumVal = selectedType == 3 ? typeEnum[selectedType] : typeEnum[1];

  // Update the titles based on the selected type
  numLabel.textContent = `${typeEnumVal} number:`;
  nameLabel.textContent = `${typeEnumVal} name:`;

  // toggle the visibility of the task input
  const taskNumContainer = document.getElementById("taskNumContainer");
  const taskNameContainer = document.getElementById("taskNameContainer");
  toggleVisibility([taskNumContainer, taskNameContainer], selectedType == 2);

  // Remove the 'selected' class from all buttons
  typeBtns.forEach((btn) => btn.classList.remove("selected"));

  // Add the 'selected' class to the clicked button
  currBtn.classList.add("selected");

  checkFields();
}

function copyButtonClicked() {
  // Reset outputContent styles
  outputContent.style.color = "#000";

  const nameVal = NameInput.value;

  // Manipulate the name
  const manipulatedName = nameVal.trim().replace(/\s+/g, "-").toLowerCase();

  // Create the output string
  const NumInputVal = NumInput.value;
  const outputString = createOutput(NumInputVal, manipulatedName);

  // Display the output in the appropriate section
  outputContent.textContent = outputString;

  // Enable the copy button
  copyButton.disabled = false;

  // Copy the output string to the clipboard
  navigator.clipboard
    .writeText(outputString)
    .then(() => {
      // Success message or any other action you want to take on success
      console.log("Text copied to clipboard:", outputString);
      copyButton.textContent = "Copied!";
      setTimeout(() => {
        copyButton.textContent = "Copy";
      }, 3000);
    })
    .catch((err) => {
      // Handle any errors that may occur during copying
      console.error("Error copying text to clipboard:", err);
    });
}

function checkFields() {
  const numValue = NumInput.value.trim();
  const nameValue = NameInput.value.trim();

  if (selectedType == 2) {
    // If the type is 'task', check both 'taskNum' and 'taskName'
    const taskNumValue = TaskNumInput.value.trim();
    const taskNameValue = TaskNameInput.value.trim();
    copyButton.disabled = !(
      numValue &&
      nameValue &&
      taskNumValue &&
      taskNameValue
    );
  } else {
    // For other types, check only 'numValue' and 'nameValue'
    copyButton.disabled = !(numValue && nameValue);
  }
}

function validateNum(element) {
  const currentInput = element.value;
  const cleanedInput = currentInput.replace(/[^\d]/g, ""); // Remove non-digit characters
  element.value = cleanedInput; // Update the input value with only digits
}

function createOutput(numVal, manipulatedName) {
  const typeEnumVal = typeEnum[selectedType];
  switch (typeEnumVal) {
    case typeEnum[1]:
      return `requirement/${numVal}-${manipulatedName}/${numVal}-${manipulatedName}`;
    case typeEnum[2]:
      return `requirement/${numVal}-${manipulatedName}/task/${TaskNumInput.value}-${TaskNameInput.value.trim().replace(/\s+/g, "-").toLowerCase()}`;
    case typeEnum[3]:
      return `bug/${numVal}-${manipulatedName}/${numVal}-${manipulatedName}`;
  }
}

function toggleVisibility(elements, visibility) {
  elements.forEach((element) => {
    element.style.display = visibility ? "block" : "none";
  });
}
// to do
// save last state (requ, task. bug)
// add icons
// alert when user types forbidden chars (letters in num input for instance)
// move to TS
// new style
// add tips (not too long desc)