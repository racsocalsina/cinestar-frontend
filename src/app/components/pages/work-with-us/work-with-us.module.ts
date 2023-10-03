import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkWithUsRoutingModule } from './work-with-us-routing.module';
import { WorkWithUsComponent } from './work-with-us.component';
import { SharedModule } from '../../../shared.module';
import { DirectivesModule } from '@directives/directives.module';
import { NgxCaptchaModule } from 'ngx-captcha';
import { SharedComponentsModule } from '@components/shared/shared-components.module';
import { ServicesModule } from '@services/services.module';

@NgModule( {
    declarations: [WorkWithUsComponent],
    imports: [
        CommonModule,
        WorkWithUsRoutingModule,
        SharedModule,
        DirectivesModule,
        NgxCaptchaModule,
        SharedComponentsModule,
        ServicesModule,
    ]
} )
export class WorkWithUsModule {}
