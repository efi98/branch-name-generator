import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { SNKEOS_PREFIX, snkeOsType } from '@app-utils';

@Directive({
  selector: '[customPrefix]',
})
export class PrefixDirective implements OnInit, OnChanges {
  @Input() customPrefix!: snkeOsType;

  private prefix = '';

  constructor(
    private el: ElementRef<HTMLInputElement>,
    private ngControl: NgControl,
  ) {}

  ngOnInit(): void {
    this.updatePrefix();
    this.applyPrefix();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['customPrefix']) {
      const oldPrefix = this.prefix;

      this.updatePrefix();
      this.applyPrefix(oldPrefix);
    }
  }

  @HostListener('input')
  onInput(): void {
    this.applyPrefix();
  }

  @HostListener('focus')
  @HostListener('click')
  @HostListener('keyup')
  keepCursorAfterPrefix(): void {
    const input = this.el.nativeElement;

    if (input.selectionStart !== null && input.selectionStart < this.prefix.length) {
      input.setSelectionRange(this.prefix.length, this.prefix.length);
    }
  }

  private updatePrefix(): void {
    this.prefix = SNKEOS_PREFIX[this.customPrefix] ?? '';
  }

  private applyPrefix(previousPrefix?: string): void {
    const input = this.el.nativeElement;

    let value = input.value ?? '';

    if (previousPrefix && value.startsWith(previousPrefix)) {
      value = value.slice(previousPrefix.length);
    } else if (value.startsWith(this.prefix)) {
      value = value.slice(this.prefix.length);
    } else {
      value = this.removeKnownPrefix(value);
    }

    const nextValue = `${this.prefix}${value}`;

    if (input.value !== nextValue) {
      input.value = nextValue;
      this.ngControl.control?.setValue(nextValue, { emitEvent: false });
    }

    this.keepCursorAfterPrefix();
  }

private removeKnownPrefix(value: string): string {
  return value.replace(/^((feat|fix|hotfix)\s*\/?\s*)+/i, '');
}
}
