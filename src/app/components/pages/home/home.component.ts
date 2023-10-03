import { Component, OnInit } from '@angular/core';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';

import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { SeoService } from '@services/seo.service';
import {Pages} from "@utils/enums";
import {BsModalService} from "ngx-bootstrap/modal";
import {ModalHomeComponent} from "@modals/modal-home/modal-home.component";
import {ContentService} from "@services/content.service";

@Component( {
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
} )
export class HomeComponent implements OnInit {
    Pages = Pages;

    constructor( private localeService: BsLocaleService, seo: SeoService,
                 private modalService: BsModalService,
                 private contentService: ContentService) {
        seo.setTitle();
    }

    ngOnInit(): void {
        defineLocale( 'es', esLocale );
        this.localeService.use( 'es' );
        this.contentService.getcontent('popup-banner').then((res: any) => {
          if (res.data.image){
              this.modalService.show(ModalHomeComponent, {
                  class: 'modal-home',
                  initialState: {
                      image: res.data.image,
                      popup_title: res.data.popup_title,
                      movie_id: res.data.movie_id,
                      button_name: res.data.button_name,
                      movie_title: res.data.movie_title
                  }
              });
          }

        });

    }

}
