import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { Utils } from '@utils/utils';
import { CandyService } from '@services/candy.service';

@Component( {
    selector: 'app-modal-responsive-chocolateria-confirmation',
    templateUrl: './modal-responsive-chocolateria-confirmation.component.html',
    styleUrls: ['./modal-responsive-chocolateria-confirmation.component.scss']
} )
export class ModalResponsiveChocolateriaConfirmationComponent implements OnInit {

    name_headquarter?: String;
    headquarter_id?: number;
    combo_type_id?: number;
    product_type_id?: number;
    promo_type_id?: number;
    isLoading = false;
    error!: string | null;

    constructor( public bsModalRef: BsModalRef,
                 private router: Router,
                 public candyService: CandyService) { }

    ngOnInit(): void {
    }

    continue(): void {
        this.error = null;
        this.isLoading = true;

        if ( this.showChocolateria() || this.candyService.purchase ) {
            const purchase_id = this.candyService.purchase ? this.candyService.purchase.id : null;
            this.candyService.createOrEditPurchase(this.headquarter_id, purchase_id)
                .then((res: any) => {
                    console.log(res);
                    this.candyService.purchase = res.data.purchase;
                    this.candyService.options = {
                        headquarter_id: this.headquarter_id,
                        combo_type_id: this.combo_type_id,
                        product_type_id: this.product_type_id,
                        promo_type_id: this.promo_type_id
                    };
                    this.router.navigateByUrl('/chocolateria/pagar').finally();
                    this.bsModalRef.hide();
                }).catch(error => Utils.showToast(error))
                .finally(() => this.isLoading = false);
        } else {
            this.redirect();
        }

    }

    redirect() {
        const arrRoute = this.router.url.split( '/' );
        arrRoute[ 5 ] = '4';
        this.router.navigateByUrl( arrRoute.join( '/' ) ).finally();
        this.bsModalRef.hide();
    }


    showChocolateria() {
        return this.candyService.selectedProducts.length || this.candyService.chocoAwards.filter( x => ( x.quantity || 0 ) > 0 ).length;
    }
}
