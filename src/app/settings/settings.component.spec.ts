import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SettingsComponent } from './settings.component';
import { DEFAULTS, USER_THEME } from '@app-utils';
import { theme, mode } from '@app-utils';
import { routes } from '../app.routes';

describe('SettingsComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsComponent, ReactiveFormsModule],
      providers: [
        provideRouter(routes),
        provideNoopAnimations(),
        ConfirmationService,
        MessageService,
      ],
    }).compileComponents();

    localStorage.clear();
    localStorage.setItem('showWelcomeMsg', 'false');
  });

  function createComponent() {
    const fixture = TestBed.createComponent(SettingsComponent);
    fixture.detectChanges();
    return fixture;
  }

  // --- Creation ---
  it('should create', () => {
    expect(createComponent().componentInstance).toBeTruthy();
  });

  // --- Form initialization ---
  it('should initialize form with DEFAULTS', () => {
    const { componentInstance: c } = createComponent();
    expect(c.settingsForm.get('showModeSwitch')!.value).toBe(DEFAULTS.showModeSwitch);
    expect(c.settingsForm.get('isSnkeOSMode')!.value).toBe(DEFAULTS.isSnkeOSMode);
    const expectedWelcome = localStorage.getItem('showWelcomeMsg') === 'true';
    expect(c.settingsForm.get('showWelcomeMsg')!.value).toBe(expectedWelcome);
  });

  it('should read saved theme from localStorage', () => {
    localStorage.setItem('theme', theme.dark);
    const { componentInstance: c } = createComponent();
    expect(c.settingsForm.get('theme')!.value).toBe(theme.dark);
  });

  it('should fall back to USER_THEME when no theme stored', () => {
    const { componentInstance: c } = createComponent();
    expect(c.settingsForm.get('theme')!.value).toBe(USER_THEME);
  });

  // --- currentMode getter ---
  it('should return snkeOS mode when isSnkeOSMode is true', () => {
    const { componentInstance: c } = createComponent();
    c.settingsForm.get('isSnkeOSMode')!.setValue(true);
    expect(c.currentMode).toBe(mode.snkeOS);
  });

  it('should return azureDevOps mode when isSnkeOSMode is false', () => {
    const { componentInstance: c } = createComponent();
    c.settingsForm.get('isSnkeOSMode')!.setValue(false);
    expect(c.currentMode).toBe(mode.azureDevOps);
  });

  // --- isDefaultState ---
  it('should be default state when form matches DEFAULTS', () => {
    const { componentInstance: c } = createComponent();
    // If localStorage overrides a default (tests set showWelcomeMsg=false),
    // the form will not match DEFAULTS and isDefaultState() should be false.
    expect(c.isDefaultState()).toBeFalse();
  });

  it('should not be default state when a value changes', () => {
    const { componentInstance: c } = createComponent();
    // Change a different control so we reliably trigger a non-default state
    c.settingsForm.get('showModeSwitch')!.setValue(!DEFAULTS.showModeSwitch);
    expect(c.isDefaultState()).toBeFalse();
  });

  // --- Alerts disabled in SnkeOS mode ---
  it('should disable alert controls when SnkeOS mode is on', () => {
    const { componentInstance: c } = createComponent();
    c.settingsForm.get('isSnkeOSMode')!.setValue(true);
    expect(c.settingsForm.get('showSubmitAlert')!.disabled).toBeTrue();
    expect(c.settingsForm.get('showFormChangeAlert')!.disabled).toBeTrue();
  });

  it('should enable alert controls when SnkeOS mode is off', () => {
    const { componentInstance: c } = createComponent();
    c.settingsForm.get('isSnkeOSMode')!.setValue(true);
    c.settingsForm.get('isSnkeOSMode')!.setValue(false);
    expect(c.settingsForm.get('showSubmitAlert')!.enabled).toBeTrue();
    expect(c.settingsForm.get('showFormChangeAlert')!.enabled).toBeTrue();
  });

  // --- onSave ---
  it('should persist form values to localStorage on save', () => {
    const { componentInstance: c } = createComponent();
    c.settingsForm.patchValue({ theme: theme.dark, isSnkeOSMode: true, showWelcomeMsg: false });
    c.onSave();
    expect(localStorage.getItem('theme')).toBe(theme.dark);
    expect(localStorage.getItem('isSnkeOSMode')).toBe('true');
    expect(localStorage.getItem('showWelcomeMsg')).toBe('false');
  });

  // --- onCancel ---
  it('should navigate to / on cancel', () => {
    const fixture = createComponent();
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    fixture.componentInstance.onCancel();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  // --- resetToDeviceTheme ---
  it('should remove stored theme and reset to USER_THEME', () => {
    localStorage.setItem('theme', theme.dark);
    const { componentInstance: c } = createComponent();
    c.resetToDeviceTheme();
    expect(localStorage.getItem('theme')).toBeNull();
    expect(c.settingsForm.get('theme')!.value).toBe(USER_THEME);
  });
});
