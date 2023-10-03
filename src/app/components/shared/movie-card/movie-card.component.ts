import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MoviesService } from '@services/movies.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Movie } from '@models/movie.model';
import { AuthModalsService } from '@services/auth-modals.service';

@Component( {
    selector: 'app-movie-card',
    templateUrl: './movie-card.component.html',
    styleUrls: ['./movie-card.component.scss']
} )
export class MovieCardComponent implements OnInit {

    @Input() movie!: Movie;
    @Input() cinemaId?: number;
    @Input() featured = false;

    constructor( private router: Router,
                 private route: ActivatedRoute,
                 private authModalsService: AuthModalsService,
                 private moviesService: MoviesService ) { }

    ngOnInit(): void {
    }

    showResume(): void {
        this.moviesService.setFloatingMovie( { movie: this.movie, cinemaId: this.cinemaId } );
        const floating = document.getElementById( 'floating-summary' );
        if ( floating ) {
            floating.style.right = '0';
        }

    }

    buy(): void {
        const date = this.route.snapshot.queryParamMap.get( 'date' );
        let queryParams = {};

        if ( date ) {
            queryParams = { date };
        }

        let route = `/peliculas/${this.movie.id}`;
        if ( this.cinemaId ) {
            route = `${route}/${this.cinemaId}`;
        }

        this.router.navigate( [route], { queryParams } ).finally();
    }

}
