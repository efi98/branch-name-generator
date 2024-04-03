import {Component, OnInit} from "@angular/core";
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {ConfirmationService, MessageService} from "primeng/api";
import {FieldType, ParsedWorkItem, templateWorkItemFormat, workItemTypes} from "@app-utils";

@Component({
    selector: "app-main",
    templateUrl: "./main.component.html",
    styleUrls: ["./main.component.scss"],
})
export class MainComponent implements OnInit {
    generatorForm!: FormGroup;
    parsedWorkItem!: ParsedWorkItem;

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
                    this.parseWorkItem();
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
    }

    pasteTextFromClipboard(type: FieldType) {
        navigator.clipboard.readText().then(text => {
            this.generatorForm.get(type)?.setValue(text);
            this.generatorForm.get(type)?.markAsDirty();
        }).catch(err => {
            console.error(err);
        });
    }

    workItemValidator(type: FieldType): ValidatorFn {
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

    onSubmit() {
        //
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

    private parseWorkItem() {
        const workItemValue = this.generatorForm.get('workItem')?.value;
        const regexMatch: any = workItemValue.match(/^(Bug|Task|Requirement)\s(\d{5}):\s([^*^\\:?~\u05D0-\u05EA]+)$/);
        if (regexMatch) {
            const [_, type, number, title] = regexMatch;
            this.parsedWorkItem = {
                type: type as workItemTypes,
                number: parseInt(number),
                title: this.replaceSpacesWithHyphen(title)
            };
            console.log('parsedWorkItem: ', this.parsedWorkItem);
        }
    }

    private handleWorkItemsByType() {
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

    private replaceSpacesWithHyphen(title: any): string {
        return title.replace(/[\s_]+/g, '-').replace(/-+/g, '-');
    }
}
