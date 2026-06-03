import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MainComponent } from './main.component';
import { snkeOsType, workItemTypes } from '@app-utils';

describe('MainComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainComponent, ReactiveFormsModule],
      providers: [
        provideNoopAnimations(),
        ConfirmationService,
        MessageService,
      ],
    }).compileComponents();

    localStorage.clear();
    localStorage.setItem('showWelcomeMsg', 'false');
  });

  function createComponent() {
    const fixture = TestBed.createComponent(MainComponent);
    fixture.detectChanges();
    return fixture;
  }

  // --- Creation ---
  it('should create', () => {
    expect(createComponent().componentInstance).toBeTruthy();
  });

  // --- Mode ---
  it('should read isSnkeOSMode from localStorage', () => {
    localStorage.setItem('isSnkeOSMode', 'true');
    const { componentInstance } = createComponent();
    expect(componentInstance.isSnkeOSMode).toBeTrue();
  });

  it('should default to azure devops mode', () => {
    const { componentInstance } = createComponent();
    expect(componentInstance.isSnkeOSMode).toBeFalse();
  });

  it('should persist mode toggle to localStorage', () => {
    const { componentInstance } = createComponent();
    componentInstance.isSnkeOSMode = true;
    componentInstance.toggleMode();
    expect(localStorage.getItem('isSnkeOSMode')).toBe('true');
  });

  // --- SnkeOS options ---
  it('should have feature, bugfix and hotfix options (no version)', () => {
    const { componentInstance } = createComponent();
    const labels = componentInstance.snkeOsOptions.map(o => o.value);
    expect(labels).toContain(snkeOsType.feature);
    expect(labels).toContain(snkeOsType.bugfix);
    expect(labels).toContain(snkeOsType.hotfix);
  });

  // --- SnkeOS form submit ---
  describe('SnkeOS submit', () => {
    beforeEach(() => localStorage.setItem('isSnkeOSMode', 'true'));

    it('should generate feat/ branch for feature type', () => {
      const fixture = createComponent();
      const c = fixture.componentInstance;
      c.snkeOSForm.setValue({ snkeosType: snkeOsType.feature, snkeosInput: 'feat / my feature' });
      c.onSubmit();
      expect(c.branchNameResult[0].value).toBe('feat/my-feature');
    });

    it('should generate fix/ branch for bugfix type', () => {
      const fixture = createComponent();
      const c = fixture.componentInstance;
      c.snkeOSForm.setValue({ snkeosType: snkeOsType.bugfix, snkeosInput: 'fix / login crash' });
      c.onSubmit();
      expect(c.branchNameResult[0].value).toBe('fix/login-crash');
    });

    it('should generate hotfix/ branch for hotfix type', () => {
      const fixture = createComponent();
      const c = fixture.componentInstance;
      c.snkeOSForm.setValue({ snkeosType: snkeOsType.hotfix, snkeosInput: 'hotfix / critical bug' });
      c.onSubmit();
      expect(c.branchNameResult[0].value).toBe('hotfix/critical-bug');
    });

    it('should be invalid when input is empty', () => {
      const fixture = createComponent();
      const c = fixture.componentInstance;
      c.snkeOSForm.setValue({ snkeosType: snkeOsType.feature, snkeosInput: '' });
      expect(c.snkeOSForm.valid).toBeFalse();
    });
  });

  // --- Azure DevOps form ---
  describe('Azure DevOps form', () => {
    it('should be invalid when workItem is empty', () => {
      const { componentInstance } = createComponent();
      expect(componentInstance.generatorForm.valid).toBeFalse();
    });

    it('should validate workItem format', () => {
      const { componentInstance } = createComponent();
      const ctrl = componentInstance.generatorForm.get('workItem')!;
      ctrl.setValue('Bug 12345: some bug');
      ctrl.markAsDirty();
      expect(ctrl.valid).toBeTrue();
    });

    it('should reject workItem with wrong format', () => {
      const { componentInstance } = createComponent();
      const ctrl = componentInstance.generatorForm.get('workItem')!;
      ctrl.setValue('not a valid work item');
      ctrl.markAsDirty();
      expect(ctrl.hasError('workItemSyntax')).toBeTrue();
    });

    it('should reject workItem with forbidden chars', () => {
      const { componentInstance } = createComponent();
      const ctrl = componentInstance.generatorForm.get('workItem')!;
      ctrl.setValue('Bug 12345: invalid:name');
      ctrl.markAsDirty();
      expect(ctrl.hasError('forbiddenChars')).toBeTrue();
    });

    it('should enable requirement field when isReqIncluded is checked for Bug', fakeAsync(() => {
      const { componentInstance } = createComponent();
      componentInstance.generatorForm.get('workItem')!.setValue('Bug 12345: some bug');
      tick(200);
      componentInstance.generatorForm.get('isReqIncluded')!.setValue(true);
      tick(200);
      expect(componentInstance.generatorForm.get('requirement')!.enabled).toBeTrue();
    }));

    it('should generate Requirement branch for Requirement work item', () => {
      const { componentInstance } = createComponent();
      componentInstance.generatorForm.get('workItem')!.setValue('Requirement 12345: my feature');
      componentInstance.onSubmit();
      const result = componentInstance.branchNameResult.find(r => r.key === workItemTypes.Requirement);
      expect(result).toBeTruthy();
      expect(result!.value).toContain('my-feature');
    });
  });
});
