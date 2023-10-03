import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Utils } from '@utils/utils';
import { GenreInterface } from '@interfaces/format.interface';
import { BillboardDatesInterface } from '@interfaces/billboard-dates.interface';
import { Cinema } from '@models/cinema.model';
import { CityInterface } from '@interfaces/city.interface';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GeneralService } from '@services/general.service';
import { CinemaService } from '@services/cinema.service';

@Component( {
    selector: 'app-header-movies',
    templateUrl: './header-movies.component.html',
    styleUrls: ['../header-home/header-home.component.scss', './header-movies.component.scss']
} )
export class HeaderMoviesComponent implements OnInit, OnDestroy {

    onSearch = false;
    @Output() onSearchEvt = new EventEmitter<any>();
    @Output() onFilterEvt = new EventEmitter<any>();
    @Input() title = 'Películas';
    @Input() placeholder = 'Buscar película...';
    @Input() showFilters = true;
    @Input() fromCinemas = false;

    toBegin = Utils.toBeginFilter();
    genres: GenreInterface[] = [];
    billboardDates: BillboardDatesInterface[] = [];
    cinemas: Cinema[] = [];
    cities: CityInterface[] = [];
    subs: Subscription[] = [];
    form!: FormGroup;
    searchTerm!: string;

    constructor( private fb: FormBuilder,
                 private generalService: GeneralService,
                 private cinamaService: CinemaService ) { }

    ngOnInit(): void {
        this.initForm();

        this.subs.push( this.generalService.getGenres().subscribe( genres => this.genres = genres ) );
        this.subs.push( this.generalService.getBillboardDates().subscribe( dates => this.billboardDates = dates ) );
        this.subs.push( this.generalService.getCities().subscribe( cities => this.cities = cities ) );
        this.subs.push( this.cinamaService.getCinemas().subscribe( cinemas => this.cinemas = cinemas ) );
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

    }

    toggleFilter( value: string ): void {
        const filter = document.getElementById( 'responsive-movies-filter' );
        if ( filter ) {
            filter.style.right = value;
        }
    }

    filter() {
        this.onSearchEvt.emit( Utils.removeEmpty( this.form.value ) );
        this.toggleFilter( '-100%' );
    }

    searchMovie() {
        this.onSearchEvt.emit( this.searchTerm );
    }

    closeSearch() {
        this.onSearch = false;
        this.searchTerm = '';
        this.searchMovie();
    }
}
