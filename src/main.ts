// types
type Theme = "light" | "dark" | "os";
type Settings = { selectedType: 1 | 2 | 3; selectedTheme: Theme };

// conf
const defaultSettings: Settings = {
  selectedType: 2,
  selectedTheme: "os",
};

// main code
let settings: Settings = defaultSettings;

const typeEnum: { 1: string; 2: string; 3: string } = {
  1: "Requirement",
  2: "Task",
  3: "Bug",
};

const themeSwitch: NodeListOf<HTMLButtonElement> = document.querySelectorAll(
  "button[uid='theme-btn']"
);

const outputContent: HTMLElement = document.querySelector(
  ".output-content"
) as HTMLElement;

const numInput: HTMLInputElement = document.getElementById(
  "num"
) as HTMLInputElement;
const numLabel: HTMLInputElement = document.getElementById(
  "numLabel"
) as HTMLInputElement;
const taskNumContainer: HTMLInputElement = document.getElementById(
  "taskNumContainer"
) as HTMLInputElement;

const nameInput: HTMLInputElement = document.getElementById(
  "name"
) as HTMLInputElement;
const nameLabel: HTMLInputElement = document.getElementById(
  "nameLabel"
) as HTMLInputElement;
const taskNameContainer: HTMLInputElement = document.getElementById(
  "taskNameContainer"
) as HTMLInputElement;
const taskNumInput: HTMLInputElement = document.getElementById(
  "taskNum"
) as HTMLInputElement;
const taskNameInput: HTMLInputElement = document.getElementById(
  "taskName"
) as HTMLInputElement;
const copyButton: HTMLButtonElement = document.getElementById(
  "copyButton"
) as HTMLButtonElement;

const typeBtns: NodeListOf<HTMLButtonElement> = document.querySelectorAll(
  "button[uid='type-btn']"
);

window.onload = (event: any) => {
  try {
    settings = getSettingsFromLocalStorage();
    const selectedThemeButton: HTMLElement = document.querySelector(
      `[uid="theme-btn"][value="${settings.selectedTheme}"]`
    ) as HTMLElement;
    if (selectedThemeButton) {
      selectedThemeButton.click();
    }
  } catch (e) {
    console.error(e);
    saveSettingsToLocalStorage(defaultSettings);

    const osThemeButton: HTMLElement = document.querySelector(
      '[uid="theme-btn"][value="os"]'
    ) as HTMLElement;
    if (osThemeButton) {
      osThemeButton.click();
    }

    // Set theme based on system preference
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.body.className = "dark";
    } else {
      document.body.className = "light";
    }
  }

  // Trigger the click event for the corresponding type button based on the last selected state
  typeBtnClicked({
    target: typeBtns[settings.selectedType - 1],
  });
};

copyButton.addEventListener("click", copyButtonClicked);

// Check if all fields are filled to enable the 'Copy' button
numInput.addEventListener("input", checkFields);
nameInput.addEventListener("input", checkFields);
taskNumInput.addEventListener("input", checkFields);
taskNameInput.addEventListener("input", checkFields);

typeBtns.forEach((typeBtn) =>
  typeBtn.addEventListener("click", typeBtnClicked)
);

themeSwitch.forEach((typeBtn) =>
  typeBtn.addEventListener("click", changeTheme)
);

function typeBtnClicked(event: { target: any }): void {
  const currBtn: any = event.target;
  const currValue: any = currBtn.getAttribute("value");

  // Update the selectedButton variable
  settings.selectedType = currValue;

  // Save the selected state to local storage
  saveSettingsToLocalStorage(settings);

  // Access the corresponding enum value
  const typeEnumVal: string =
    settings.selectedType == 3 ? typeEnum[settings.selectedType] : typeEnum[1];

  // Update the titles based on the selected type
  numLabel.textContent = `${typeEnumVal} number:`;
  nameLabel.textContent = `${typeEnumVal} name:`;

  // toggle the visibility of the task input
  toggleVisibility(
    [taskNumContainer, taskNameContainer],
    settings.selectedType == 2
  );

  // Remove the 'selected' class from all buttons
  typeBtns.forEach((btn) => btn.classList.remove("selected"));

  // Add the 'selected' class to the clicked button
  currBtn.classList.add("selected");

  checkFields();
}

function changeTheme(event: any) {
  themeSwitch.forEach((btn) => btn.classList.remove("selected"));
  const themeButton = event.target as HTMLButtonElement;
  const newTheme: Theme = themeButton.value as Theme;
  themeButton.classList.add("selected");

  // Update body class
  if (newTheme === "os") {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.body.className = "dark";
    } else {
      document.body.className = "light";
    }
  } else {
    document.body.className = newTheme;
  }

  // Update settings
  settings.selectedTheme = newTheme as Theme;
  saveSettingsToLocalStorage(settings);
}

function copyButtonClicked(): void {
  // Reset outputContent styles
  outputContent.setAttribute("isDisabled", "false");

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

  if (settings.selectedType == 2) {
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

  outputContent.setAttribute("isDisabled", "true");

  // Update output content based on field validation
  if (copyButton.disabled) {
    outputContent.textContent =
      "Fill all the fields to generate the branch name.";
  } else {
    outputContent.textContent =
      "Click on 'copy' and branch name will appear here.";
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
  const typeEnumVal: string = typeEnum[settings.selectedType];
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

function getSettingsFromLocalStorage() {
  let results = JSON.parse(localStorage.getItem("settings") ?? "");
  if (results) {
    return results;
  } else {
    throw new Error("There is no data such as `settings`.");
  }
}

function saveSettingsToLocalStorage(settings: Settings) {
  localStorage.setItem("settings", JSON.stringify(settings));
}

function resetLocalStorageData() {
  localStorage.setItem("settings", JSON.stringify(defaultSettings));
  settings = defaultSettings;
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
