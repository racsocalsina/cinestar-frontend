import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CinemasRoutingModule } from './cinemas-routing.module';
import { CinemasComponent } from './cinemas.component';
import { IndexCinemasComponent } from './index/index-cinemas.component';
import { CinemaMoviesComponent } from './cinema-movies/cinema-movies.component';
import { SharedModule } from '../../../shared.module';
import { SidebarCinemasComponent } from './index/sidebar/sidebar-cinemas.component';
import { SharedComponentsModule } from '@components/shared/shared-components.module';

import { ServicesModule } from '@services/services.module';

/*import { defineLocale } from 'ngx-bootstrap/chronos';
 import { esLocale } from 'ngx-bootstrap/locale';

 defineLocale( 'es', esLocale );*/


@NgModule( {
    declarations: [
        CinemasComponent,
        IndexCinemasComponent,
        CinemaMoviesComponent,
        SidebarCinemasComponent
    ],
    imports: [
        CommonModule,
        CinemasRoutingModule,
        SharedModule,
        SharedComponentsModule,
        ServicesModule
    ]
} )
export class CinemasModule {}
