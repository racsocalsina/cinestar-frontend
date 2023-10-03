import { Component, Input, OnInit } from '@angular/core';
import { BannersInterface } from '@interfaces/banners.interface';

@Component( {
    selector: 'app-carousel-banner',
    templateUrl: './carousel-banner.component.html',
    styleUrls: ['./../banners/banners.component.scss', './carousel-banner.component.scss']
} )
export class CarouselBannerComponent implements OnInit {
    @Input() banners: BannersInterface[] = [];

    constructor() { }

    ngOnInit(): void {
        console.log(this.banners);
    }

}
