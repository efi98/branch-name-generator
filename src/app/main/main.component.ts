import { Component, OnInit } from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.scss"],
})
export class MainComponent implements OnInit {
  generatorForm!: FormGroup;
  constructor(private formBuilder: FormBuilder) {}

  // settings: Settings = defaultSettings;
  // typeEnum: { 1: string; 2: string; 3: string } = {
  //   1: "Requirement",
  //   2: "Task",
  //   3: "Bug",
  // };

  // themeSwitch: NodeListOf<HTMLButtonElement> = document.querySelectorAll(
  //   "button[uid='theme-btn']"
  // );

  // outputContent: HTMLElement = document.querySelector(
  //   ".output-content"
  // ) as HTMLElement;
  // numInput: HTMLInputElement = document.getElementById(
  //   "num"
  // ) as HTMLInputElement;
  // numLabel: HTMLInputElement = document.getElementById(
  //   "numLabel"
  // ) as HTMLInputElement;
  // taskNumContainer: HTMLInputElement = document.getElementById(
  //   "taskNumContainer"
  // ) as HTMLInputElement;
  // nameInput: HTMLInputElement = document.getElementById(
  //   "name"
  // ) as HTMLInputElement;
  // nameLabel: HTMLInputElement = document.getElementById(
  //   "nameLabel"
  // ) as HTMLInputElement;
  // taskNameContainer: HTMLInputElement = document.getElementById(
  //   "taskNameContainer"
  // ) as HTMLInputElement;
  // taskNumInput: HTMLInputElement = document.getElementById(
  //   "taskNum"
  // ) as HTMLInputElement;
  // taskNameInput: HTMLInputElement = document.getElementById(
  //   "taskName"
  // ) as HTMLInputElement;
  // copyButton: HTMLButtonElement = document.getElementById(
  //   "copyButton"
  // ) as HTMLButtonElement;

  // typeBtns: NodeListOf<HTMLButtonElement> = document.querySelectorAll(
  //   "button[uid='type-btn']"
  // );

  ngOnInit(): void {

    this.generatorForm = this.formBuilder.group({
      generalTask: ['', Validators.required],
      requirement: ['']
    });

      // try {
      //   this.settings = this.getSettingsFromLocalStorage();
      //   //implement: select the one that selected in the localStorage
      //   const selectedThemeButton: HTMLElement = document.querySelector(
      //     `[uid="theme-btn"][value="${this.settings.selectedTheme}"]`
      //   ) as HTMLElement;
      //   if (selectedThemeButton) {
      //     selectedThemeButton.click();
      //   }
      // } catch (e) {
      //   console.error(e);
      //   this.saveSettingsToLocalStorage(defaultSettings);

      //   const osThemeButton: HTMLElement = document.querySelector(
      //     '[uid="theme-btn"][value="os"]'
      //   ) as HTMLElement;
      //   if (osThemeButton) {
      //     osThemeButton.click();
      //   }

      //   // Set theme based on system preference
      //   if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      //     document.body.className = "dark";
      //   } else {
      //     document.body.className = "light";
      //   }
      // }

      // // Trigger the click event for the corresponding type button based on the last selected state
      // this.typeBtnClicked({
      //   target: this.typeBtns[this.settings.selectedType - 1],
      // });

      // ////// events
      // this.copyButton.addEventListener("click", this.copyButtonClicked);

      // // Check if all fields are filled to enable the 'Copy' button
      // this.numInput.addEventListener("input", this.checkFields);
      // this.nameInput.addEventListener("input", this.checkFields);
      // this.taskNumInput.addEventListener("input", this.checkFields);
      // this.taskNameInput.addEventListener("input", this.checkFields);

      // this.typeBtns.forEach((typeBtn) =>
      //   typeBtn.addEventListener("click", this.typeBtnClicked)
      // );
      // this.themeSwitch.forEach((typeBtn) =>
      //   typeBtn.addEventListener("click", this.changeTheme)
      // );
  }

  // typeBtnClicked(event: { target: any }): void {
  //   const currBtn: any = event.target;
  //   const currValue: any = currBtn.getAttribute("value");

  //   // Update the selectedButton variable
  //   this.settings.selectedType = currValue;

  //   // Save the selected state to local storage
  //   this.saveSettingsToLocalStorage({ ...this.settings });

  //   // Access the corresponding enum value
  //   const typeEnumVal: string =
  //     this.settings.selectedType == 3
  //       ? this.typeEnum[this.settings.selectedType]
  //       : this.typeEnum[1];

  //   // Update the titles based on the selected type
  //   this.numLabel.textContent = `${typeEnumVal} number:`;
  //   this.nameLabel.textContent = `${typeEnumVal} name:`;

  //   // toggle the visibility of the task input
  //   this.toggleVisibility(
  //     [this.taskNumContainer, this.taskNameContainer],
  //     this.settings.selectedType == 2
  //   );

  //   // Remove the 'selected' class from all buttons
  //   this.typeBtns.forEach((btn) => btn.classList.remove("selected"));

  //   // Add the 'selected' class to the clicked button
  //   currBtn.classList.add("selected");

  //   this.checkFields();
  // }

  // changeTheme(event: any) {
  //   this.themeSwitch.forEach((btn) => btn.classList.remove("selected"));
  //   const themeButton = event.target as HTMLButtonElement;
  //   const newTheme: Theme = themeButton.value as Theme;
  //   themeButton.classList.add("selected");

  //   // Update body class
  //   if (newTheme === "os") {
  //     if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
  //       document.body.className = "dark";
  //     } else {
  //       document.body.className = "light";
  //     }
  //   } else {
  //     document.body.className = newTheme;
  //   }

