import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { Component } from '@angular/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AppComponent } from './app.component';
import { theme } from '@app-utils';

@Component({ standalone: true, template: '' })
class StubMainComponent {}

@Component({ standalone: true, template: '' })
class StubSettingsComponent {}

const testRoutes = [
  { path: '', component: StubMainComponent },
  { path: 'settings', component: StubSettingsComponent },
  { path: '**', redirectTo: '' },
];

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter(testRoutes),
        provideNoopAnimations(),
        ConfirmationService,
        MessageService,
      ],
    }).compileComponents();

    localStorage.clear();
    // Prevent welcome dialog from firing async ops during tests
    localStorage.setItem('showWelcomeMsg', 'false');
  });

  it('should create', fakeAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    tick();
    expect(fixture.componentInstance).toBeTruthy();
  }));

  it('should set isDarkTheme true when stored theme is dark', fakeAsync(() => {
    localStorage.setItem('theme', theme.dark);
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    tick();
    expect(fixture.componentInstance.isDarkTheme).toBeTrue();
  }));

  it('should set isDarkTheme false when stored theme is light', fakeAsync(() => {
    localStorage.setItem('theme', theme.light);
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    tick();
    expect(fixture.componentInstance.isDarkTheme).toBeFalse();
  }));

  it('should toggle theme from light to dark', fakeAsync(() => {
    localStorage.setItem('theme', theme.light);
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    tick();
    fixture.componentInstance.toggleTheme();
    expect(fixture.componentInstance.isDarkTheme).toBeTrue();
    expect(localStorage.getItem('theme')).toBe(theme.dark);
  }));

  it('should toggle theme from dark to light', fakeAsync(() => {
    localStorage.setItem('theme', theme.dark);
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    tick();
    fixture.componentInstance.toggleTheme();
    expect(fixture.componentInstance.isDarkTheme).toBeFalse();
    expect(localStorage.getItem('theme')).toBe(theme.light);
  }));

  it('should set dontShowSubmitAlert in localStorage', fakeAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    tick();
    fixture.componentInstance.dontShowAgain('submit');
    expect(localStorage.getItem('dontShowSubmitAlert')).toBe('true');
  }));

  it('should set dontShowFormChangeAlert in localStorage', fakeAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    tick();
    fixture.componentInstance.dontShowAgain('formChange');
    expect(localStorage.getItem('dontShowFormChangeAlert')).toBe('true');
  }));

  it('should hide settings buttons when navigating to /settings', fakeAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    tick();
    TestBed.inject(Router).navigateByUrl('/settings');
    tick();
    fixture.detectChanges();
    expect(fixture.componentInstance.showSettingsButtons).toBeFalse();
  }));

  it('should show settings buttons when navigating back to /', fakeAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    tick();
    const router = TestBed.inject(Router);
    router.navigateByUrl('/settings');
    tick();
    router.navigateByUrl('/');
    tick();
    fixture.detectChanges();
    expect(fixture.componentInstance.showSettingsButtons).toBeTrue();
  }));
});
