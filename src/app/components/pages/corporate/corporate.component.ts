import { Component, OnInit } from '@angular/core';
import { SeoService } from '@services/seo.service';
import { ActivatedRoute } from '@angular/router';
import {BannerInterface} from "@interfaces/banner.interface";
import {Subscription} from "rxjs";
import {BannersService} from "@services/banners.service";
import {Pages} from "@utils/enums";
import {Partner} from "@models/partner.model";
import {ContentService} from "@services/content.service";

@Component( {
    selector: 'app-corporate',
    templateUrl: './corporate.component.html',
    styleUrls: ['./corporate.component.scss']
} )
export class CorporateComponent implements OnInit {
    banners: BannerInterface[] = [];
    subs: Subscription[] = [];
    content: Partner | any;
    constructor( private seo: SeoService,
                 private route: ActivatedRoute,
                 private bannersService: BannersService,
                 private contentService: ContentService) {
        seo.setTitle( 'Corporativo' );
    }

    ngOnInit(): void {
        window.scroll( 0, 0 );

        if ( this.route.snapshot.fragment ) {
            this.scroll( this.route.snapshot.fragment );
        }
        this.contentService.getcontent('corporate').then((res: any) => {
            this.content = res.data;
        });
        const type = this.type();
        this.getBanners(type)
    }
    getBanners(type: string) {
        this.subs.push(this.bannersService.getBanners(type).subscribe(banners => {

            this.banners = banners.filter(x => x.page == Pages.CORPORATIVO);
            console.log("BANNERS",  this.banners);
        }));
    }
    scroll( el: string ) {
        setTimeout( () => {
            const element = document.getElementById( el );
            if ( element ) {
                console.log( 'scrollIntoView' );
                element.scrollIntoView( { behavior: 'smooth', inline: 'center', block: 'center' } );
            }
        }, 800 );

    }
    type(){
        return window.innerWidth <= 768 ? 'banners_responsive' : 'banners_desktop';
    }
}
