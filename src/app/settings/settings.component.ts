import { Component, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Card } from 'primeng/card';
import { ButtonDirective, ButtonIcon, ButtonLabel } from 'primeng/button';
import { SelectButton } from 'primeng/selectbutton';
import { Checkbox } from 'primeng/checkbox';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { Tooltip } from 'primeng/tooltip';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import isEqual from 'lodash/isEqual';
import { startWith } from 'rxjs';
import { DEFAULTS, mode, stringToBoolean, switchTheme, theme, USER_THEME } from '@app-utils';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  imports: [
    NgClass,
    ReactiveFormsModule,
    ConfirmPopupModule,
    Card,
    ButtonDirective,
    SelectButton,
    Checkbox,
    ToggleSwitch,
    Tooltip,
    ButtonIcon,
    ButtonLabel,
  ],
})
export class SettingsComponent implements OnInit {
  settingsForm!: FormGroup;
  themeOptions!: { label: string; value: theme; icon: string }[];
  protected readonly mode = mode;

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: MessageService,
  ) {}

  get currentMode(): mode {
    const formValue = this.settingsForm?.get('isSnkeOSMode')?.value;
    const isSnkeOSMode: boolean =
      formValue ??
      stringToBoolean((localStorage.getItem('isSnkeOSMode') as 'true' | 'false') ?? 'false');
    return isSnkeOSMode ? mode.snkeOS : mode.azureDevOps;
  }

  ngOnInit(): void {
    const readTheme = () => {
      const v = localStorage.getItem('theme') as theme | null;
      if (v && [theme.dark, theme.light].includes(v)) return v;
      return USER_THEME;
    };

    const readBool = (key: string, fallback: boolean) => {
      const raw = localStorage.getItem(key);
      if (raw === null) return fallback;
      return raw === 'true';
    };

    this.themeOptions = [
      { value: theme.light, label: theme.light, icon: 'pi pi-sun' },
      { value: theme.dark, label: theme.dark, icon: 'pi pi-moon' },
    ];

    this.settingsForm = this.fb.group({
      theme: this.fb.nonNullable.control(DEFAULTS.theme),
      showModeSwitch: this.fb.nonNullable.control(DEFAULTS.showModeSwitch),
      isSnkeOSMode: this.fb.nonNullable.control(DEFAULTS.isSnkeOSMode),
      showWelcomeMsg: this.fb.nonNullable.control(DEFAULTS.showWelcomeMsg),
      showSubmitAlert: this.fb.nonNullable.control(DEFAULTS.showSubmitAlert),
      showFormChangeAlert: this.fb.nonNullable.control(DEFAULTS.showFormChangeAlert),
    });

    const fromLS: Partial<typeof DEFAULTS> = {
      theme: readTheme(),
      showModeSwitch: readBool('showModeSwitch', DEFAULTS.showModeSwitch),
      isSnkeOSMode: readBool('isSnkeOSMode', DEFAULTS.isSnkeOSMode),
      showWelcomeMsg: readBool('showWelcomeMsg', DEFAULTS.showWelcomeMsg),
      showSubmitAlert: !readBool('dontShowSubmitAlert', !DEFAULTS.showSubmitAlert),
      showFormChangeAlert: !readBool('dontShowFormChangeAlert', !DEFAULTS.showFormChangeAlert),
    };

    this.settingsForm.patchValue(fromLS);

    this.settingsForm
      .get('isSnkeOSMode')
      ?.valueChanges.pipe(startWith(this.settingsForm.get('isSnkeOSMode')?.value))
      .subscribe((value: boolean) => {
        this.settingsForm.get('showSubmitAlert')?.[value ? 'disable' : 'enable']();
        this.settingsForm.get('showFormChangeAlert')?.[value ? 'disable' : 'enable']();
      });

    this.settingsForm.get('theme')?.valueChanges.subscribe((t: theme) => {
      switchTheme(t);
    });
  }

  onSave(): void {
    const formValues = this.settingsForm.value;
    localStorage.setItem('theme', formValues.theme);
    localStorage.setItem('showModeSwitch', formValues.showModeSwitch);
    localStorage.setItem('isSnkeOSMode', formValues.isSnkeOSMode);
    localStorage.setItem('showWelcomeMsg', formValues.showWelcomeMsg);
    localStorage.setItem('dontShowSubmitAlert', (!formValues.showSubmitAlert).toString());
    localStorage.setItem('dontShowFormChangeAlert', (!formValues.showFormChangeAlert).toString());

    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Settings saved successfully!',
    });
    this.router.navigate(['/']);
  }

  onCancel(): void {
    switchTheme((localStorage.getItem('theme') as theme) || USER_THEME);
    this.router.navigate(['/']);
  }

  onReset(): void {
    this.confirmationService.confirm({
      acceptVisible: true,
      rejectVisible: true,
      message:
        'Are you sure you want to reset all settings? This will clear all your saved preferences.',
      header: 'Reset Confirmation',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Reset',
        severity: 'danger',
      },
      defaultFocus: 'reject',
      accept: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'All settings have been reset. click Save to apply changes',
        });
        this.settingsForm.reset();
      },
    });
  }

  isDefaultState(): boolean {
    const current = this.settingsForm.getRawValue();
    return isEqual(current, DEFAULTS) && this.settingsForm.pristine && !this.settingsForm.touched;
  }

  resetToDeviceTheme() {
    localStorage.removeItem('theme');
    this.settingsForm.get('theme')?.setValue(USER_THEME);
  }
}
