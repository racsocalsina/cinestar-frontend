import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { NextReleasesComponent } from './sections/next-releases/next-releases.component';
import { IvyCarouselModule } from 'angular-responsive-carousel';
import { SharedModule } from '../../../shared.module';
import { MovieBillboardComponent } from './sections/movie-billboard/movie-billboard.component';
import { CorporateSalesComponent } from './sections/corporate-sales/corporate-sales.component';
import { ServicesModule } from '@services/services.module';
import { SharedComponentsModule } from '@components/shared/shared-components.module';
import {AdsenseModule} from "ng2-adsense";


@NgModule( {
    declarations: [
        HomeComponent,
        NextReleasesComponent,
        MovieBillboardComponent,
        CorporateSalesComponent
    ],
    imports: [
        CommonModule,
        HomeRoutingModule,
        SharedModule,
        IvyCarouselModule,
        ServicesModule,
        SharedComponentsModule,
        AdsenseModule,
    ],

} )
export class HomeModule {}
