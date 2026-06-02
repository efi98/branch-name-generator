import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Button, ButtonDirective } from 'primeng/button';
import { Tooltip } from 'primeng/tooltip';
import { filter } from 'rxjs';
import {
  initialMessage,
  stringToBoolean,
  switchPrimeTheme,
  theme,
  USER_THEME,
  welcomeMessage,
} from '@app-utils';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [MessageService, ConfirmationService],
  imports: [RouterOutlet, RouterLink, Toast, ConfirmDialog, ButtonDirective, Tooltip, Button],
})
export class AppComponent implements OnInit {
  isDarkTheme: boolean = false;
  showSettingsButtons: boolean = true;

  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly router: Router,
  ) {}

  ngOnInit() {
    this.applyTheme();
    this.onShowWelcomeMessage();
    console.log(initialMessage);

    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.showSettingsButtons = event.urlAfterRedirects !== '/settings';
        const storedTheme = localStorage.getItem('theme') as theme;
        this.isDarkTheme = (storedTheme || USER_THEME) === theme.dark;
      });
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    const currentTheme: theme = this.isDarkTheme ? theme.dark : theme.light;
    localStorage.setItem('theme', currentTheme);
    this.applyTheme();
  }

  dontShowAgain(type: 'submit' | 'formChange') {
    if (type === 'submit') {
      localStorage.setItem('dontShowSubmitAlert', 'true');
    } else if (type === 'formChange') {
      localStorage.setItem('dontShowFormChangeAlert', 'true');
    }
  }

  private applyTheme() {
    const currentTheme = (localStorage.getItem('theme') as theme) || USER_THEME;
    this.isDarkTheme = currentTheme === theme.dark;
    if (this.isDarkTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    switchPrimeTheme(currentTheme);
  }

  private onShowWelcomeMessage() {
    const showWelcomeMsg: boolean = stringToBoolean(
      localStorage.getItem('showWelcomeMsg') as 'false' | 'true',
    );
    if (showWelcomeMsg) {
      this.confirmationService.confirm({
        header: "Welcome to the 'Branch Name Generator'!",
        message: welcomeMessage,
        acceptVisible: true,
        rejectVisible: false,
        acceptLabel: 'Ok, Got it!',
        closeOnEscape: false,
        dismissableMask: false,
        defaultFocus: 'none',
        accept: () => {
          localStorage.setItem('showWelcomeMsg', 'false');
        },
      });
    }
  }
}
