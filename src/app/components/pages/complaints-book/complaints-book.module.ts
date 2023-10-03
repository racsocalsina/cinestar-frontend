import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComplaintsBookRoutingModule } from './complaints-book-routing.module';
import { ComplaintsBookComponent } from './complaints-book.component';
import { SharedModule } from '../../../shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Step1Component } from './steps/step1/step1.component';
import { Step2Component } from './steps/step2/step2.component';
import { Step3Component } from './steps/step3/step3.component';
import { NgxCaptchaModule } from 'ngx-captcha';
import { SharedComponentsModule } from '@components/shared/shared-components.module';
import { ServicesModule } from '@services/services.module';


@NgModule( {
    declarations: [ComplaintsBookComponent, Step1Component, Step2Component, Step3Component],
    imports: [
        CommonModule,
        ComplaintsBookRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        SharedModule,
        NgSelectModule,
        SharedModule,
        NgxCaptchaModule,
        SharedComponentsModule,
        ServicesModule
    ]
} )
export class ComplaintsBookModule {}
