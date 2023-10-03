import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CinemaService } from '@services/cinema.service';
import { Subscription } from 'rxjs';
import { Cinema } from '@models/cinema.model';
import { Movie } from '@models/movie.model';

@Component( {
    selector: 'app-header-movie-details-responsive',
    templateUrl: './header-movie-details-responsive.component.html',
    styleUrls: [
        '../header-home/header-home.component.scss',
        './header-movie-details-responsive.component.scss'
    ]
} )
export class HeaderMovieDetailsResponsiveComponent implements OnInit, OnDestroy {

    @Input() fromCinemas = false;
    @Input() showSearch = false;
    @Input() movie?: Movie;
    @Output() onSearchEvt = new EventEmitter<any>();
    cinema?: Cinema;
    onSearch = false;
    subs: Subscription[] = [];
    searchTerm!: string;

    constructor( private router: Router,
                 private route: ActivatedRoute,
                 private cinemaService: CinemaService ) { }

    ngOnInit(): void {
        const { cinema: id } = this.route.snapshot.params;
        this.subs.push( this.cinemaService.getCinemas().subscribe( cinemas => {
            if ( cinemas.length ) {
                this.cinema = this.cinemaService.getCinemaById( id );
            }
        } ) );
    }

    ngOnDestroy(): void {
        this.subs.forEach( s => s.unsubscribe() );
    }

    back(): void {
        if ( this.fromCinemas ) {
            this.router.navigateByUrl( '/cines' ).finally();
        } else if ( this.cinema ) {
            this.router.navigateByUrl( `/cines/${this.cinema?.id}/peliculas` ).finally();
        } else {
            const queryParams: any = {};
            if ( this.movie && this.movie.is_release ) {
                queryParams.tipo = 'proximos_estrenos';
            }
            this.router.navigate( ['/peliculas'], { queryParams } ).finally();
        }
    }

    searchMovie() {
        this.onSearchEvt.emit( this.searchTerm );
    }
}
