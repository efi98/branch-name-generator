const typeEnum: { 1: string; 2: string; 3: string } = {
  1: "Requirement",
  2: "Task",
  3: "Bug",
};
type SelectedType = 1 | 2 | 3;

const outputContent: HTMLElement = document.querySelector(
  ".output-content"
) as HTMLElement;
const numInput = document.getElementById("num") as HTMLInputElement;
const numLabel = document.getElementById("numLabel") as HTMLInputElement;
const taskNumContainer = document.getElementById(
  "taskNumContainer"
) as HTMLInputElement;
const nameInput = document.getElementById("name") as HTMLInputElement;
const nameLabel = document.getElementById("nameLabel") as HTMLInputElement;
const taskNameContainer = document.getElementById(
  "taskNameContainer"
) as HTMLInputElement;
const taskNumInput = document.getElementById("taskNum") as HTMLInputElement;
const taskNameInput = document.getElementById("taskName") as HTMLInputElement;
const copyButton = document.getElementById("copyButton") as HTMLButtonElement;

const typeBtns: NodeListOf<HTMLButtonElement> =
  document.querySelectorAll(".type-btn");
let selectedType: SelectedType = 2;

window.onload = (event: any) => {
  typeBtnClicked({ target: typeBtns[1] });
};

copyButton.addEventListener("click", copyButtonClicked);

// Check if all fields are filled to enable the 'Copy' button
numInput.addEventListener("input", checkFields);
nameInput.addEventListener("input", checkFields);
taskNumInput.addEventListener("input", checkFields);
taskNameInput.addEventListener("input", checkFields);

typeBtns.forEach((typeBtn) => {
  typeBtn.addEventListener("click", typeBtnClicked);
});

function typeBtnClicked(event: { target: any }): void {
  const currBtn: any = event.target;
  const currValue: any = currBtn.getAttribute("value");

  // Update the selectedButton variable
  selectedType = currValue;

  // Access the corresponding enum value
  const typeEnumVal: string =
    selectedType == 3 ? typeEnum[selectedType] : typeEnum[1];

  // Update the titles based on the selected type
  numLabel.textContent = `${typeEnumVal} number:`;
  nameLabel.textContent = `${typeEnumVal} name:`;

  // toggle the visibility of the task input

  toggleVisibility([taskNumContainer, taskNameContainer], selectedType == 2);

  // Remove the 'selected' class from all buttons
  typeBtns.forEach((btn) => btn.classList.remove("selected"));

  // Add the 'selected' class to the clicked button
  currBtn.classList.add("selected");

  checkFields();
}

function copyButtonClicked(): void {
  // Reset outputContent styles
  outputContent.style.color = "#000";

  const nameVal: string = nameInput.value;

  // Manipulate the name
  const manipulatedName: string = nameVal
    .trim()
    .replace(/\s+/g, "-")
    .toLowerCase();

  // Create the output string
  const NumInputVal: string = numInput.value;
  const outputString: string = createOutput(NumInputVal, manipulatedName);

  // Display the output in the appropriate section
  outputContent.textContent = outputString;

  // Enable the copy button
  copyButton.disabled = false;

  // Copy the output string to the clipboard
  navigator.clipboard
    .writeText(outputString)
    .then(() => {
      // Success message or any other action you want to take on success
      console.log(
        "%cText copied to clipboard: " + "%c" + outputString,
        "background: #efefef; border-radius: 5px 0 0 5px; border: 1px black solid;" +
          "padding: 3px 0 3px 3px; border-right: 0; font-family: Calibri,sans-serif;",
        "color: #007bff; background: #efefef; border-radius: 0 5px 5px 0; border: 1px black solid;" +
          "padding: 3px 3px 3px 0; border-left: 0; font-family: Calibri,sans-serif;"
      );
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

function checkFields(): void {
  const numValue: string = numInput.value.trim();
  const nameValue: string = nameInput.value.trim();

  if (selectedType == 2) {
    // If the type is 'task', check 'taskNum' and 'taskName' also.
    const taskNumValue: string = taskNumInput.value.trim();
    const taskNameValue: string = taskNameInput.value.trim();
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

function validateNum(element: { value: string }): void {
  const currentInput: string = element.value;
  const cleanedInput: string = currentInput.replace(/[^\d]/g, ""); // Remove non-digit characters
  element.value = cleanedInput; // Update the input value with only digits
}

function createOutput(numVal: string, manipulatedName: string): string {
  const typeEnumVal: string = typeEnum[selectedType];
  switch (typeEnumVal) {
    case typeEnum[1]:
      return `requirement/${numVal}-${manipulatedName}/${numVal}-${manipulatedName}`;
    case typeEnum[2]:
      return (
        `requirement/${numVal}-${manipulatedName}/task/${taskNumInput.value}-` +
        `${taskNameInput.value.trim().replace(/\s+/g, "-").toLowerCase()}`
      );
    case typeEnum[3]:
      return `bug/${numVal}-${manipulatedName}/${numVal}-${manipulatedName}`;
    default:
      return "ERROR";
  }
}

function toggleVisibility(elements: any[], visibility: boolean) {
  elements.forEach((element: { style: { display: string } }) => {
    element.style.display = visibility ? "block" : "none";
  });
}
// to do:
// name can't contains: "*^\:?~"
// save last state (requ, task. bug)
// add icons
// alert when user types forbidden chars (letters in num input for instance)
// move to TS
// new style
// add tips (not too long desc)
