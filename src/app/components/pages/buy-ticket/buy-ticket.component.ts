import { AfterViewChecked, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { BuyTicketService } from '@services/buy-ticket.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ScreenService } from '@services/screen.service';
import { Movie } from '@models/movie.model';
import { MovieTime, ShowTime } from '@models/show-time.model';
import { GeneralService } from '@services/general.service';
import { MoviesService } from '@services/movies.service';
import { StorageUtils } from '@utils/storage.utils';
import { Seat } from '@interfaces/seat.interface';
import { SeoService } from '@services/seo.service';
import { CandyService } from '@services/candy.service';

@Component( {
    selector: 'app-buy-ticket',
    templateUrl: './buy-ticket.component.html',
    styleUrls: ['./buy-ticket.component.scss']
} )
export class BuyTicketComponent extends StorageUtils implements OnInit, OnDestroy, AfterViewChecked {

    step = 1;
    movie!: Movie;
    showTime?: ShowTime;
    movieTime?: MovieTime;
    // format?: FormatInterface;
    totalPayment = 0;
    subs: Subscription[] = [];
    seats: Seat[] = [];

    constructor( public buyService: BuyTicketService,
                 private changeDetector: ChangeDetectorRef,
                 public screenService: ScreenService,
                 private route: ActivatedRoute,
                 private router: Router,
                 private buyTicketService: BuyTicketService,
                 private generalService: GeneralService,
                 private seo: SeoService,
                 private candyService: CandyService,
                 private movieService: MoviesService ) {
        super();
    }

    ngAfterViewChecked() { this.changeDetector.detectChanges(); }

    ngOnInit(): void {
        if ( !this.buyService.selectedOption ) {
            const { movie, cinema } = this.route.snapshot.params;
            const url = `/peliculas/${movie}/${cinema}`;
            this.router.navigateByUrl( url ).finally();
        } else {
            this.getValues();
        }

        this.buyService.initCountdown();

        this.subs.push( this.router.events.subscribe( ( evt => {
            if ( evt instanceof NavigationEnd ) {
                this.step = Number( this.router.url.split( '/' ).pop() );
            }
        } ) ) );


        this.subs.push( this.buyTicketService.getSeats().subscribe( seats => this.seats = seats ) );
    }

    ngOnDestroy(): void {
        this.subs.forEach( s => s.unsubscribe() );
        this.buyService.reset();
    }

    setTitle() {
        if ( this.movie ) {
            this.seo.setTitle( `${this.movie.name} | ${this.showTime?.name}` );
        } else {
            try {
                const { movie, cinema } = this.route.snapshot.params;
                const url = `/peliculas/${movie}/${cinema}`;
                this.router.navigateByUrl( url ).finally();
            } catch ( e ) {
                this.router.navigateByUrl( '/peliculas' ).finally();
            }
        }
    }

    getValues() {
        if ( this.buyTicketService.selectedOption ) {
            const { movie, movie_time, cinema } = this.buyTicketService.selectedOption;

            this.movie = new Movie( movie );
            this.showTime = this.movieService.getShowTimeById( cinema );
            // this.format = this.generalService.getFormatById( format );
            if ( this.showTime ) {
                this.movieTime = this.showTime.movie_times.find( x => x.id === movie_time );
                this.buyTicketService.movieTime = this.movieTime;
            }

            this.setTitle();
        }

        this.subs.push( this.buyTicketService.getPayment().subscribe( total => this.totalPayment = total ) );
    }

}
