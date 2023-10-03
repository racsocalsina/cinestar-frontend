import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { MoviesService } from '@services/movies.service';
import { Movie } from '@models/movie.model';
import { GeneralService } from '@services/general.service';
import { BillboardDatesInterface } from '@interfaces/billboard-dates.interface';
import {MovieFormat, MovieTime, ShowTime} from '@models/show-time.model';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Cinema } from '@models/cinema.model';
import { CinemaService } from '@services/cinema.service';
import { ModalCinemaDetailsComponent } from '@modals/modal-cinema-details/modal-cinema-details.component';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {BuyTicketService} from '@services/buy-ticket.service';
import {Utils} from '@utils/utils';
import {Router} from '@angular/router';
import { tap } from 'rxjs/internal/operators/tap';
import { finalize } from 'rxjs/internal/operators/finalize';
import { BillboardDatesInterfaceForCinema } from '@interfaces/billboard-dates.interfaceForCinema';
import { take } from 'rxjs/operators';

@Component( {
    selector: 'app-cinema-movies',
    templateUrl: './cinema-movies.component.html',
    styleUrls: ['./cinema-movies.component.scss']
} )
export class CinemaMoviesComponent implements OnInit, OnDestroy {
    bsModalRef: BsModalRef | undefined;
    allCinemas: Cinema[] = [];
    filteredsCinemas: Cinema[] = [];
    selectedCinema?: Cinema;
    movies: Movie[] = [];
    allMovies: Movie[] = [];
    cinemaId?: number;
    subs: Subscription[] = [];
    billboardDates: BillboardDatesInterfaceForCinema[] = [];//fechas disponibles
    isLoading = false;
    selectedOption: any = {};
    selectedFecha: string | undefined;
    movie: Movie | undefined;
    bsConfig: Partial<BsDatepickerConfig> = {
        containerClass: 'theme-red custom-auth-calendar',
        adaptivePosition: true,
        isAnimated: true,
    };
    showTime?: ShowTime;
    searchTerm!: string;
    filterDate?: Date;
    today: string = (new Date()).getFullYear() + "-" + ('0' + ((new Date()).getMonth() + 1)).slice(-2) + "-" + ('0' + (new Date()).getDate()).slice(-2);
    isDateHighlighted: boolean | undefined;

    constructor( private route: ActivatedRoute,
                 private modalService: BsModalService,
                 private localeService: BsLocaleService,
                 private generalService: GeneralService,
                 private moviesService: MoviesService,
                 private buyTicketService: BuyTicketService,
                 private router: Router,
                 private cinemaService: CinemaService ) {}

    ngOnInit(): void {
        this.subs.push( this.route.params.subscribe( params => {
            console.log( params );
            this.cinemaId = Number( params.cinema );
            this.searchTerm = '';
        } ) );

        this.getMovies({ start_at: this.today});
        this.subs.push(
            this.cinemaService.getCinemas().pipe(
              take(1)
            ).subscribe(cinemas => {
              this.allCinemas = cinemas;
              this.filteredsCinemas = cinemas;
              this.selectedCinema = cinemas.find(x => x.id === this.cinemaId);
              //this.filter();
            })
          );

        const params = {
            headquarter_id: this.selectedCinema?.id,
        };
        this.subs.push(
            this.generalService.getBillboardDatesForCinema(params)
            .pipe(finalize(() => {}))
            .subscribe(dates => {
                this.billboardDates = dates;
            })
        );
    }

    ngOnDestroy(): void {
        this.subs.forEach( s => s.unsubscribe() );
    }


   /* doSomethingAfterBillboardDatesAssigned(): void {
        this.billboardDates = this.cinemaService._billboardDates;
        if (this.billboardDates && this.billboardDates.length > 0) {
          const firstElement = this.billboardDates[0];
          const firstElementDate = firstElement.date;
          this.selectedFecha = firstElementDate;
          this.getMovies({ start_at: firstElementDate});
        }
    }
    */

    getMovies( params: any = {} ): void {
        this.isLoading = true;

        params = {
            ...params,
            is_next_releases: false,
            headquarter_id: this.cinemaId
        };

        this.moviesService.getMovies( params, 2 ).then( movies => {
            this.movies = movies;
            this.allMovies = movies;
            this.searchMovie( this.searchTerm );
        } ).catch()
        .finally( () => this.isLoading = false );
    }

    searchMovie( searchTerm: string ) {
        this.searchTerm = searchTerm;
        if ( searchTerm ) {
            this.movies = this.allMovies.filter( m => m.name.toLowerCase().includes( searchTerm.toLowerCase() ) );
        } else {
            this.movies = this.allMovies;
        }
    }

    changeDate( date: any ) {
        console.log( date );
        /*if ( !this.isLoading ) {
         if ( date && new Date( date ).toString() !== 'Invalid date' ) {
         this.getMovies( { date: Utils.getStringDate( { date, format: 'YYYY-MM-DD' } ) } );
         } else {
         this.getMovies();
         }
         }*/

        if ( date ) {
            this.getMovies( { date: date.date } );
        } else {
            this.getMovies();
        }

    }

    clearFilterDate() {
        if ( !this.isLoading ) {
            this.filterDate = undefined;
        }
    }

    selectTime(movieTime: MovieTime, cinema: number) {
          this.movie = this.movies.find(movie => movie.id == movieTime.movie_id);
          console.log("Hola Movies")
          console.log(this.movie);
          this.selectedOption = {
            cinema: cinema,
            movie_time: movieTime.id
          };
          if (this.selectedCinema) {
            this.buyTicketService._name = this.selectedCinema.name;
            this.buyTicketService._address = this.selectedCinema.address!;
          }

          this.redirect();
    }

    showModalCinemaDetails(cinema: Cinema): void {
        this.modalService.show(ModalCinemaDetailsComponent, {
            initialState: { cinema },
            class: 'modal-cinema-details'
        });
    }

    selectedDate(date: string){
        this.selectedFecha = date;
        this.getMovies({ start_at: date });
    }

    redirect() {
        this.isLoading = true;

        this.buyTicketService.checkPoints({movie_time_id: this.selectedOption.movie_time})
            .then(res => {
                this.buyTicketService.pointsChecked = res;

                const url = `/peliculas/${this.movie?.id}/${this.selectedOption.cinema}/comprar`;
                this.buyTicketService.wait_time = this.buyTicketService.pointsChecked.max_minutes_to_buy > 0 ?
                    this.buyTicketService.pointsChecked.max_minutes_to_buy * 60 : 300;
                this.buyTicketService.selectedOption = {
                    ...this.selectedOption,
                    movie: this.movie,
                };
                this.router.navigateByUrl(url).finally();
            }).catch(error => {
            Utils.showToast(error);
        }).finally(() => this.isLoading = false);
    }

    highlightDate(isHighlighted: boolean) {
        this.isDateHighlighted = isHighlighted;
      }
}
