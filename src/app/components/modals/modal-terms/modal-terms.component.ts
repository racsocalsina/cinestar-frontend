import { Component, EventEmitter, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {ContentService} from "@services/content.service";

@Component( {
    selector: 'app-modal-terms',
    templateUrl: './modal-terms.component.html',
    styleUrls: ['./modal-terms.component.scss']
} )
export class ModalTermsComponent implements OnInit {

    onAccept = new EventEmitter();
    onClose = new EventEmitter();
    info: any;
    constructor( public bsModalRef: BsModalRef,
                 private contentService: ContentService) { }

    ngOnInit(): void {
        this.contentService.getcontent('terms').then((res:any) => {
           this.info = res.data.terms;
        });
    }

    accept() {
        this.onAccept.emit( true );
        this.onClose.emit(true);
        this.bsModalRef.hide();
    }
    close(){
        this.onClose.emit(true);
        this.bsModalRef.hide();
    }
}
