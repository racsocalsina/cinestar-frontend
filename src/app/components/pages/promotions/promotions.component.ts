import {Component, OnInit} from '@angular/core';
import {BsModalService} from "ngx-bootstrap/modal";
import {DetailComponent} from "@components/pages/promotions/detail/detail.component";
import {PromosService} from "@services/promos.service";
import {Pages, TypePromotion} from "@utils/enums";
import {BannerInterface} from "@interfaces/banner.interface";
import {Subscription} from "rxjs";
import {BannersService} from "@services/banners.service";

@Component({
    selector: 'app-promotions',
    templateUrl: './promotions.component.html',
    styleUrls: ['./promotions.component.scss']
})
export class PromotionsComponent implements OnInit {
    banners: BannerInterface[] = [];
    subs: Subscription[] = [];


    option = true;
    tickets: any;
    chocos: any;

    constructor(private modalService: BsModalService,
                private promotionService: PromosService,
                private bannersService: BannersService) {
    }

    ngOnInit(): void {
        this.promotionService.getPromotions().subscribe(k => {
            this.tickets = k.filter(x => x.type === TypePromotion.Ticket);
            this.chocos = k.filter(x => x.type === TypePromotion.Chocolateria);
        });
        const type = this.type();
        this.getBanners(type)
    }


    showDetail(item: any) {
        const initialState: any = {
            item
        };
        const modal = this.modalService.show(DetailComponent, {
            initialState,
            class: 'modal-medium modal-dialog-centered md-min-width',
            backdrop: 'static',
            keyboard: false,
        });
    }

    getBanners(type: string) {
        this.subs.push(this.bannersService.getBanners(type).subscribe(banners => {

            this.banners = banners.filter(x => x.page == Pages.PROMOCION);
            console.log("BANNERS",  this.banners);
        }));
    }

    type(){
        return window.innerWidth <= 768 ? 'banners_responsive' : 'banners_desktop';
    }
}
