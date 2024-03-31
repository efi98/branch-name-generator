export const templateWorkItemFormat: string =
    `<div>
    <div><strong>Valid values must adhere strictly to the following format:</strong></div>
    <div>[(Work Item Type) (Work Item Number): (Work Item Title)]</div>
    <br>
    <div><i>More detailed explanation about these valid values follows:</i></div>
    <div><strong>Work Item Type:</strong> 'Requirement', 'Task', or 'Bug'.</div>
    <div><strong>Work Item Number:</strong> Only numbers and must be exactly 5 digits.</div>
    <div><strong>Work Item Title:</strong> Comprises alphanumeric characters and symbols, excluding (*^\\:?~).</div>
    <br>
    <div>
        <span><strong>Examples:</strong></span>
        <br>
        <small>Requirement 12345: Example Title - of req. & more</small>
        <br>
        <small>Task 67785: the 7 of this UNDEFINED again</small>
        <br>
        <small>Bug 93332: all THESE are valid 1234567890-./,;|[]{}-=_+)(&%$#@!</small>
    </div>
</div>
`