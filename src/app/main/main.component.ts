import {Component, OnInit} from "@angular/core";
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {ConfirmationService, MessageService} from "primeng/api";
import {
    branchNameConf,
    FieldType,
    formatTitleWithHyphens,
    ParsedWorkItem,
    templateWorkItemFormat,
    workItemTypes
} from "@app-utils";
import {debounceTime, distinctUntilChanged} from "rxjs";

@Component({
    selector: "app-main",
    templateUrl: "./main.component.html",
    styleUrls: ["./main.component.scss"],
})
export class MainComponent implements OnInit {
    generatorForm!: FormGroup;
    branchNameResult!: { key: string, value: string }[];
    private parsedWorkItem!: ParsedWorkItem;
    private parsedRequirement!: { number: number, title: string };

    constructor(private formBuilder: FormBuilder, private confirmationService: ConfirmationService, private messageService: MessageService) {
    }

    ngOnInit(): void {
        this.generatorForm = this.formBuilder.group({
            workItem: [{value: '', disabled: false}, [Validators.required, this.workItemValidator('workItem')]],
            requirement: [{value: '', disabled: true}, [Validators.required, this.workItemValidator('requirement')]],
            isReqIncluded: [{value: false, disabled: true}]
        });

        this.generatorForm.get('workItem')?.valueChanges
            .subscribe((workItemValue: string) => {
                if (this.generatorForm.get('workItem')?.valid) {
                    this.parseWorkItem(workItemValue);
                    this.handleWorkItemsByType();
                } else {
                    this.generatorForm.get('requirement')?.disable({emitEvent: false});
                    this.generatorForm.get('isReqIncluded')?.disable({emitEvent: false});
                }
            });
        this.generatorForm.get('isReqIncluded')?.valueChanges
            .subscribe((isReqIncludedValue: boolean) => {
                this.generatorForm.get('requirement')?.[isReqIncludedValue ? 'enable' : 'disable']({emitEvent: false});
            });
        this.generatorForm.get('requirement')?.valueChanges.pipe(debounceTime(200), distinctUntilChanged())
            .subscribe((requirement: string) => {
                if (this.generatorForm.get('requirement')?.valid) {
                    this.parseReq(requirement);
                }
            });
    }

    pasteTextFromClipboard(type: FieldType) {
        navigator.clipboard.readText().then(text => {
            this.generatorForm.get(type)?.setValue(text);
            this.generatorForm.get(type)?.markAsDirty();
        }).catch(err => {
            console.error(err);
        });
    }

    onSubmit() {
        this.branchNameResult = [];
        switch (this.parsedWorkItem.type) {
            case workItemTypes.Requirement: {
                const {number, title} = this.parsedWorkItem;
                this.branchNameResult.push({
                    key: workItemTypes.Requirement,
                    value: branchNameConf.Requirement.setBranchName(number.toString(), title)
                });
                break;
            }
            case workItemTypes.Task: {
                this.branchNameResult.push({
                    key: workItemTypes.Requirement,
                    value: branchNameConf.Requirement.setBranchName(this.parsedRequirement.number, this.parsedRequirement.title)
                });
                this.branchNameResult.push({
                    key: workItemTypes.Task,
                    value: branchNameConf.Task.setBranchName(this.parsedRequirement.number, this.parsedRequirement.title, this.parsedWorkItem.number, this.parsedWorkItem.title)
                });
                break;
            }
            case workItemTypes.Bug: {
                const {number, title} = this.parsedWorkItem;
                if (this.generatorForm.get('isReqIncluded')?.value) {
                    this.branchNameResult.push({
                        key: workItemTypes.Requirement,
                        value: branchNameConf.Requirement.setBranchName(this.parsedRequirement.number, this.parsedRequirement.title)
                    });
                    this.branchNameResult.push({
                        key: workItemTypes.Bug,
                        value: branchNameConf.Bug.setBranchName(number, title, this.parsedRequirement.number, this.parsedRequirement.title)
                    });
                } else {
                    this.branchNameResult.push({
                        key: workItemTypes.Bug,
                        value: branchNameConf.Bug.setBranchName(number, title),
                    });
                }
                break;
            }
        }
    }

