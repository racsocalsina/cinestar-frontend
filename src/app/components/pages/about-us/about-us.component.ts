import { Component, OnInit } from '@angular/core';
import { SeoService } from '@services/seo.service';
import {Partner} from "@models/partner.model";
import {ContentService} from "@services/content.service";

@Component( {
    selector: 'app-about-us',
    templateUrl: './about-us.component.html',
    styleUrls: ['./about-us.component.scss']
} )
export class AboutUsComponent implements OnInit {
    content: Partner | any;
    constructor( private seo: SeoService,
                 private contentService: ContentService) {
        seo.setTitle( 'Quienes Somos' );
    }

    ngOnInit(): void {
        window.scroll( 0, 0 );
        this.contentService.getcontent('about-us').then((res: any) => {
            this.content = res.data;
        });
    }

}
