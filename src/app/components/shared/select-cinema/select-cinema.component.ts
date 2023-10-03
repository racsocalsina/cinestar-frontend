import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {BsDatepickerConfig, BsLocaleService} from 'ngx-bootstrap/datepicker';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {CityInterface} from '@interfaces/city.interface';
import {GeneralService} from '@services/general.service';
import {BillboardDatesInterface} from '@interfaces/billboard-dates.interface';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Utils} from '@utils/utils';
import {Movie} from '@models/movie.model';
import {MoviesService} from '@services/movies.service';
import {MovieFormat, MovieTime, ShowTime} from '@models/show-time.model';
import {UserService} from '@services/user.service';
import {AuthModalsService} from '@services/auth-modals.service';
import {take} from 'rxjs/operators';
import {BuyTicketService} from '@services/buy-ticket.service';

@Component({
    selector: 'app-select-cinema',
    templateUrl: './select-cinema.component.html',
    styleUrls: ['../../pages/movie-details/movie-details.component.scss', './select-cinema.component.scss']
})
export class SelectCinemaComponent implements OnInit, OnDestroy {

    @Input() movie!: Movie;
    bsConfig: Partial<BsDatepickerConfig> = {
        containerClass: 'theme-red custom-auth-calendar', adaptivePosition: true, isAnimated: true
    };
    onSearch = false;
    subs: Subscription[] = [];
    cities: CityInterface[] = [];
    billboardDates: BillboardDatesInterface[] = [];
    form!: FormGroup;
    cinemaId?: number;
    showTimes: ShowTime[] = [];
    allShowTimes: ShowTime[] = [];
    loadingShows = true;
    selectedOption: any = {};
    isLoggedIn = false;
    isLoading!: boolean;

    constructor(private localeService: BsLocaleService,
                private route: ActivatedRoute,
                private fb: FormBuilder,
                private router: Router,
                private generalService: GeneralService,
                private buyTicketService: BuyTicketService,
                private userService: UserService,
                private authModalsService: AuthModalsService,
                private movieService: MoviesService) {
        this.localeService.use('es');
    }

    ngOnInit(): void {

        this.subs.push(this.route.params.subscribe(params => {
            const {cinema} = params;
            if (cinema) {
                this.cinemaId = Number(cinema);
            }
        }));

        this.initForm();

        this.filterShows();

        if (this.movie.is_release) {
            this.subs.push(this.generalService.getNextReleasesDates({movie_id: this.movie.id}).subscribe(dates => {
                console.log(dates);
                this.billboardDates = dates;
                if (dates.length) {
                    this.form.get('date')?.setValue(dates[0].date);
                    this.filterShows();
                }
            }));
        } else {
            this.subs.push(this.generalService.getBillboardDates().subscribe(dates => {
                console.log(dates);
                this.billboardDates = dates;
            }));
        }

        this.subs.push(this.generalService.getCities().subscribe(cities => this.cities = cities));
        this.subs.push(this.userService.isLoggedIn.subscribe(res => this.isLoggedIn = res));

    }

    ngOnDestroy(): void {
        this.subs.forEach(s => s.unsubscribe());
    }

    getShows(params: any) {
        this.loadingShows = true;
        console.log(params);
        this.movieService.fetchShowTimes(params).then(res => {
            console.log(res);
            this.allShowTimes = res;
            const {cinema} = this.form.value;
            if (cinema) {
                this.showTimes = this.allShowTimes.filter(x => x.id === cinema);
            } else {
                this.showTimes = res;
            }

            if (!this.showTimes.length) {
                this.selectedOption = {};
            }
        }).catch(console.log).finally(() => this.loadingShows = false);
    }

    initForm() {
        const date = this.route.snapshot.queryParamMap.get('date');

        this.form = this.fb.group({
            date: date ? date : this.movie.is_release ? null : Utils.getStringDate({format: 'YYYY-MM-DD'}),
            movie_id: this.movie.id,
            city_id: null,
            cinema: this.cinemaId,
        });
    }

    filterShows() {
        const params = Utils.removeEmpty(this.form.value);

        this.getShows(params);
    }

    buy(): void {
        this.redirect();
        // if ( this.isLoggedIn ) {
        //     this.redirect();
        // } else {
        //     this.redirect();
        // this.authModalsService.showLoginModal();
        // this.authModalsService.onLogin.asObservable().pipe( take( 1 ) ).subscribe( () => {
        //     this.redirect();
        // } );
        // }
    }

    redirect() {

        console.log("Selected_option");
        console.log(this.selectedOption);


        this.isLoading = true;
        this.buyTicketService.checkPoints({movie_time_id: this.selectedOption.movie_time})
            .then(res => {
                this.buyTicketService.pointsChecked = res;

                const url = `/peliculas/${this.movie.id}/${this.selectedOption.cinema}/comprar`;
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

    searchShow(seachTerm: string) {
        if (seachTerm) {
            this.showTimes = this.allShowTimes.filter(x => x.name.toLowerCase().includes(seachTerm.toLowerCase()));
        } else {
            this.showTimes = this.allShowTimes;
        }
    }

    selectFormat(format: MovieFormat, cinema: ShowTime) {
        if (this.selectedOption.cinema !== cinema.id) {
            this.selectedOption = {};
        }

        /*if ( this.selectedOption.format !== format.id ) {
         delete this.selectedOption.movie_time;
         }*/

        cinema.movie_times = format.movie_times;

        this.selectedOption.cinema = cinema.id;
        // this.selectedOption.format = format.id;

    }

    selectTime(movieTime: MovieTime, cinema: number) {
        if (!this.isLoading) {
            if (this.selectedOption.cinema !== cinema) {
                this.selectedOption = {};
            }

            this.selectedOption.cinema = cinema;
            // this.selectedOption.format = movieTime.movie_format_id;
            this.selectedOption.movie_time = movieTime.id;
        }
    }

    selectCinema(showTime: ShowTime) {
        if (showTime) {
            this.showTimes = [showTime];
            if (this.selectedOption.cinema !== showTime.id) {
                this.selectedOption = {};
            }
        } else {
            this.showTimes = this.allShowTimes;
        }
    }
}
