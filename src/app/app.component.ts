import {Component, OnInit} from '@angular/core';
import {ConfirmationService, MessageService, PrimeNGConfig} from 'primeng/api';
import {initialMessage, stringToBoolean, welcomeMessage} from "@app-utils";

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
        this.primengConfig.inputStyle = "filled";
        this.showWelcomeMessage();
        console.log(initialMessage);
    }

    private showWelcomeMessage() {
        let firstTimeLoading: boolean = stringToBoolean(localStorage.getItem('firstTimeLoading') as 'false' | 'true');
        if (firstTimeLoading) {
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
