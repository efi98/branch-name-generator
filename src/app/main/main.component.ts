import { Component, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Card } from 'primeng/card';
import { ButtonDirective } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { SelectButton } from 'primeng/selectbutton';
import { Checkbox } from 'primeng/checkbox';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { Tooltip } from 'primeng/tooltip';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import {
  branchNameConf,
  FieldType,
  formatTitleWithHyphens,
  ParsedWorkItem,
  snkeOsType,
  stringToBoolean,
  templateWorkItemFormat,
  workItemTypes,
} from '@app-utils';

@Component({
  selector: 'app-main',
  standalone: true,
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  imports: [
    NgClass,
    ReactiveFormsModule,
    FormsModule,
    Card,
    ButtonDirective,
    InputText,
    SelectButton,
    Checkbox,
    ToggleSwitch,
    Tooltip,
  ],
})
export class MainComponent implements OnInit {
  generatorForm!: FormGroup;
  branchNameResult!: { key: string; value: string }[];
  isSnkeOSMode!: boolean;
  snkeOSForm!: FormGroup;
  snkeOsOptions!: { value: snkeOsType; label: snkeOsType; disabled: boolean }[];
  showModeSwitch: boolean = true;
  private hasSubmitted = false;
  private formChangedAfterSubmit = false;
  private parsedWorkItem!: ParsedWorkItem;
  private parsedRequirement!: { number: number; title: string };

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.showModeSwitch = stringToBoolean(
      (localStorage.getItem('showModeSwitch') as 'true' | 'false') ?? 'true',
    );
    this.isSnkeOSMode = localStorage.getItem('isSnkeOSMode') === 'true';
    this.generatorForm = this.formBuilder.group({
      workItem: [
        { value: '', disabled: false },
        [Validators.required, this.workItemValidator('workItem')],
      ],
      requirement: [
        { value: '', disabled: true },
        [Validators.required, this.workItemValidator('requirement')],
      ],
      isReqIncluded: [{ value: false, disabled: true }],
    });
    this.snkeOSForm = this.formBuilder.group({
      snkeosType: [snkeOsType.feature, [Validators.required]],
      snkeosInput: ['', [Validators.required, this.snkeosInputValidator()]],
    });

    this.snkeOSForm.get('snkeosType')?.valueChanges.subscribe(() => {
      this.snkeOSForm.get('snkeosInput')?.updateValueAndValidity();
    });

    this.snkeOsOptions = [
      { value: snkeOsType.feature, label: snkeOsType.feature, disabled: false },
      { value: snkeOsType.bugfix, label: snkeOsType.bugfix, disabled: false },
      { value: snkeOsType.hotfix, label: snkeOsType.hotfix, disabled: false },
    ];

