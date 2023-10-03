import { Component, OnDestroy, OnInit } from '@angular/core';
import { Movie } from '@models/movie.model';
import { MoviesService } from '@services/movies.service';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component( {
    selector: 'app-movie-billboard',
    templateUrl: './movie-billboard.component.html',
    styleUrls: ['./movie-billboard.component.scss']
} )
export class MovieBillboardComponent implements OnInit, OnDestroy {

    movies: Movie[] = [];
    isLoading = false;
    subs: Subscription[] = [];

    constructor( private moviesService: MoviesService ) { }

    ngOnInit(): void {
        this.getMovies();
    }

    ngOnDestroy() {
        this.subs.forEach( s => s.unsubscribe() );
    }

    getMovies(): void {
        this.isLoading = true;

        this.subs.push(
            this.moviesService.getBillboard()
            .subscribe( movies => {
                console.log( movies );

                if ( window.innerWidth >= 1950 ) {
                    this.movies = movies.slice( 0, 26 );
                } else if ( window.innerWidth >= 1750 ) {
                    this.movies = movies.slice( 0, 24 );
                } else if ( window.innerWidth >= 1550 ) {
                    this.movies = movies.slice( 0, 21 );
                } else if ( window.innerWidth >= 1366 ) {
                    this.movies = movies.slice( 0, 18 );
                } else if ( window.innerWidth >= 992 ) {
                    this.movies = movies.slice( 0, 15 );
                } else {
                    this.movies = movies.slice( 0, 12 );
                }

                this.isLoading = false;
            }, () => this.isLoading = false )
        );
    }

}
