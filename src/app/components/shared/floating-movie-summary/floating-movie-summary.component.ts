import { Component, OnDestroy, OnInit } from '@angular/core';
import { Utils } from '@utils/utils';
import { Router } from '@angular/router';
import { MoviesService } from '@services/movies.service';
import { FloatingMovieInterface } from '@interfaces/floating-movie.interface';
import { Subscription } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component( {
    selector: 'app-floating-movie-summary',
    templateUrl: './floating-movie-summary.component.html',
    styleUrls: ['./floating-movie-summary.component.scss']
} )
export class FloatingMovieSummaryComponent implements OnInit, OnDestroy {

    Utils = Utils;
    data!: FloatingMovieInterface;

    subs: Subscription[] = [];
    youtubeVideo!: SafeResourceUrl;

    constructor( private router: Router,
                 private sanitization: DomSanitizer,
                 private movieService: MoviesService ) { }

    ngOnInit(): void {
        this.subs.push( this.movieService.getFloatingMovie().subscribe( data => {
            this.data = data;
            console.log( data );
            this.getMovie( this.data.movie.id );
            this.youtubeVideo = this.sanitization.bypassSecurityTrustResourceUrl( `https://www.youtube.com/embed/${Utils.getYouTubeId( data.movie.url_trailer )}` );
        } ) );
    }

    ngOnDestroy(): void {
        this.subs.forEach( s => s.unsubscribe() );
    }

    getMovie( id: number ) {
        this.movieService.getMovieById( id ).then( movie => {
            console.log( movie );
            this.data.movie = movie;
        } )
        .catch( console.log );
    }

    hideResume(): void {
        const floating = document.getElementById( 'floating-summary' );
        if ( floating ) {
            floating.style.right = '-462px';
        }

    }

    next(): void {
        this.hideResume();
        let url = `/peliculas/${this.data.movie.id}`;

        if ( this.data.cinemaId ) {
            url = `${url}/${this.data.cinemaId}`;
        }

        this.router.navigateByUrl( url ).finally();

    }
}
