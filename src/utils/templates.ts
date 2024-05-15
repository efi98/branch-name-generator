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
<p>First, fill the 'work-item' field with your work item title.<br>
<i>You can copy it directly from the 'AzureDevOps' then just click 'paste' here.</i></p>
<p>the app automatically detects the work item type you were paste (like 'Bug', 'Task' or 'Requirement')</p>
<p>after you fill all relevant fields - click on 'Submit' to get the results</p>
Enjoy!
</div>
`

export const initialMessage: string =
    '//  ___                  _                                                       _           \n' +
    '// | _ )_ _ __ _ _ _  __| |_    _ _  __ _ _ __  ___   __ _ ___ _ _  ___ _ _ __ _| |_ ___ _ _ \n' +
    '// | _ \\ \'_/ _` | \' \\/ _| \' \\  | \' \\/ _` | \'  \\/ -_) / _` / -_) \' \\/ -_) \'_/ _` |  _/ _ \\ \'_|\n' +
    '// |___/_| \\__,_|_||_\\__|_||_| |_||_\\__,_|_|_|_\\___| \\__, \\___|_||_\\___|_| \\__,_|\\__\\___/_|  \n' +
    '//                                                   |___/                                   \n'
    + '//  Repo: https://github.com/efi98/branch-name-generator';