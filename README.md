# Branch name generator

## Description
This App is a utility for generating formatted strings based on different task types. It allows you to create output strings for conventional branch name for Requirements, Tasks, and Bugs.

## Getting Started
First of all, make sure to install the necessary dependencies by running `npm install`.

## Usage
1. To launch the app, run the command `npm start` in your terminal.
2. Select the type (Requirement, Task, or Bug) by clicking the corresponding button.
3. Fill in the appropriate fields.
4. Click the **"generate & Copy"** button to copy the output string to your clipboard.

> The script will generate a formatted output string based on the selected type and input values and will be displayed in the output section.

> The generated output string is copied to the clipboard automatically for easy use.

## Examples
- **Requirement**: `requirement/123-my-branch-name/123-my-branch-name`
- **Task**: `requirement/456-my-branch-name/task/456-task-name`
- **Bug**: `bug/789-my-branch-name/789-my-branch-name`

> **Note:** <span style="color: orange"> you can't write letters on 'number' field, and you can't type these chars (**\*, ^, \\, :, ?, ~**) on 'name' field. </span>


## Contact Options
If you have any questions, suggestions, or encounter issues while using this App, feel free to contact me via email: efigal148@gmail.com

## Version
Current Version: 1.0.2

## Release updates
- added link to source code
- "copy" replaced with "generate & copy" to clarify
- now the last state of user choise (req., task or bug) is reserved.