    showWorkItemFormatModal() {
        this.confirmationService.confirm({header: 'Work item Format:', message: templateWorkItemFormat('workItem')})
    }

    showReqFormatModal() {
        this.confirmationService.confirm({
            header: 'Requirement Format:',
            message: templateWorkItemFormat('requirement')
        })
    }

    copyToClipboard(value: string) {
        navigator.clipboard
            .writeText(value)
            .then(() => {
                // todo: Success message or any other action you want to take on success
            })
            .catch((err) => {
                // todo: Error message
            });
    }

    private workItemValidator(type: FieldType): ValidatorFn {
        const validWorkItemTypes: string = type === 'workItem' ? 'Bug|Task|Requirement' : 'Requirement';
        const workItemRegExp: RegExp = new RegExp(`^(${validWorkItemTypes})\\s\\d{5}:\\s.+$`);
        const branchRegExp: RegExp = new RegExp(`^(${validWorkItemTypes})\\s\\d{5}:\\s([^*^\\\\:?~\\u05D0-\\u05EA]+)$`);

        return (control: AbstractControl): ValidationErrors | null => {
            if (!workItemRegExp.test(control.value) && control.value.length) {
                return {workItemSyntax: true};
            }
            if (!branchRegExp.test(control.value) && control.value.length) {
                return {forbiddenChars: true};
            }
            return null;
        };
    }

    private parseWorkItem(workItemValue: string) {
        const regexMatch: any = workItemValue.match(/^(Bug|Task|Requirement)\s(\d{5}):\s([^*^\\:?~\u05D0-\u05EA]+)$/);
        if (regexMatch) {
            const [_, type, number, title] = regexMatch;
            this.parsedWorkItem = {
                type: type as workItemTypes,
                number: parseInt(number),
                title: formatTitleWithHyphens(title)
            };
            console.log('parsedWorkItem: ', this.parsedWorkItem);
        }
    }

    private parseReq(reqValue: string) {
        const regexMatch: any = reqValue.match(/^Requirement\s(\d{5}):\s([^*^\\:?~\u05D0-\u05EA]+)$/);
        if (regexMatch) {
            const [_, number, title] = regexMatch;
            this.parsedRequirement = {
                number: parseInt(number),
                title: formatTitleWithHyphens(title)
            };
            console.log('parsedReq: ', this.parsedRequirement);
        }
    }

    private handleWorkItemsByType() {
        // this.messageService.add({summary: '123', severity: 'info', detail: '0088', data: {}})
        switch (this.parsedWorkItem.type) {
            case workItemTypes.Requirement:
                this.generatorForm.get('requirement')?.disable({emitEvent: false});
                this.generatorForm.get('isReqIncluded')?.disable({emitEvent: false});
                break;
            case workItemTypes.Task:
                this.generatorForm.get('requirement')?.enable({emitEvent: false});
                this.generatorForm.get('isReqIncluded')?.disable({emitEvent: false});
                break;
            case workItemTypes.Bug:
                if (this.generatorForm.get('isReqIncluded')?.value) {
                    this.generatorForm.get('requirement')?.enable({emitEvent: false});
                } else {
                    this.generatorForm.get('requirement')?.disable({emitEvent: false});
                }
                this.generatorForm.get('isReqIncluded')?.enable({emitEvent: false});
                break;
        }
    }
}

// todo:
// a - add alert when:
//              1) user clicks on submit 'name generated successfully' [add 'dont show again' option].
//              2) user clicks on 'copy' icon 'copied successfully' (or text next to the icon for 2 seconds)
//                  [p.s. alert if we don't succeed to copy to clipboard].
//              3) user changed the form after generating (wait 3 sec) 'notice you've made changes,
//                  click `submit` again to apply the changes' (show once after submit clicked)
//                  [add 'dont show again' option].
// b - add theme switch
// c - add limit to branch name
// d - do order with colors that 1- will be generic (for theme), 2- order the 'surface', 'card' to fit their purpose
// e - add call for feedback and open issues (on readme).
// f - update readme in order to align to the current data flow.
// g - remove the " and ' char from branch name also
// h - icons from another source that will give us more custom icons
// i - get the validation errors in generic way