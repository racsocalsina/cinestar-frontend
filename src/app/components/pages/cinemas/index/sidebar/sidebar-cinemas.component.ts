import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { CinemaService } from '@services/cinema.service';
import { Cinema } from '@models/cinema.model';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FormatInterface } from '@interfaces/format.interface';
import { GeneralService } from '@services/general.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CityInterface } from '@interfaces/city.interface';
import { UserService } from '@services/user.service';

@Component({
    selector: 'app-sidebar-cinemas',
    templateUrl: './sidebar-cinemas.component.html',
    styleUrls: [ './sidebar-cinemas.component.scss' ]
})
export class SidebarCinemasComponent implements OnInit, OnDestroy, OnChanges {

    @Output() selectCinema = new EventEmitter<Cinema>();
    @Output() filteredsCinemasEvt = new EventEmitter<Cinema[] | null>();
    @Input() responsive = true;
    @Input() cinemaId?: number;
    @Input() searchTerm!: string;

    allCinemas: Cinema[] = [];
    filteredsCinemas: Cinema[] = [];
    selectedCinema?: Cinema;
    formats: FormatInterface[] = [];
    cities: CityInterface[] = [];
    subs: Subscription[] = [];
    isLoading = true;
    filterForm!: FormGroup;
    queryParams = {};
    isLoggedIn = false;

    constructor(private fb: FormBuilder,
                private route: ActivatedRoute,
                private router: Router,
                private generalService: GeneralService,
                private userService: UserService,
                private cinemaService: CinemaService) {
    }

    ngOnInit(): void {
        this.subs.push(this.generalService.getFormats().subscribe(formats => this.formats = formats));
        this.subs.push(this.generalService.getCities().subscribe(cities => this.cities = cities));

        this.initFilterForm();

        this.subs.push(this.cinemaService.getCinemas().subscribe(cinemas => {
            this.allCinemas = cinemas;
            this.filteredsCinemas = cinemas;
            this.selectedCinema = cinemas.find(x => x.id === this.cinemaId);
            this.filter();
        }));
    }

    ngOnDestroy(): void {
        this.subs.forEach(s => s.unsubscribe());
    }

    ngOnChanges(changes: SimpleChanges) {
        if ( changes.searchTerm && this.filterForm ) {
            this.filter();
        }
    }

    initFilterForm() {
        const format = this.route.snapshot.queryParamMap.get('format') ? Number(this.route.snapshot.queryParamMap.get('format')) : null;
        const city = this.route.snapshot.queryParamMap.get('city') ? Number(this.route.snapshot.queryParamMap.get('city')) : null;

        this.filterForm = this.fb.group({
            format,
            city
        });

        this.filter();
    }

    filter() {
        const { format, city } = this.filterForm.value;
        this.queryParams = {};

        this.filteredsCinemas = this.allCinemas;

        if ( format || city || this.searchTerm ) {

            if ( format ) {
                this.filteredsCinemas = [];
                this.queryParams = { ...this.queryParams, format };
                this.allCinemas.forEach(x => {
                    x.movie_formats.forEach(f => {
                        if ( f.id === format ) {
                            this.filteredsCinemas.push(x);
                        }
                    });
                });
            }

            if ( city ) {
                this.queryParams = { ...this.queryParams, city };
                this.filteredsCinemas = this.filteredsCinemas.filter(x => x.city_id === city);
            }

            if ( this.searchTerm ) {
                this.filteredsCinemas = this.filteredsCinemas.filter(x => x.name.toLowerCase().includes(this.searchTerm.toLowerCase()));
            }

        }

        if ( this.filteredsCinemas.length ) {
            this.filteredsCinemasEvt.emit(null);
        } else {
            this.filteredsCinemasEvt.emit(this.filteredsCinemas);
        }

        if ( this.selectedCinema && !this.filteredsCinemas.find(x => x.id === this.selectedCinema?.id) ) {
            this.selectedCinema = undefined;

            this.router.navigate([ '/cines' ], { queryParams: this.queryParams }).finally();
        }

    }
}
