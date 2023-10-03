import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ScreenService } from '@services/screen.service';
import { MoviesService } from '@services/movies.service';
import { Movie } from '@models/movie.model';
import { GeneralService } from '@services/general.service';
import { Cinema } from '@models/cinema.model';
import { CinemaService } from '@services/cinema.service';
import { SeoService } from '@services/seo.service';

@Component( {
    selector: 'app-movie-details',
    templateUrl: './movie-details.component.html',
    styleUrls: ['./movie-details.component.scss']
} )
export class MovieDetailsComponent implements OnInit {

    movie!: Movie;
    cinema!: Cinema | undefined;
    isLoading = true;

    constructor( private route: ActivatedRoute,
                 private router: Router,
                 private generalService: GeneralService,
                 public screenService: ScreenService,
                 private cinemaService: CinemaService,
                 private seo: SeoService,
                 private movieService: MoviesService ) {
        seo.setTitle( 'Películas' );
    }

    async ngOnInit() {
        // this.generalService.fetchFormats();

        const { movie, cinema } = this.route.snapshot.params;

        try {
            this.movie = await this.movieService.getMovieById( Number( movie ) );
            this.seo.setTitle( this.movie.name );
            this.isLoading = false;
            this.getCinema( cinema );
        } catch ( e ) {
            this.router.navigateByUrl( 'peliculas' ).finally();
            this.isLoading = false;
        }

    }

    async getCinema( cinema: any ) {
        if ( cinema ) {
            try {
                this.cinema = this.cinemaService.getCinemaById( cinema );
                if ( !this.cinema ) {
                    this.cinema = await this.cinemaService.fetchCinemaById( cinema );
                }

                this.seo.setTitle( `${this.movie.name} | ${this.cinema.name}` );
            } catch ( e ) {
                console.log( e );
            }
        }
    }

}
