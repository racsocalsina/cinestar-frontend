import { Component, OnInit } from '@angular/core';
import { SeoService } from '@services/seo.service';

@Component( {
    selector: 'app-cinemas',
    templateUrl: './cinemas.component.html',
    styleUrls: ['./cinemas.component.scss']
} )
export class CinemasComponent implements OnInit {

    constructor( private seo: SeoService ) {
        seo.setTitle( 'Cines' );
    }

    ngOnInit(): void {
    }

}
