import { Component, OnDestroy, OnInit } from '@angular/core';
import { SeoService } from '@services/seo.service';
import { CandyService } from '@services/candy.service';
import { StorageUtils } from '@utils/storage.utils';

@Component( {
    selector: 'app-chocolateria',
    templateUrl: './chocolateria.component.html',
    styleUrls: ['./chocolateria.component.scss']
} )
export class ChocolateriaComponent extends StorageUtils implements OnInit, OnDestroy {

    constructor( private seo: SeoService,
                 private candyService: CandyService ) {
        super();
        seo.setTitle( 'Chocolatería' );
    }

    ngOnInit() {
    }

    ngOnDestroy() {
        this.candyService.reset();
    }

}
