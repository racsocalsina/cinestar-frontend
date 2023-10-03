import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CandyService} from '@services/candy.service';
import {Utils} from '@utils/utils';
import {BuyTicketService} from '@services/buy-ticket.service';
import {AuthModalsService} from "@services/auth-modals.service";
import {take} from "rxjs/operators";
import * as moment from 'moment';

@Component({
    selector: 'app-candy-card',
    templateUrl: './candy-card.component.html',
    styleUrls: ['./candy-card.component.scss']
})
export class CandyCardComponent implements OnInit {

    @Output() updated = new EventEmitter();
    @Input() totalQty = 0;
    @Input() isPromo = false;
    @Input() step = 0;
    @Input() product!: any;
    @Input() headquarter_id!: any;
    @Input() isLoggedIn: boolean | any;

    constructor(private candyService: CandyService,
                private buyTicketService: BuyTicketService,
                private authModalsService: AuthModalsService) {
    }

    ngOnInit(): void {
    }

    ngModelChange(qty: number) {
        if (qty === 0) {
            this.candyService.deleteProduct(this.product);
        }

        setTimeout(() => this.candyService.updateAmount(), 300);
    }

    add() {
        this.product.quantity = 1;
        this.candyService.setProduct(this.product);
        this.updated.emit();
    }

    async toggleFavorite() {
        if (!this.isLoggedIn) {
            this.loginModal();
        } else {
            try {
                await this.candyService.toggleFavorite(this.product.sweet_type, this.product.id);
                this.product.favorite = !this.product.favorite;

                if (!this.product.favorite) {
                    if (this.product.sweet_type === 'combo') {
                        this.candyService.fetchCombos({headquarter_id: this.headquarter_id, presale_date: moment(this.candyService.pickup_date).format('YYYY-MM-DD')});
                    } else {
                        this.candyService.fetchProducts({headquarter_id: this.headquarter_id, presale_date: moment(this.candyService.pickup_date).format('YYYY-MM-DD')});
                    }
                }

                this.candyService.fetchFavorites({headquarter_id: this.headquarter_id, presale_date: moment(this.candyService.pickup_date).format('YYYY-MM-DD')});
            } catch (e) {
                Utils.showToast('Ocurrió un error al actualizar tus favoritos');
            }
        }

    }

    deletePromo() {
        this.product.quantity = 0;
        this.buyTicketService.countTotals();
    }

    loginModal() {
        this.authModalsService.showLoginModal();
        this.authModalsService.onLogin.asObservable().pipe(take(1)).subscribe(() => {
            console.log('isLoggedIn');
        });
    }
}
