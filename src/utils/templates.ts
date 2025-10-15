import {FieldType} from "@app-utils";

export const templateWorkItemFormat = (type: FieldType): string => {
    const templateType = type === 'workItem' ? 'work item' : 'requirement';
    return `<div>
    <div><strong>Valid values must adhere strictly to the following format:</strong></div>
    <div>[(${templateType} Type) (${templateType} Number): (${templateType} Title)]</div>
    <br>
    <div><i>More detailed explanation about these valid values follows:</i></div>
    <div><strong>Work Item Type:</strong> ${type === 'workItem' ? `'Requirement', 'Task', or 'Bug'.` : `'Requirement' ONLY!`}</div>
    <div><strong>Work Item Number:</strong> Only numbers and must be exactly 5 digits.</div>
    <div><strong>Work Item Title:</strong> Comprises alphanumeric characters and symbols, excluding (*^\\:?~).</div>
    <br>
    <div>
        <span><strong>Example${type === 'workItem' ? 's' : ''}:</strong></span>
        <br>
        <small>Requirement 12345: Example Title - of req. & more</small>
        ${type === 'workItem' ? `<br>
        <small>Task 67785: the 7 of this UNDEFINED again</small>
        <br>
        <small>Bug 93332: all THESE are valid 1234567890-./,;|[]{}-=_+)(&%$#@!</small>` : ''}
    </div>
</div>`
};

export const welcomeMessage: string = `
<div>
<h4>Here are few guidelines for you:</h4>
 <ul>
    <li>Use the toggle to switch between <b>Azure DevOps</b> and <b>SnkeOS</b> branching guidelines.</li>
 <h5>Azure DevOps</h5>
    <li>Paste your work item title directly from Azure DevOps or enter it manually.</li>
    <li>The app will detect the work item type (Bug, Task, or Requirement) automatically.</li>
    <li>Fill in all required fields, then click <b>Submit</b> to generate your branch name.</li>
    
 <h5>SnkeOS</h5>
    <li>Select the branch type and enter a name or version.</li>
    <li>Click <b>Submit & copy</b> to copy the generated branch name to your clipboard.</li>
  </ul>
  <p>Enjoy! For feedback or issues, visit the <a href="https://github.com/efi98/branch-name-generator" target="_blank">GitHub repo</a>.</p>

</div>
`

export const initialMessage: string =
    '//  ___                  _                                                       _           \n' +
    '// | _ )_ _ __ _ _ _  __| |_    _ _  __ _ _ __  ___   __ _ ___ _ _  ___ _ _ __ _| |_ ___ _ _ \n' +
    '// | _ \\ \'_/ _` | \' \\/ _| \' \\  | \' \\/ _` | \'  \\/ -_) / _` / -_) \' \\/ -_) \'_/ _` |  _/ _ \\ \'_|\n' +
    '// |___/_| \\__,_|_||_\\__|_||_| |_||_\\__,_|_|_|_\\___| \\__, \\___|_||_\\___|_| \\__,_|\\__\\___/_|  \n' +
    '//                                                   |___/                                   \n'
    + '//  Repo: https://github.com/efi98/branch-name-generator';