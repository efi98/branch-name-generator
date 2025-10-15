import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService, PrimeNGConfig } from 'primeng/api';
import { initialMessage, stringToBoolean, switchPrimeTheme, theme, USER_THEME, welcomeMessage } from "@app-utils";
import { filter } from "rxjs";
import { NavigationEnd, Router } from "@angular/router";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    providers: [MessageService, ConfirmationService]
})
export class AppComponent implements OnInit {
    isDarkTheme: boolean = false;
    showSettingsButtons: boolean = true;

    constructor(private primengConfig: PrimeNGConfig,
                private confirmationService: ConfirmationService,
                private router: Router) {
    }

    ngOnInit() {
        this.primengConfig.ripple = true;
        this.primengConfig.inputStyle = 'filled';
        this.applyTheme();
        this.onShowWelcomeMessage();
        console.log(initialMessage);

        this.router.events.pipe(
            filter((event): event is NavigationEnd => event instanceof NavigationEnd)
        ).subscribe((event: NavigationEnd) => {
            this.showSettingsButtons = event.urlAfterRedirects !== '/settings';
            this.isDarkTheme = localStorage.getItem('theme') === theme.dark;
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
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        switchPrimeTheme(currentTheme);
    }

    private onShowWelcomeMessage() {
        let showWelcomeMsg: boolean = stringToBoolean(localStorage.getItem('showWelcomeMsg') as 'false' | 'true');
        if (showWelcomeMsg) {
            this.confirmationService.confirm({
                header: 'Welcome to the \'Branch Name Generator\'!',
                message: welcomeMessage,
                acceptVisible: true,
                rejectVisible: false,
                acceptLabel: 'Ok, Got it!',
                closeOnEscape: false,
                dismissableMask: false,
                defaultFocus: "none",
                accept: (() => {
                    localStorage.setItem('showWelcomeMsg', 'false');
                })
            });
        }
    }
}
