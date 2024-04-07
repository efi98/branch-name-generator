import {Component, OnInit} from '@angular/core';
import {ConfirmationService, MessageService, PrimeNGConfig} from 'primeng/api';
import {welcomeMessage} from "@app-utils";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    providers: [MessageService, ConfirmationService]
})
export class AppComponent implements OnInit {

    constructor(private primengConfig: PrimeNGConfig,
                private confirmationService: ConfirmationService,
                private messageService: MessageService) {
    }

    ngOnInit() {
        const initialMessage: string =
            '//   _____                _           _   _             _____ __ _ \n' +
            '//  /  __ \\              | |         | | | |           |  ___/ _(_)\n' +
            '//  | /  \\/_ __ ___  __ _| |_ ___  __| | | |__  _   _  | |__| |_ _ \n' +
            '//  | |   | \'__/ _ \\/ _` | __/ _ \\/ _` | | \'_ \\| | | | |  __|  _| |\n' +
            '//  | \\__/\\ | |  __/ (_| | ||  __/ (_| | | |_) | |_| | | |__| | | |\n' +
            '//   \\____/_|  \\___|\\__,_|\\__\\___|\\__,_| |_.__/ \\__, | \\____/_| |_|\n' +
            '//                                               __/ |             \n' +
            '//                                              |___/              \n'
            + '//  Repo: https://github.com/efi98/branch-name-generator'
        this.primengConfig.ripple = true;
        this.showWelcomeMessage();
        console.log(initialMessage);
    }

    private showWelcomeMessage() {
        let firstTimeLoading: boolean = Boolean(localStorage.getItem('firstTimeLoading'));
        if (!firstTimeLoading) {
            this.confirmationService.confirm({
                header: 'Welcome to Branch name generator!',
                message: welcomeMessage,
                acceptVisible: true,
                rejectVisible: false,
                acceptLabel: 'Ok, Got it!',
                closeOnEscape: false,
                dismissableMask: false,
                defaultFocus: "none"
            });
            localStorage.setItem('firstTimeLoading', 'false');
        }
    }
}
