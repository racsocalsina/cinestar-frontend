import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MoviesComponent } from '@components/pages/movies/movies.component';

const routes: Routes = [
    {
        path: '',
        component: MoviesComponent
    }
];

@NgModule( {
    imports: [RouterModule.forChild( routes )],
    exports: [RouterModule]
} )
export class MoviesRoutingModule {}
