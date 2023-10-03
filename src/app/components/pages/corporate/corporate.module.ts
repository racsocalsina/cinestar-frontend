import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CorporateRoutingModule } from './corporate-routing.module';
import { CorporateComponent } from './corporate.component';
import { SharedModule } from '../../../shared.module';
import { SharedComponentsModule } from '@components/shared/shared-components.module';
import { ServicesModule } from '@services/services.module';


@NgModule( {
    declarations: [CorporateComponent],
    imports: [
        CommonModule,
        CorporateRoutingModule,
        SharedModule,
        SharedComponentsModule,
        ServicesModule
    ]
} )
export class CorporateModule {}
