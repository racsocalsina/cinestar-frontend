import { Component, OnInit } from '@angular/core';
import { SeoService } from '@services/seo.service';
import {Pages} from "@utils/enums";
import {BannerInterface} from "@interfaces/banner.interface";
import {BannersService} from "@services/banners.service";
import {Subscription} from "rxjs";
import {ContentService} from "@services/content.service";
import {Partner} from "@models/partner.model";

@Component( {
    selector: 'app-partner-star',
    templateUrl: './partner-star.component.html',
    styleUrls: ['./partner-star.component.scss']
} )
export class PartnerStarComponent implements OnInit {
    banners: BannerInterface[] = [];
    subs: Subscription[] = [];
    content: Partner | any;
    constructor( private seo: SeoService ,
                 private bannersService: BannersService,
                private contentService: ContentService) {
        seo.setTitle( 'Socio' );
    }

    ngOnInit(): void {
        window.scroll( 0, 0 );
        const type = this.type();
        this.contentService.getcontent('partner').then((res: any) => {
           this.content = res.data;
        });
        this.getBanners(type)
    }

    getBanners(type: string) {
        this.subs.push(this.bannersService.getBanners(type).subscribe(banners => {

            this.banners = banners.filter(x => x.page == Pages.SOCIO);
            console.log("BANNERS",  this.banners);
            // console.log(this.banners);
        }));
    }

    type(){
        return window.innerWidth <= 768 ? 'banners_responsive' : 'banners_desktop';
    }
}