    this.generatorForm.get('workItem')?.valueChanges.subscribe((workItemValue: string) => {
      if (this.generatorForm.get('workItem')?.valid) {
        this.parseWorkItem(workItemValue);
        this.handleWorkItemsByType();
      } else {
        this.generatorForm.get('requirement')?.disable({ emitEvent: false });
        this.generatorForm.get('isReqIncluded')?.disable({ emitEvent: false });
      }
    });
    this.generatorForm
      .get('isReqIncluded')
      ?.valueChanges.subscribe((isReqIncludedValue: boolean) => {
        this.generatorForm
          .get('requirement')
          ?.[isReqIncludedValue ? 'enable' : 'disable']({ emitEvent: false });
      });
    this.generatorForm
      .get('requirement')
      ?.valueChanges.pipe(debounceTime(200), distinctUntilChanged())
      .subscribe((requirement: string) => {
        if (this.generatorForm.get('requirement')?.valid) {
          this.parseReq(requirement);
        }
      });
    this.generatorForm.valueChanges.subscribe(() => this.handleFormChange());
    this.snkeOSForm.valueChanges.subscribe(() => this.handleFormChange());
  }

  toggleMode() {
    localStorage.setItem('isSnkeOSMode', this.isSnkeOSMode.toString());
  }

  pasteTextFromClipboard(type: FieldType) {
    navigator.clipboard
      .readText()
      .then((text) => {
        this.generatorForm.get(type)?.setValue(text);
        this.generatorForm.get(type)?.markAsDirty();
      })
      .catch(() => {
        this.messageService.add({
          severity: 'error',
          summary: 'Paste Failed',
          detail: 'Failed to paste due to permission denied',
        });
      });
  }

  onSubmit() {
    if (this.isSnkeOSMode) {
      const type = this.snkeOSForm.get('snkeosType')?.value;
      const input = formatTitleWithHyphens(this.snkeOSForm.get('snkeosInput')?.value);
      let branch = '';
      switch (type) {
        case snkeOsType.feature:
          branch = `feat/${input}`;
          break;
        case snkeOsType.bugfix:
          branch = `fix/${input}`;
          break;
        case snkeOsType.hotfix:
          branch = `hotfix/${input}`;
          break;
      }
      this.branchNameResult = [{ key: type, value: branch }];
      this.copyToClipboard(branch);
    } else {
      this.hasSubmitted = true;
      this.formChangedAfterSubmit = false;
      if (localStorage.getItem('dontShowSubmitAlert') !== 'true') {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Name generated successfully',
          data: { showDontShowAgain: true, type: 'submit' },
        });
      }
      this.branchNameResult = [];
      switch (this.parsedWorkItem.type) {
        case workItemTypes.Requirement: {
          const { number, title } = this.parsedWorkItem;
          this.branchNameResult.push({
            key: workItemTypes.Requirement,
            value: branchNameConf.Requirement.setBranchName(number.toString(), title),
          });
          break;
        }
        case workItemTypes.Task: {
          this.branchNameResult.push(
            {
              key: workItemTypes.Requirement,
              value: branchNameConf.Requirement.setBranchName(
                this.parsedRequirement.number,
                this.parsedRequirement.title,
              ),
            },
            {
              key: workItemTypes.Task,
              value: branchNameConf.Task.setBranchName(
                this.parsedRequirement.number,
                this.parsedRequirement.title,
                this.parsedWorkItem.number,
                this.parsedWorkItem.title,
              ),
            },
          );
          break;
        }
        case workItemTypes.Bug: {
          const { number, title } = this.parsedWorkItem;
          if (this.generatorForm.get('isReqIncluded')?.value) {
            this.branchNameResult.push(
              {
                key: workItemTypes.Requirement,
                value: branchNameConf.Requirement.setBranchName(
                  this.parsedRequirement.number,
                  this.parsedRequirement.title,
                ),
              },
              {
                key: workItemTypes.Bug,
                value: branchNameConf.Bug.setBranchName(
                  number,
                  title,
                  this.parsedRequirement.number,
                  this.parsedRequirement.title,
                ),
              },
            );
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
  }

  showSnkeOSBranchingGuide() {
    this.confirmationService.confirm({
      header: 'SnkeOS Branching Guidelines',
      message: `
        <div style="max-height:60vh;overflow-y:auto;line-height:1.6">
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
      `,
    });
  }

  showWorkItemFormatModal() {
    this.confirmationService.confirm({
      header: 'Work item Format:',
      message: templateWorkItemFormat('workItem'),
    });
  }

  showReqFormatModal() {
    this.confirmationService.confirm({
      header: 'Requirement Format:',
      message: templateWorkItemFormat('requirement'),
    });
  }

  copyToClipboard(value: string) {
    navigator.clipboard
      .writeText(value)
      .then(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Copied successfully',
          detail: "<span>Copied '<b>" + value + "</b>' to clipboard</span>",
        });
      })
      .catch(() => {
        this.messageService.add({
          severity: 'error',
          summary: 'Copy Failed',
          detail: 'Failed to copy to clipboard',
        });
      });
  }

  private workItemValidator(type: FieldType): ValidatorFn {
    const validWorkItemTypes: string = type === 'workItem' ? 'Bug|Task|Requirement' : 'Requirement';
    const workItemRegExp: RegExp = new RegExp(String.raw`^(${validWorkItemTypes})\s\d{5}:\s.+$`);
    const branchRegExp: RegExp = new RegExp(
      String.raw`^(${validWorkItemTypes})\s\d{5}:\s([^*^\\:?~\u05D0-\u05EA]+)$`,
    );

    return (control: AbstractControl): ValidationErrors | null => {
      if (!workItemRegExp.test(control.value) && control.value.length) {
        return { workItemSyntax: true };
      }
      if (!branchRegExp.test(control.value) && control.value.length) {
        return { forbiddenChars: true };
      }
      return null;
    };
  }

  private parseWorkItem(workItemValue: string) {
    const regexMatch = new RegExp(
      /^(Bug|Task|Requirement)\s(\d{5}):\s([^*^\\:?~\u05D0-\u05EA]+)$/,
    ).exec(workItemValue);
    if (regexMatch) {
      const [, type, number, title] = regexMatch;
      this.parsedWorkItem = {
        type: type as workItemTypes,
        number: Number.parseInt(number),
        title: formatTitleWithHyphens(title),
      };
    }
  }

  private parseReq(reqValue: string) {
    const regexMatch = new RegExp(/^Requirement\s(\d{5}):\s([^*^\\:?~\u05D0-\u05EA]+)$/).exec(
      reqValue,
    );
    if (regexMatch) {
      const [, number, title] = regexMatch;
      this.parsedRequirement = {
        number: Number.parseInt(number),
        title: formatTitleWithHyphens(title),
      };
    }
  }

  private handleWorkItemsByType() {
    switch (this.parsedWorkItem.type) {
      case workItemTypes.Requirement:
        this.generatorForm.get('requirement')?.disable({ emitEvent: false });
        this.generatorForm.get('isReqIncluded')?.disable({ emitEvent: false });
        break;
      case workItemTypes.Task:
        this.generatorForm.get('requirement')?.enable({ emitEvent: false });
        this.generatorForm.get('isReqIncluded')?.disable({ emitEvent: false });
        break;
      case workItemTypes.Bug:
        if (this.generatorForm.get('isReqIncluded')?.value) {
          this.generatorForm.get('requirement')?.enable({ emitEvent: false });
        } else {
          this.generatorForm.get('requirement')?.disable({ emitEvent: false });
        }
        this.generatorForm.get('isReqIncluded')?.enable({ emitEvent: false });
        break;
    }
  }

  private snkeosInputValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const parent = control.parent;
      const value = control.value;
      if (!parent) return null;
      const type = parent.get('snkeosType')?.value;
      if (type === snkeOsType.version && value) {
        if (!/^v\d+\.\d+\.\d+$/.test(value)) {
          return { versionPattern: true };
        }
      } else if (/^\s+$/.test(value)) {
        return { noWhitespace: true };
      }
      return null;
    };
  }

  private handleFormChange() {
    if (
      this.hasSubmitted &&
      !this.formChangedAfterSubmit &&
      localStorage.getItem('dontShowFormChangeAlert') !== 'true'
    ) {
      this.formChangedAfterSubmit = true;
      setTimeout(() => {
        if (this.formChangedAfterSubmit) {
          this.messageService.add({
            severity: 'warn',
            summary: 'Notice',
            detail: "You've made changes, click `submit` again to apply.",
            data: { showDontShowAgain: true, type: 'formChange' },
          });
        }
      }, 5000);
    }
  }
}
