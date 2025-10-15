# Branch name generator

## Description
A web app to generate branch names based on Azure DevOps or SnkeOS guidelines.

## Features

- Toggle between Azure DevOps and SnkeOS branch naming modes.
- Paste or manually enter work item titles (auto-detects type: Bug, Task, Requirement).
- For SnkeOS: select branch type (feature, bugfix, hotfix, version) and enter a name or version.
- Form validation for input format and forbidden characters.
- Submit to generate and copy branch name to clipboard.
- Copy branch name from results with a single click.
- Welcome and help dialogs for guidance.
<hr></hr>

## Running the App
### Locally

1. **Install dependencies**  
   Run:
   ```sh
   npm install
   ```
2. **Start the development server**  
   Run:
   ```sh
   npm start
   ```
   The app will be available at `http://localhost:3000`.

### Online
You can use the app directly in your browser (no installation needed):
[branch-name-generator](https://efi98.github.io/branch-name-generator)
<hr></hr>

## Usage

1. **Azure DevOps Mode** (default):
    - Paste or type your work item title (e.g., `Bug 12345: fix login issue`).
    - If the work item is a Task or Bug, you may need to enter a related Requirement.
    - Click **Submit** to generate branch names.
    - Click the copy icon to copy a branch name.

2. **SnkeOS Mode**:
    - Toggle to SnkeOS mode.
    - Select branch type (feature, bugfix, hotfix, version).
    - Enter a name (no only-whitespace, no spaces for non-version types) or version (`vMAJOR.MINOR.PATCH`).
    - Click **Submit & copy** to generate and copy the branch name.

## Validation

- Azure DevOps: Enforces strict format and disallows forbidden characters.
- SnkeOS:
    - For `version`, input must match `vMAJOR.MINOR.PATCH`.
    - For others, input cannot be only whitespace.

## Contact Options
If you have any questions, suggestions, or encounter issues while using this App, feel free to contact me via email: efigal148@gmail.com

## Version
Current Version: 3.0.0