import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import { BannerInterface } from '@interfaces/banner.interface';
import { BannersService } from '@services/banners.service';
import { Subscription } from 'rxjs';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
    selector: 'app-banners',
    templateUrl: './banners.component.html',
    styleUrls: [ './banners.component.scss' ]
})
export class BannersComponent implements OnInit, OnDestroy {

    banners: BannerInterface[] = [];
    subs: Subscription[] = [];
    @Input() page: any = null;

    constructor(private bannersService: BannersService,
                private deviceService: DeviceDetectorService) {
    }

    ngOnInit(): void {
        const type = window.innerWidth <= 768 ? 'banners_responsive' : 'banners_desktop';
        this.getBanners(type);
    }

    getBanners(type: string) {
        this.subs.push(this.bannersService.getBanners(type).subscribe(banners => {
            this.banners = banners.filter(x => x.page == this.page);
            console.log("BANNERS ",this.banners);
        }));
    }

    ngOnDestroy() {
        this.subs.forEach(s => s.unsubscribe());
    }

    getDownloadLink() {
        if ( this.deviceService.os === 'Mac' || this.deviceService.os === 'iOS' ) {
            return 'https://apps.apple.com/pe/app/cinestar/id789812337';
        } else {
            return 'https://play.google.com/store/apps/details?id=pe.papps.cinestar';
        }
    }
}
