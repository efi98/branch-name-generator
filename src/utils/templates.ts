import { FieldType } from '@app-utils';

export const templateWorkItemFormat = (type: FieldType): string => {
  const templateType = type === 'workItem' ? 'work item' : 'requirement';
  return String.raw`<div>
    <div><strong>Valid values must adhere strictly to the following format:</strong></div>
    <div>[(${templateType} Type) (${templateType} Number): (${templateType} Title)]</div>
    <br>
    <div><i>More detailed explanation about these valid values follows:</i></div>
    <div><strong>Work Item Type:</strong> ${type === 'workItem' ? `'Requirement', 'Task', or 'Bug'.` : `'Requirement' ONLY!`}</div>
    <div><strong>Work Item Number:</strong> Only numbers and must be exactly 5 digits.</div>
    <div><strong>Work Item Title:</strong> Comprises alphanumeric characters and symbols, excluding (*^\:?~).</div>
    <br>
    <div>
        <span><strong>Example${type === 'workItem' ? 's' : ''}:</strong></span>
        <br>
        <small>Requirement 12345: Example Title - of req. & more</small>
        ${
          type === 'workItem'
            ? `<br>
        <small>Task 67785: the 7 of this UNDEFINED again</small>
        <br>
        <small>Bug 93332: all THESE are valid 1234567890-./,;|[]{}-=_+)(&%$#@!</small>`
            : ''
        }
    </div>
</div>`;
};

export const snkeosBranchingGuidelines: string = `
<div>
          <p>Commits must <strong>never</strong> be made directly on <code>main</code> or release branches (<code>vMAJOR.MINOR.x</code>). Use one of the following branch types:</p>
          <hr/>
          <h4>🌟 feature / feat</h4>
          <p>Use for <strong>new functionality</strong>. Branch off <code>main</code>, merge back into <code>main</code> via pull request. Even small changes must have their own branch.</p>
          <p><code>feat/my-new-feature</code></p>
          <hr/>
          <h4>🐛 bugfix / fix</h4>
          <p>Use for <strong>bug fixes on main</strong> (not yet released). Branch off <code>main</code>, merge back into <code>main</code> via pull request.</p>
          <p><code>fix/login-crash</code></p>
          <hr/>
          <h4>🔥 hotfix</h4>
          <p>Use to <strong>patch a released version</strong>. Following the <em>upstream-first policy</em>:</p>
          <ol>
            <li>Create a <code>bugfix</code> branch from <code>main</code> and merge the fix into <code>main</code> first.</li>
            <li>Then create a <code>hotfix</code> branch from the release branch (<code>vMAJOR.MINOR.x</code>) and cherry-pick the fix commits.</li>
            <li>Merge the <code>hotfix</code> branch into the release branch via pull request.</li>
          </ol>
          <p>If the same fix <strong>cannot</strong> be applied to both branches, create two independent fixes.</p>
          <p><code>hotfix/critical-data-loss</code></p>
          <hr/>
          <p style="font-size:0.85em;color:gray">Branch names must use <code>-</code> as separator. <a href="https://automatic-system-313ec0d8.pages.github.io/guidelines/branching_guidelines/" target="_blank">See the full guidelines</a> for naming conventions and release tags.</p>
        </div>
`;

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
    <li>Select the branch type and enter a name.</li>
    <li>Click <b>Submit & copy</b> to copy the generated branch name to your clipboard.</li>
  </ul>
  <p>Enjoy! For feedback or issues, visit the <a href="https://github.com/efi98/branch-name-generator" target="_blank">GitHub repo</a>.</p>

</div>
`;

export const initialMessage: string =
  '//  ___                  _                                                       _           \n' +
  '// | _ )_ _ __ _ _ _  __| |_    _ _  __ _ _ __  ___   __ _ ___ _ _  ___ _ _ __ _| |_ ___ _ _ \n' +
  "// | _ \\ '_/ _` | ' \\/ _| ' \\  | ' \\/ _` | '  \\/ -_) / _` / -_) ' \\/ -_) '_/ _` |  _/ _ \\ '_|\n" +
  '// |___/_| \\__,_|_||_\\__|_||_| |_||_\\__,_|_|_|_\\___| \\__, \\___|_||_\\___|_| \\__,_|\\__\\___/_|  \n' +
  '//                                                   |___/                                   \n' +
  '//  Repo: https://github.com/efi98/branch-name-generator';
