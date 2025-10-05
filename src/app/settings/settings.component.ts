import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { DEFAULTS, mode, stringToBoolean, theme } from "@app-utils";
import { ConfirmationService, MessageService } from "primeng/api";

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
    settingsForm!: FormGroup;
    themeOptions!: { label:string, value: theme, icon: string }[];
    constructor(
        private fb: FormBuilder,
        private router: Router,
        private confirmationService: ConfirmationService,
        private messageService: MessageService
    ) {
    }

    get currentMode(): mode {
        return stringToBoolean((localStorage.getItem('isSnkeOSMode') as 'false' | 'true') ?? 'false') ? mode.snkeOS : mode.azureDevOps;
    }

    ngOnInit(): void {

        const readTheme = () => {
            const v = localStorage.getItem('theme') as theme | null;
            if (v && [theme.dark, theme.light].includes(v)) return v;
            return theme.light;
        };

        const readBool = (key: string, fallback: boolean) => {
            const raw = localStorage.getItem(key);
            if (raw === null) return fallback;
            return raw === 'true';
        };

        this.themeOptions = [{value: theme.light, label: theme.light, icon: 'pi pi-sun'}, {value: theme.dark,label: theme.dark, icon: 'pi pi-moon'}];
        this.settingsForm = this.fb.group({
            theme: this.fb.nonNullable.control(DEFAULTS.theme),
            showModeSwitch: this.fb.nonNullable.control(DEFAULTS.showModeSwitch),
            showWelcomeMsg: this.fb.nonNullable.control(DEFAULTS.showWelcomeMsg),
            showSubmitAlert: this.fb.nonNullable.control(DEFAULTS.showSubmitAlert),
            showFormChangeAlert: this.fb.nonNullable.control(DEFAULTS.showFormChangeAlert)

        });
        const fromLS: Partial<typeof DEFAULTS> = {
            theme: readTheme(),
            showModeSwitch: readBool('showModeSwitch', DEFAULTS.showModeSwitch),
            showWelcomeMsg: readBool('showWelcomeMsg', DEFAULTS.showWelcomeMsg),
            showSubmitAlert: !readBool('dontShowSubmitAlert', !DEFAULTS.showSubmitAlert),
            showFormChangeAlert: !readBool('dontShowFormChangeAlert', !DEFAULTS.showFormChangeAlert),
        };

        this.settingsForm.patchValue(fromLS);
    }

    onSave(): void {
        const formValues = this.settingsForm.value;
        localStorage.setItem('theme', formValues.theme);
        localStorage.setItem('showModeSwitch', formValues.showModeSwitch);
        localStorage.setItem('showWelcomeMsg', formValues.showWelcomeMsg);
        localStorage.setItem('dontShowSubmitAlert', (!formValues.showSubmitAlert).toString());
        localStorage.setItem('dontShowFormChangeAlert', (!formValues.showFormChangeAlert).toString());

        // // Apply theme immediately todo
        // const themeLink = document.getElementById('app-theme') as HTMLLinkElement;
        // if (themeLink) {
        //     themeLink.href = `${formValues.theme}.css`;
        // }

        this.messageService.add({severity: 'success', summary: 'Success', detail: 'Settings saved successfully!'});
        this.router.navigate(['/']);
    }

    onCancel(): void {
        this.router.navigate(['/']);
    }

    onReset(): void {
        this.confirmationService.confirm({
            acceptVisible: true,
            rejectVisible: true,
            message: 'Are you sure you want to reset all settings? This will clear all your saved preferences.',
            header: 'Reset Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'All settings have been reset. click Save to apply changes'
                });
                this.settingsForm.reset();
            }
        });
    }

    isDefaultState(): boolean {
        const current = this.settingsForm.getRawValue();
        return (
            JSON.stringify(current) === JSON.stringify(DEFAULTS) &&
            this.settingsForm.pristine &&
            !this.settingsForm.touched
        );
    }

}
