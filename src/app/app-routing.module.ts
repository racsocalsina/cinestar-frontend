import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { environment } from '../environments/environment';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('@components/pages/home/home.module').then( m => m.HomeModule )
    },
    {
        path: 'change-password',
        loadChildren: () => import('@components/pages/home/home.module').then( m => m.HomeModule )
    },
    {
        path: 'peliculas',
        loadChildren: () => import('@components/pages/movies/movies.module').then( m => m.MoviesModule )
    },
    {
        path: 'peliculas/:movie',
        loadChildren: () => import('@components/pages/movie-details/movie-details.module').then( m => m.MovieDetailsModule ),
    },
    {
        path: 'peliculas/:movie/:cinema',
        loadChildren: () => import('@components/pages/movie-details/movie-details.module').then( m => m.MovieDetailsModule ),
    },
    {
        path: 'peliculas/:movie/:cinema/comprar',
        loadChildren: () => import('@components/pages/buy-ticket/buy-ticket.module').then( m => m.BuyTicketModule ),
        // canActivate: [AuthGuard]
    },
    {
        path: 'cines',
        loadChildren: () => import('@components/pages/cinemas/cinemas.module').then( m => m.CinemasModule ),
    },
    {
        path: 'chocolateria',
        loadChildren: () => import('@components/pages/chocolateria/chocolateria.module').then( m => m.ChocolateriaModule )
    },
    {
        path: 'libro-de-reclamaciones',
        loadChildren: () => import('@components/pages/complaints-book/complaints-book.module').then( m => m.ComplaintsBookModule )
    },
    {
        path: 'quienes-somos',
        loadChildren: () => import('@components/pages/about-us/about-us.module').then( m => m.AboutUsModule )
    },
    {
        path: 'socios',
        loadChildren: () => import('@components/pages/partner-star/partner-star.module').then( m => m.PartnerStarModule )
    },
    {
        path: 'corporativo',
        loadChildren: () => import('@components/pages/corporate/corporate.module').then( m => m.CorporateModule )
    },
    {
        path: 'trabaja-con-nosotros',
        loadChildren: () => import('@components/pages/work-with-us/work-with-us.module').then( m => m.WorkWithUsModule )
    },
    {
        path: 'promotions',
        loadChildren: () => import('./components/pages/promotions/promotions.module').then(m => m.PromotionsModule) },
    {
        path: '**',
        redirectTo: '/'
    },
];

@NgModule( {
    imports: [
        RouterModule.forRoot( routes, {
            useHash: environment.useHash,
            scrollPositionRestoration: 'top'
        } )
    ],
    exports: [RouterModule]
} )
export class AppRoutingModule {}
