// types
type SelectedType = 1 | 2 | 3;
type Settings = { selectedType: number };

// conf
const initialSettings: Settings = {
  selectedType: 2,
};

// main code
let settings: Settings = initialSettings;

const typeEnum: { 1: string; 2: string; 3: string } = {
  1: "Requirement",
  2: "Task",
  3: "Bug",
};

const outputContent: HTMLElement = document.querySelector(".output-content");
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
  document.querySelectorAll("button[uid='type-btn']");
let selectedType: SelectedType = 2;

window.onload = (event: any) => {
  try {
    settings = getDataFromLocalStorage();
  } catch (e) {
    console.error(e);
    setDataToLocalStorage(initialSettings);
  }

  // Trigger the click event for the corresponding type button based on the last selected state
  typeBtnClicked({ target: typeBtns[settings.selectedType - 1] });
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

  // Save the selected state to local storage
  setDataToLocalStorage({ ...settings, selectedType });

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
  outputContent.setAttribute('isDisabled', 'false');
  
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
        copyButton.textContent = "Generate & Copy";
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

  // Update output content based on field validation
  if (copyButton.disabled) {
    outputContent.textContent = "Fill all the fields to generate the branch name.";
  } else {
    outputContent.textContent = "Click on 'copy' and branch name will appear here.";
  }
}

function validateNum(element: { value: string }): void {
  const currentInput: string = element.value;
  const cleanedInput: string = currentInput.replace(/[^\d]/g, ""); // Remove non-digit characters
  element.value = cleanedInput; // Update the input value with only digits
}

function validateName(element: { value: string }): void {
  const currentInput: string = element.value;
  const cleanedInput: string = currentInput.replace(/[*^\\:?~]/g, ""); // Remove specific characters
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

function getDataFromLocalStorage() {
  let results = JSON.parse(localStorage.getItem("settings"));
  if (results) {
    return results;
  } else {
    throw new Error("There is no data such as `settings`.");
  }
}

function setDataToLocalStorage(settings: Settings) {
  localStorage.setItem("settings", JSON.stringify(settings));
}

function resetLocalStorageData() {
  localStorage.setItem("settings", JSON.stringify(initialSettings));
  settings = initialSettings;
}

// to do:
// move to TS (almost there)
// add icons
// add notfications
// alert when user types forbidden chars (letters in num input, or "*^\:?~" on name input)
// new style and also dark mode
// add tips (not too long desc)
// add dropdown option to 'bug' that replaced to 'bug under req.' (with the logic that req. num. and req. name are also stays)
// add setting page with:
// - the setting "advanced mode" toggle that replace the main page with advanced page, this will contains the auto detector for names (not design yet)
// - reset saved data as preppered settings and last state
