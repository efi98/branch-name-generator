import { Component, OnInit } from '@angular/core';
import {ConfirmationService, MessageService, PrimeNGConfig} from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class AppComponent implements OnInit {
  theme: 'light' | 'dark' = 'light';
  constructor(private primengConfig: PrimeNGConfig, private messageService: MessageService) { }

  ngOnInit() {
    this.primengConfig.ripple = true;
  }
  
  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    // this.messageService.add({ severity: 'info', summary: 'Info', detail: `theme changed to ${this.theme}, reload to apply changes.` });
  }
}
