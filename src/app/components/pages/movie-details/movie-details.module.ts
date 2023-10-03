import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MovieDetailsRoutingModule } from './movie-details-routing.module';
import { MovieDetailsComponent } from './movie-details.component';
import { MovieDetailsResponsiveComponent } from './responsive/movie-details-responsive.component';
import { MovieDetailsDesktopComponent } from './desktop/movie-details-desktop.component';
import { SharedModule } from '../../../shared.module';
import { SharedComponentsModule } from '@components/shared/shared-components.module';
import { ServicesModule } from '@services/services.module';


@NgModule( {
    declarations: [MovieDetailsComponent, MovieDetailsResponsiveComponent, MovieDetailsDesktopComponent],
    imports: [
        CommonModule,
        MovieDetailsRoutingModule,
        SharedModule,
        SharedComponentsModule,
        ServicesModule
    ]
} )
export class MovieDetailsModule {}
