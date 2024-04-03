import {Component, OnInit} from "@angular/core";
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {ConfirmationService, MessageService} from "primeng/api";
import {ButtonsState, ParsedWorkItem, templateReqFormat, templateWorkItemFormat, workItemTypes} from "../../utils";
import {Subject, takeUntil} from "rxjs";

@Component({
    selector: "app-main",
    templateUrl: "./main.component.html",
    styleUrls: ["./main.component.scss"],
})
export class MainComponent implements OnInit {
    generatorForm!: FormGroup;
    buttonsStatus: ButtonsState = {
        next: {isDisplayed: true, isEnabled: false},
        prev: {isDisplayed: true, isEnabled: false},
        submit: {isDisplayed: false, isEnabled: false}
    };
    fieldStatusDisplay: { workItem: boolean, requirement: boolean, isReqIncluded: boolean } = {
        workItem: true,
        requirement: false,
        isReqIncluded: false
    };
    parsedWorkItem!: ParsedWorkItem;
    private unsubscribeFromReqStatusChanges$ = new Subject<void>();
    private unsubscribeFromIsReqIncludeChanges$ = new Subject<void>();

    constructor(private formBuilder: FormBuilder, private confirmationService: ConfirmationService, private messageService: MessageService) {
    }

    ngOnInit(): void {
        this.generatorForm = this.formBuilder.group({
            workItem: ['', [Validators.required, this.workItemValidator()]],
            requirement: [{value: '', disabled: true}, [Validators.required, this.requirementValidator()]],
            isReqIncluded: [{value: false, disabled: true}]
        });

        this.generatorForm.get('workItem')?.valueChanges.subscribe(workItemValue => {
            this.buttonsStatus.next.isEnabled = !this.generatorForm.get('workItem')?.errors;
        })

        this.generatorForm.valueChanges.subscribe((formValue: {
            workItem: string,
            requirement: string,
            isReqIncluded: boolean
        }) => {
            console.log(formValue);
            console.warn(this.generatorForm.get('workItem')?.errors);
        });
    }

    pasteTextFromClipboard() {
        navigator.clipboard.readText().then(text => {
            this.generatorForm.get('workItem')?.setValue(text);
            this.generatorForm.get('workItem')?.markAsDirty();
        }).catch(err => {
            console.error(err);
        })
    }

    pasteTextFromClipboardToReq() {
        navigator.clipboard.readText().then(text => {
            this.generatorForm.get('requirement')?.setValue(text);
            this.generatorForm.get('requirement')?.markAsDirty();
        }).catch(err => {
            console.error(err);
        })
    }

    workItemValidator(): ValidatorFn {
        const workItemRegExp = new RegExp(/^(Bug|Task|Requirement)\s\d{5}:\s.+$/);
        const branchRegExp = new RegExp(/^(Bug|Task|Requirement)\s\d{5}:\s([^*^\\:?~\u05D0-\u05EA]+)$/);
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

    requirementValidator(): ValidatorFn {
        const workItemRegExp = new RegExp(/^(Requirement)\s\d{5}:\s.+$/);
        const branchRegExp = new RegExp(/^(Requirement)\s\d{5}:\s([^*^\\:?~\u05D0-\u05EA]+)$/);
        return (control: AbstractControl): ValidationErrors | null => {
            if (!workItemRegExp.test(control.value) && control.value.length) {
                return {reqSyntax: true};
            }
            if (!branchRegExp.test(control.value) && control.value.length) {
                return {forbiddenChars: true};
            }
            return null;
        };
    }

    onNext() {
        this.buttonsStatus.prev.isEnabled = true;
        this.buttonsStatus.next.isDisplayed = false;
        this.buttonsStatus.submit.isDisplayed = true;
        this.parseWorkItem();
        this.generatorForm.get('workItem')?.disable();
        this.handleWorkItemsByType();
    }

    onPrev() {
        this.buttonsStatus.prev.isEnabled = false;
        this.buttonsStatus.next.isDisplayed = true;
        this.buttonsStatus.submit.isDisplayed = false;
        this.fieldStatusDisplay.requirement = false;
        this.generatorForm.get('workItem')?.enable();
        this.generatorForm.get('requirement')?.disable();
        this.unsubscribeFromReqStatusChanges$.next();
        this.unsubscribeFromReqStatusChanges$.complete()
        this.unsubscribeFromReqStatusChanges$ = new Subject<void>();
        this.unsubscribeFromIsReqIncludeChanges$.next();
        this.unsubscribeFromIsReqIncludeChanges$.complete()
        this.unsubscribeFromIsReqIncludeChanges$ = new Subject<void>();

        this.fieldStatusDisplay.isReqIncluded = false;
        this.generatorForm.get('isReqIncluded')?.disable();
        this.generatorForm.get('isReqIncluded')?.setValue(false);
    }

    onSubmit() {
        //
    }

    showWorkItemFormatModal() {
        this.confirmationService.confirm({header: 'Work item Format:', message: templateWorkItemFormat})
    }

    showReqFormatModal() {
        this.confirmationService.confirm({header: 'Requirement Format:', message: templateReqFormat})
    }

    private parseWorkItem() {
        const workItemValue = this.generatorForm.get('workItem')?.value;
        const regexMatch: any = workItemValue.match(/^(Bug|Task|Requirement)\s(\d{5}):\s([^*^\\:?~\u05D0-\u05EA]+)$/);
        if (regexMatch) {
            const [_, type, number, title] = regexMatch;
            this.parsedWorkItem = {type: type as workItemTypes, number: parseInt(number), title: title.trim()};
            console.log(this.parsedWorkItem); // remove spaces
        }
    }

    private handleWorkItemsByType() {
        switch (this.parsedWorkItem.type) {
            case workItemTypes.Requirement:
                this.buttonsStatus.submit.isEnabled = true;
                break;
            case workItemTypes.Task:
                this.fieldStatusDisplay.requirement = true;
                this.generatorForm.get('requirement')?.enable();
                this.generatorForm.get('requirement')?.statusChanges.pipe(takeUntil(this.unsubscribeFromReqStatusChanges$)).subscribe(status => {
                    this.buttonsStatus.submit.isEnabled = status == 'VALID';
                });
                break;
            case workItemTypes.Bug:
                this.fieldStatusDisplay.isReqIncluded = true;
                this.buttonsStatus.submit.isEnabled = true;
                this.generatorForm.get('isReqIncluded')?.enable();
                this.generatorForm.get('isReqIncluded')?.valueChanges.pipe(takeUntil(this.unsubscribeFromIsReqIncludeChanges$)).subscribe((value: boolean) => {
                    this.fieldStatusDisplay.requirement = value;
                    this.generatorForm.get('requirement')?.[ value ? 'enable' : 'disable']();
                    if (value) {
                        this.buttonsStatus.submit.isEnabled = !!this.generatorForm.get('requirement')?.valid;
                        this.generatorForm.get('requirement')?.statusChanges.pipe(takeUntil(this.unsubscribeFromReqStatusChanges$)).subscribe(status => {
                            this.buttonsStatus.submit.isEnabled = status == 'VALID';
                        });
                    } else {
                        this.buttonsStatus.submit.isEnabled = true;
                    }
                });
                break;
        }
    }

}