  //   // Update settings
  //   this.settings.selectedTheme = newTheme as Theme;
  //   this.saveSettingsToLocalStorage(this.settings);
  // }

  // copyButtonClicked(): void {
  //   // Reset outputContent styles
  //   this.outputContent.setAttribute("isDisabled", "false");

  //   const nameVal: string = this.nameInput.value;

  //   // Manipulate the name
  //   const manipulatedName: string = nameVal
  //     .trim()
  //     .replace(/\s+/g, "-")
  //     .toLowerCase();

  //   // Create the output string
  //   const NumInputVal: string = this.numInput.value;
  //   const outputString: string = this.createOutput(
  //     NumInputVal,
  //     manipulatedName
  //   );

  //   // Display the output in the appropriate section
  //   this.outputContent.textContent = outputString;

  //   // Enable the copy button
  //   this.copyButton.disabled = false;

  //   // Copy the output string to the clipboard
  //   navigator.clipboard
  //     .writeText(outputString)
  //     .then(() => {
  //       // Success message or any other action you want to take on success
  //       console.log(
  //         "%cText copied to clipboard: " + "%c" + outputString,
  //         "background: #efefef; border-radius: 5px 0 0 5px; border: 1px black solid;" +
  //           "padding: 3px 0 3px 3px; border-right: 0; font-family: Calibri,sans-serif;",
  //         "color: #007bff; background: #efefef; border-radius: 0 5px 5px 0; border: 1px black solid;" +
  //           "padding: 3px 3px 3px 0; border-left: 0; font-family: Calibri,sans-serif;"
  //       );
  //       this.copyButton.textContent = "Copied!";
  //       setTimeout(() => {
  //         this.copyButton.textContent = "Generate & Copy";
  //       }, 3000);
  //     })
  //     .catch((err) => {
  //       // Handle any errors that may occur during copying
  //       console.error("Error copying text to clipboard:", err);
  //     });
  // }

  // checkFields(): void {
  //   const numValue: string = this.numInput.value.trim();
  //   const nameValue: string = this.nameInput.value.trim();

  //   if (this.settings.selectedType == 2) {
  //     // If the type is 'task', check 'taskNum' and 'taskName' also.
  //     const taskNumValue: string = this.taskNumInput.value.trim();
  //     const taskNameValue: string = this.taskNameInput.value.trim();
  //     this.copyButton.disabled = !(
  //       numValue &&
  //       nameValue &&
  //       taskNumValue &&
  //       taskNameValue
  //     );
  //   } else {
  //     // For other types, check only 'numValue' and 'nameValue'
  //     this.copyButton.disabled = !(numValue && nameValue);
  //   }

  //   this.outputContent.setAttribute("isDisabled", "true");

  //   // Update output content based on field validation
  //   if (this.copyButton.disabled) {
  //     this.outputContent.textContent =
  //       "Fill all the fields to generate the branch name.";
  //   } else {
  //     this.outputContent.textContent =
  //       "Click on 'copy' and branch name will appear here.";
  //   }
  // }

  // validateNum(element: { value: string }): void {
  //   const currentInput: string = element.value;
  //   const cleanedInput: string = currentInput.replace(/[^\d]/g, ""); // Remove non-digit characters
  //   element.value = cleanedInput; // Update the input value with only digits
  // }

  // validateName(element: { value: string }): void {
  //   const currentInput: string = element.value;
  //   const cleanedInput: string = currentInput.replace(/[*^\\:?~]/g, ""); // Remove specific characters
  //   element.value = cleanedInput; // Update the input value with only digits
  // }

  // createOutput(numVal: string, manipulatedName: string): string {
  //   const typeEnumVal: string = this.typeEnum[this.settings.selectedType];
  //   switch (typeEnumVal) {
  //     case this.typeEnum[1]:
  //       return `requirement/${numVal}-${manipulatedName}/${numVal}-${manipulatedName}`;
  //     case this.typeEnum[2]:
  //       return (
  //         `requirement/${numVal}-${manipulatedName}/task/${this.taskNumInput.value}-` +
  //         `${this.taskNameInput.value
  //           .trim()
  //           .replace(/\s+/g, "-")
  //           .toLowerCase()}`
  //       );
  //     case this.typeEnum[3]:
  //       return `bug/${numVal}-${manipulatedName}/${numVal}-${manipulatedName}`;
  //     default:
  //       return "ERROR";
  //   }
  // }

  // toggleVisibility(elements: any[], visibility: boolean) {
  //   elements.forEach((element: { style: { display: string } }) => {
  //     element.style.display = visibility ? "block" : "none";
  //   });
  // }

  // getSettingsFromLocalStorage() {
  //   let results = JSON.parse(localStorage.getItem("settings") ?? "");
  //   if (results) {
  //     return results;
  //   } else {
  //     throw new Error("There is no data such as `settings`.");
  //   }
  // }

  // saveSettingsToLocalStorage(settings: Settings) {
  //   localStorage.setItem("settings", JSON.stringify(settings));
  // }

  // resetLocalStorageData() {
  //   localStorage.setItem("settings", JSON.stringify(defaultSettings));
  //   this.settings = defaultSettings;
  // }
}

// // types
// type Theme = "light" | "dark" | "os";
// type Settings = { selectedType: 1 | 2 | 3; selectedTheme: Theme };
//
// // conf
// const defaultSettings: Settings = {
//   selectedType: 2,
//   selectedTheme: "os",
// };
