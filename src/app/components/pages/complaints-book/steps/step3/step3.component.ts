import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Utils } from '@utils/utils';
import { ClaimService } from '@services/claim.service';

@Component( {
    selector: 'app-step3',
    templateUrl: './step3.component.html',
    styleUrls: ['../../complaints-book.component.scss', './step3.component.scss']
} )
export class Step3Component implements OnInit {

    @Output() step = new EventEmitter<number>();
    @Input() claimId!: number;

    error?: string;
    downloading = false;

    constructor( private claimService: ClaimService ) { }

    ngOnInit(): void {
        window.scroll( 0, 0 );
    }

    download() {
        this.error = undefined;
        if ( !this.downloading ) {
            this.downloading = true;

            this.claimService.downloadClaim( this.claimId ).then( res => {
                Utils.saveFile( res, 'test.pdf', 'application/pdf' );
            } ).catch( error => this.error = error )
            .finally( () => this.downloading = false );
        }

    }
}
