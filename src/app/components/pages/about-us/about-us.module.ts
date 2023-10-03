import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AboutUsRoutingModule } from './about-us-routing.module';
import { AboutUsComponent } from './about-us.component';
import { SharedModule } from '../../../shared.module';
import { SharedComponentsModule } from '@components/shared/shared-components.module';
import { ServicesModule } from '@services/services.module';


@NgModule( {
    declarations: [AboutUsComponent],
    imports: [
        CommonModule,
        AboutUsRoutingModule,
        SharedModule,
        SharedComponentsModule,
        ServicesModule
    ]
} )
export class AboutUsModule {}
