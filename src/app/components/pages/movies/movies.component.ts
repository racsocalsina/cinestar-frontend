import { Component, OnDestroy, OnInit } from '@angular/core';
import { MoviesService } from '@services/movies.service';
import { Movie } from '@models/movie.model';
import { Utils } from '@utils/utils';
import { GenreInterface } from '@interfaces/format.interface';
import { Subscription } from 'rxjs';
import { GeneralService } from '@services/general.service';
import { BillboardDatesInterface } from '@interfaces/billboard-dates.interface';
import { Cinema } from '@models/cinema.model';
import { CinemaService } from '@services/cinema.service';
import { CityInterface } from '@interfaces/city.interface';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SeoService } from '@services/seo.service';

@Component( {
    selector: 'app-movies',
    templateUrl: './movies.component.html',
    styleUrls: ['./movies.component.scss']
} )
export class MoviesComponent implements OnInit, OnDestroy {

    movies: Movie[] = [];
    allMovies: Movie[] = [];
    toBegin = Utils.toBeginFilter();
    genres: GenreInterface[] = [];
    billboardDates: BillboardDatesInterface[] = [];
    nextReleasesDates: BillboardDatesInterface[] = [];
    cinemas: Cinema[] = [];
    cities: CityInterface[] = [];
    isLoading = false;
    subs: Subscription[] = [];
    form!: FormGroup;
    searchTerm!: string;
    type = 'cartelera';

    constructor( private fb: FormBuilder,
                 private route: ActivatedRoute,
                 private router: Router,
                 private moviesService: MoviesService,
                 private generalService: GeneralService,
                 private seo: SeoService,
                 private cinamaService: CinemaService ) {
        seo.setTitle( 'Películas' );
    }

    ngOnInit(): void {
        this.initForm();
        this.type = this.route.snapshot.queryParamMap.get( 'tipo' ) ? 'proximos_estrenos' : 'cartelera';

        this.subs.push( this.generalService.getGenres().subscribe( genres => this.genres = genres ) );
        this.subs.push( this.generalService.getBillboardDates().subscribe( dates => this.billboardDates = dates ) );
        this.subs.push( this.generalService.getNextReleasesDates().subscribe( dates => this.nextReleasesDates = dates ) );
        this.subs.push( this.generalService.getCities().subscribe( cities => this.cities = cities ) );
        this.subs.push( this.cinamaService.getCinemas().subscribe( cinemas => this.cinemas = cinemas ) );

        // this.getAllMovies();
        this.filter();
    }

    ngOnDestroy() {
        this.subs.forEach( s => s.unsubscribe() );
    }

    initForm() {
        this.form = this.fb.group( {
            to_begin: null,
            city_id: null,
            headquarter_id: null,
            movie_gender_id: null,
            date: null,
        } );

        this.form.disable();
    }

    /*  getMovies() {
     if ( this.type === 'next_releases' ) {
     this.getNextReleases();
     } else {
     this.filter();
     }
     }*/

    getNextReleases() {
        this.isLoading = true;
        this.moviesService.fetchNextReleases()
        .then( movies => {
            console.log( movies );
            this.movies = movies;
            this.allMovies = movies;
            this.isLoading = false;
        } ).catch( console.log )
        .finally( () => {
            this.isLoading = false;
        } );
    }

    filter() {
        const params: any = Utils.removeEmpty( this.form.value );
        if ( params.date ) {
            this.router.navigate( ['/peliculas'], { queryParams: { date: params.date } } );
        }
        this.getMovies( params );
    }

    getMovies( params: any ) {
        params = { ...params, is_next_releases: this.type !== 'cartelera' };

        this.form.disable();
        this.isLoading = true;

        this.moviesService.getMovies( params )
        .then( movies => {
            console.log( movies );
            this.movies = movies;
            this.allMovies = movies;
            this.searchMovie( this.searchTerm );
        } ).catch( console.log )
        .finally( () => {
            this.form.enable();
            this.isLoading = false;
        } );
    }


    searchMovie( searchTerm: string ) {
        if ( searchTerm ) {
            this.movies = this.allMovies.filter( m => m.name.toLowerCase().includes( searchTerm.toLowerCase() ) );
        } else {
            this.movies = this.allMovies;
        }
    }

    changeTypeMovies( type: string ) {
        if ( !this.isLoading && type !== this.type ) {
            this.type = type;
            this.filter();
        }
    }
}
