import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PartnerStarRoutingModule } from './partner-star-routing.module';
import { PartnerStarComponent } from './partner-star.component';
import { SharedModule } from '../../../shared.module';
import { SharedComponentsModule } from '@components/shared/shared-components.module';
import { ServicesModule } from '@services/services.module';


@NgModule( {
    declarations: [PartnerStarComponent],
    imports: [
        CommonModule,
        PartnerStarRoutingModule,
        SharedModule,
        SharedComponentsModule,
        ServicesModule
    ]
} )
export class PartnerStarModule {}
