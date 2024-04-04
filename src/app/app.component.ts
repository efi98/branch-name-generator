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
        this.primengConfig.ripple = true;
        this.showWelcomeMessage();
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
