import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {CardModule} from 'primeng/card';
import {ButtonModule} from 'primeng/button';
import {AppComponent} from './app.component';
import {MainComponent} from './main/main.component';
import {FieldsetModule} from 'primeng/fieldset';
import {ToastModule} from 'primeng/toast';
import {DividerModule} from 'primeng/divider';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ReactiveFormsModule} from "@angular/forms";
import {CheckboxModule} from "primeng/checkbox";
import {InputTextModule} from "primeng/inputtext";
import {RippleModule} from "primeng/ripple";
import {TooltipModule} from "primeng/tooltip";
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {KeyFilterModule} from "primeng/keyfilter";

@NgModule({
    bootstrap: [AppComponent],
    declarations: [
        AppComponent,
        MainComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        CardModule,
        ButtonModule,
        FieldsetModule,
        ToastModule,
        BrowserAnimationsModule,
        DividerModule,
        ReactiveFormsModule,
        CheckboxModule,
        InputTextModule,
        RippleModule,
        TooltipModule,
        ConfirmDialogModule,
        KeyFilterModule
    ],
    providers: []
})
export class AppModule {
}
