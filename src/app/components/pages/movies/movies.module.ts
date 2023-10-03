import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MoviesRoutingModule } from './movies-routing.module';
import { MoviesComponent } from './movies.component';
import { SharedModule } from '../../../shared.module';
import { SharedComponentsModule } from '@components/shared/shared-components.module';
import { ModalsModule } from '@modals/modals.module';
import { ServicesModule } from '@services/services.module';


@NgModule( {
    declarations: [MoviesComponent],
    imports: [
        CommonModule,
        MoviesRoutingModule,
        SharedModule,
        SharedComponentsModule,
        ModalsModule,
        ServicesModule
    ]
} )
export class MoviesModule {}
