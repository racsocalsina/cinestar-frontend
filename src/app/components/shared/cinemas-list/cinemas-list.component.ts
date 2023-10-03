import { Component, Input, OnInit } from '@angular/core';
import { Cinema } from '@models/cinema.model';
import { ModalCinemaDetailsComponent } from '@modals/modal-cinema-details/modal-cinema-details.component';
import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { UserService } from '@services/user.service';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { AuthModalsService } from '@services/auth-modals.service';
import { CinemaService } from '@services/cinema.service';
import { GeneralService } from '@services/general.service';
import { finalize } from 'rxjs/internal/operators/finalize';

@Component({
    selector: 'app-cinemas-list',
    templateUrl: './cinemas-list.component.html',
    styleUrls: [ './cinemas-list.component.scss' ]
})
export class CinemasListComponent implements OnInit {

    @Input() cinemas: Cinema[] = [];
    @Input() selectedCinema!: Cinema | undefined;
    @Input() cinemaId!: number | undefined;
    @Input() responsive = true;
    @Input() queryParams = {};
    subs: Subscription[] = [];
    isLoggedIn = false;

    constructor(private router: Router,
                private modalService: BsModalService,
                private authModalsService: AuthModalsService,
                private cinemaService: CinemaService,
                private generalService: GeneralService,
                private userService: UserService) {
    }

    ngOnInit(): void {
        this.subs.push(this.userService.isLoggedIn.subscribe(res => this.isLoggedIn = res));
    }

    cinemaTrackBy(index: number, cinema: Cinema) {
        return cinema.id;
    }

    cinemaDetails(cinema: Cinema): void {
        this.selectedCinema = cinema;
        
        //if ( this.responsive ) {
          //  this.showModalCinemaDetails(cinema);
        //} else {
            this.cinemaService._cinemaSelected = cinema;
            this.getBillboardDates(cinema);
        //}
    }

    showModalCinemaDetails(cinema: Cinema): void {
        this.selectedCinema = cinema;
        this.modalService.show(ModalCinemaDetailsComponent, {
            initialState: { cinema },
            class: 'modal-cinema-details'
        });
    }

    toggleFavorite(cinema: Cinema) {
        if ( this.isLoggedIn ) {
            this.updateFavorite(cinema).finally();
        } else {
            this.authModalsService.showLoginModal();
            this.authModalsService.onLogin.asObservable().pipe(take(1)).subscribe(() => {
                this.updateFavorite(cinema).finally();
            });
        }
    }

    async updateFavorite(cinema: Cinema) {
        cinema.is_favorite = !cinema.is_favorite;
        await this.cinemaService.toggleFavorite(cinema.id);
        this.cinemaService.fetchCinemas(false);
    }

    getBillboardDates(cinema: any){
        const params = {
            headquarter_id: cinema.id,
        };
        this.generalService.getBillboardDatesForCinema(params)
        .pipe(finalize(() => {}))
        .subscribe(dates => {
            this.cinemaService._billboardDates = dates;
            this.router.navigate([`/cines/${cinema.id}/peliculas`], { queryParams: this.queryParams });
        });
    }
}
