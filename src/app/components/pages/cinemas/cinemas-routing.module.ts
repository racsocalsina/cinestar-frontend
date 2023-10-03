import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CinemasComponent } from '@components/pages/cinemas/cinemas.component';
import { IndexCinemasComponent } from '@components/pages/cinemas/index/index-cinemas.component';
import { CinemaMoviesComponent } from '@components/pages/cinemas/cinema-movies/cinema-movies.component';

const routes: Routes = [
    {
        path: '',
        component: CinemasComponent,
        children: [
            {
                path: '',
                component: IndexCinemasComponent
            },
            {
                path: ':cinema/peliculas',
                component: CinemaMoviesComponent
            }
        ]
    }
];

@NgModule( {
    imports: [RouterModule.forChild( routes )],
    exports: [RouterModule]
} )
export class CinemasRoutingModule {}
