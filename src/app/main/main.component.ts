import {Component, OnInit} from "@angular/core";
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {ConfirmationService, MessageService} from "primeng/api";
import {ButtonsState, ParsedWorkItem, templateWorkItemFormat, workItemTypes} from "../../utils";

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
    workItemType!: workItemTypes;
    parsedWorkItem!: ParsedWorkItem;

    constructor(private formBuilder: FormBuilder, private confirmationService: ConfirmationService, private messageService: MessageService) {
    }

    ngOnInit(): void {
        this.generatorForm = this.formBuilder.group({
            workItem: ['', [Validators.required, this.workItemValidator()]],
            requirement: [''],
            isReqIncluded: [false]
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

    onNext() {
        this.buttonsStatus.prev.isEnabled = true;
        this.buttonsStatus.next.isDisplayed = false;
        this.buttonsStatus.submit.isDisplayed = true;
    }

    onPrev() {
        this.buttonsStatus.prev.isEnabled = false;
        this.buttonsStatus.next.isDisplayed = true;
        this.buttonsStatus.submit.isDisplayed = false;
    }

    onSubmit() {
        //
    }

    showWorkItemFormatModal() {
        this.confirmationService.confirm({header: 'Work item Format:', message: templateWorkItemFormat})
    }
}
