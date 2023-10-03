import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Cinema } from '@models/cinema.model';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Utils } from '@utils/utils';
import { Router } from '@angular/router';

@Component( {
    selector: 'app-modal-cinema-details',
    templateUrl: './modal-cinema-details.component.html',
    styleUrls: ['./modal-cinema-details.component.scss']
} )
export class ModalCinemaDetailsComponent implements OnInit {

    @Input() cinema!: Cinema;
    Utils = Utils;
    isLoggedIn = false;

    constructor( public bsModalRef: BsModalRef,
                 private router: Router ) { }

    ngOnInit(): void {
        console.log( this.cinema );
    }


    showMovies(): void {
        this.router.navigateByUrl( `/cines/${this.cinema.id}/peliculas` ).finally();
        this.bsModalRef.hide();
    }

}
