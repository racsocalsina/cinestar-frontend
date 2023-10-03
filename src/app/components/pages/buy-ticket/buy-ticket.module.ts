import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BuyTicketRoutingModule } from './buy-ticket-routing.module';
import { BuyTicketComponent } from './buy-ticket.component';
import { SharedModule } from '../../../shared.module';
import { BuyTicketDesktopLayoutComponent } from './buy-ticket-desktop-layout/buy-ticket-desktop-layout.component';
import { BuyTicketStep1Component } from './buy-ticket-step1/buy-ticket-step1.component';
import { BuyTicketResponsiveLayoutComponent } from './buy-ticket-responsive-layout/buy-ticket-responsive-layout.component';
import { BuyTicketStep2Component } from './buy-ticket-step2/buy-ticket-step2.component';
import { Step1ResponsiveComponent } from './buy-ticket-step1/responsive/step1-responsive.component';
import { Step1DesktopComponent } from './buy-ticket-step1/desktop/step1-desktop.component';
import { Step2DesktopComponent } from './buy-ticket-step2/desktop/step2-desktop.component';
import { Step2ResponsiveComponent } from './buy-ticket-step2/responsive/step2-responsive.component';
import { SharedComponentsModule } from '@components/shared/shared-components.module';
import { BuyTicketStep3Component } from './buy-ticket-step3/buy-ticket-step3.component';
import { Step3ResponsiveComponent } from './buy-ticket-step3/responsive/step3-responsive.component';
import { Step3DesktopComponent } from './buy-ticket-step3/desktop/step3-desktop.component';
import { ServicesModule } from '@services/services.module';
import { BuyTicketStep4Component } from './buy-ticket-step4/buy-ticket-step4.component';
import { Step4DesktopComponent } from './buy-ticket-step4/desktop/step4-desktop.component';
import { Step4ResponsiveComponent } from './buy-ticket-step4/responsive/step4-responsive.component';

@NgModule( {
    declarations: [
        BuyTicketComponent,
        BuyTicketDesktopLayoutComponent,
        BuyTicketStep1Component,
        BuyTicketResponsiveLayoutComponent,
        BuyTicketStep2Component,
        Step1ResponsiveComponent,
        Step1DesktopComponent,
        Step2DesktopComponent,
        Step2ResponsiveComponent,
        BuyTicketStep3Component,
        Step3ResponsiveComponent,
        Step3DesktopComponent,
        BuyTicketStep4Component,
        Step4DesktopComponent,
        Step4ResponsiveComponent
    ],
    imports: [
        CommonModule,
        BuyTicketRoutingModule,
        SharedModule,
        SharedComponentsModule,
        ServicesModule
    ]
} )
export class BuyTicketModule {}
