import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { RouterModule } from '@angular/router';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgSelectModule } from '@ng-select/ng-select';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalsModule } from '@components/modals/modals.module';
import { DirectivesModule } from '@directives/directives.module';
import { AgmCoreModule } from '@agm/core';
import { environment } from '../environments/environment';
import { PipesModule } from '@pipes/pipes.module';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import {AdsenseModule} from "ng2-adsense";

const maskConfigFunction: () => Partial<IConfig> = () => {
    return {
        validation: false,
    };
};

@NgModule( {
    declarations: [],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule,
        BsDropdownModule.forRoot(),
        ModalModule.forRoot(),
        NgSelectModule,
        PerfectScrollbarModule,
        BsDatepickerModule.forRoot(),
        DirectivesModule,
        PipesModule,
        NgxMaskModule.forRoot( maskConfigFunction ),
        AgmCoreModule.forRoot( {
            apiKey: environment.google_maps_api_key
        } ),
        AdsenseModule.forRoot({}),
    ],
    exports: [
        ReactiveFormsModule,
        FormsModule,
        RouterModule,
        NgSelectModule,
        PerfectScrollbarModule,
        BsDatepickerModule,
        PipesModule,
        DirectivesModule,
        AgmCoreModule,
        NgxMaskModule
    ]
} )
export class SharedModule {}
