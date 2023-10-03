import { Component, OnInit } from '@angular/core';
import { Cinema } from '@models/cinema.model';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component( {
    selector: 'app-index-cinemas',
    templateUrl: './index-cinemas.component.html',
    styleUrls: ['./index-cinemas.component.scss']
} )
export class IndexCinemasComponent implements OnInit {

    selectedCinema?: Cinema;
    searchTerm!: string;
    cinemas!: Cinema[] | null;
    bsConfig: Partial<BsDatepickerConfig> = {
        containerClass: 'theme-red custom-auth-calendar', adaptivePosition: true, isAnimated: true
    };

    constructor() { }

    ngOnInit(): void {
    }


}
