import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChocolateriaRoutingModule } from './chocolateria-routing.module';
import { ChocolateriaComponent } from './chocolateria.component';
import { SharedComponentsModule } from '@components/shared/shared-components.module';
import { ServicesModule } from '@services/services.module';
import { IndexChocolateriaComponent } from './index/index-chocolateria.component';
import { IndexChocolateriaResponsiveComponent } from './index/responsive/index-chocolateria-responsive.component';
import { IndexChocolateriaDesktopComponent } from '@components/pages/chocolateria/index/desktop/index-chocolateria-desktop.component';
import { SharedModule } from '../../../shared.module';
import { PaymentChocolateriaComponent } from './payment/payment-chocolateria.component';
import { PaymentChocolateriaDesktopComponent } from './payment/desktop/payment-chocolateria-desktop.component';
import { PaymentChocolateriaResponsiveComponent } from './payment/responsive/payment-chocolateria-responsive.component';
import { ChocolateriaPaymentFormComponent } from '@components/pages/chocolateria/payment/form/chocolateria-payment-form.component';


@NgModule( {
    declarations: [
        ChocolateriaComponent,
        IndexChocolateriaComponent,
        IndexChocolateriaDesktopComponent,
        IndexChocolateriaResponsiveComponent,
        PaymentChocolateriaComponent,
        PaymentChocolateriaDesktopComponent,
        PaymentChocolateriaResponsiveComponent,
        ChocolateriaPaymentFormComponent
    ],
    imports: [
        CommonModule,
        ChocolateriaRoutingModule,
        ServicesModule,
        SharedComponentsModule,
        SharedModule
    ]
} )
export class ChocolateriaModule {}
