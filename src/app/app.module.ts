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
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {CheckboxModule} from "primeng/checkbox";
import {InputTextModule} from "primeng/inputtext";
import {RippleModule} from "primeng/ripple";
import {TooltipModule} from "primeng/tooltip";
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {KeyFilterModule} from "primeng/keyfilter";
import { InputSwitchModule } from "primeng/inputswitch";
import { SelectButtonModule } from "primeng/selectbutton";
import { SettingsComponent } from './settings/settings.component';
import { RadioButtonModule } from "primeng/radiobutton";
import { ToggleButtonModule } from "primeng/togglebutton";

@NgModule({
    bootstrap: [AppComponent],
    declarations: [
        AppComponent,
        MainComponent,
        SettingsComponent
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
        KeyFilterModule,
        InputSwitchModule,
        FormsModule,
        SelectButtonModule,
        RadioButtonModule,
        ToggleButtonModule
    ],
    providers: []
})
export class AppModule {
}
