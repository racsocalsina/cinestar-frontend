import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Cinema} from '@models/cinema.model';
import {CinemaService} from '@services/cinema.service';
import {Observable, Subscription} from 'rxjs';
import {CandyTypeInterface} from '@interfaces/candy-type.interface';
import { BsDatepickerConfig,  BsLocaleService } from 'ngx-bootstrap/datepicker';
import { ModalResponsiveChocolateriaConfirmationComponent } from '@modals/modal-responsive-chocolateria-confirmation/modal-responsive-chocolateria-confirmation.component';
import {CandyService} from '@services/candy.service';
import {Candy} from '@models/candy.model';
import {Utils} from '@utils/utils';
import {Router} from '@angular/router';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { BsModalService } from 'ngx-bootstrap/modal';
import * as moment from 'moment';


@Component({
    selector: 'app-index-chocolateria-responsive',
    templateUrl: './index-chocolateria-responsive.component.html',
    styleUrls: ['./index-chocolateria-responsive.component.scss']
})
export class IndexChocolateriaResponsiveComponent implements OnInit, OnDestroy {
    @Input() isLoggedIn: boolean | any;
    subs: Subscription[] = [];
    cinemas: Cinema[] = [];
    headquarter_id?: number;
    combo_type_id?: number;
    promo_type_id?: number;
    _combo_type_id?: number;
    product_type_id?: number;
    _product_type_id?: number;
    _promotion_type_id?: number;
    $productTypes!: Observable<CandyTypeInterface[]>;
    $comboTypes!: Observable<CandyTypeInterface[]>;
    $promoTypes!: Observable<CandyTypeInterface[]>;
    tab = 'combos';
    combos: Candy[] = [];
    filteredCombos: Candy[] = [];
    products: Candy[] = [];
    filteredProducts: Candy[] = [];
    promos: Candy[] = [];
    filteredPromos: Candy[] = [];
    favorites: Candy[] = [];
    isLoading = false;
    showCandyFilters = false;
    showMyPurchase = false;
    pickup_date! : Date| null;
    name_headquarter?: String;
    today! : Date | null;

    bsConfig: Partial<BsDatepickerConfig> = {
        containerClass: 'theme-red custom-auth-calendar',
        adaptivePosition: true,
        minDate: new Date(),

    }

    constructor(private router: Router,
                private localeService: BsLocaleService,
                private modalService: BsModalService,
                private cinemaService: CinemaService,
                public candyService: CandyService) {
                    defineLocale( 'es', esLocale );
                    this.localeService.use( 'es' );
    }

    ngOnInit(): void {
        console.log("RESPONSIVE");
        this.subs.push(this.cinemaService.getCinemas().subscribe(cinemas => this.cinemas = cinemas));
        this.today = new Date();
        if (this.candyService.options) {
            this.headquarter_id = this.candyService.options.headquarter_id;
            this.combo_type_id = this.candyService.options.combo_type_id;
            this.product_type_id = this.candyService.options.product_type_id;
            this.promo_type_id = this.candyService.options.promo_type_id;
            this.pickup_date = this.candyService.pickup_date;
            this.fetchTypes();
            this.fetchData();
        }
    
    }

    ngOnDestroy() {
        this.subs.forEach(s => s.unsubscribe());
    }

    getData() {
        this.subs.push(this.candyService.getCombos()
            .subscribe(combos => {
                combos.forEach((x, i) => {
                    if (this.candyService.selectedProducts.find(y => y.id === x.id)) {
                        combos[i] = this.candyService.selectedProducts.find(y => y.id === x.id) || new Candy({});
                    }
                });
                this.combos = combos;
                this.onChangeComboType();
            }));

        this.subs.push(this.candyService.getProducts()
            .subscribe(products => {
                products.forEach((x, i) => {
                    if (this.candyService.selectedProducts.find(y => y.id === x.id)) {
                        products[i] = this.candyService.selectedProducts.find(y => y.id === x.id) || new Candy({});
                    }
                });
                this.products = products;
                this.onChangeProductType();
            }));
        this.subs.push(this.candyService.getPromos()
            .subscribe(promos => {
                promos.forEach((x, i) => {
                    if (this.candyService.selectedProducts.find(y => y.id === x.id)) {
                        promos[i] = this.candyService.selectedProducts.find(y => y.id === x.id) || new Candy({});
                    }
                });
                this.promos = promos;
                this.onChangePromoType();
            }));
        if (this.isLoggedIn) {
            this.subs.push(this.candyService.getFavorites()
                .subscribe(favorites => {
                    favorites.forEach((x, i) => {
                        if (this.candyService.selectedProducts.find(y => y.id === x.id)) {
                            favorites[i] = this.candyService.selectedProducts.find(y => y.id === x.id) || new Candy({});
                        }
                    });
                    this.favorites = favorites;
                }));
        }
    }

    onSelectCinema() {

        this.cinemas.forEach(object =>{
            if(object.id == this.headquarter_id){
                this.name_headquarter = object.name;
            }
        });

        if(this.pickup_date != this.candyService.pickup_date || this.headquarter_id != this.candyService.options?.headquarter_id){
            this.candyService.reset();
        }
        this.combo_type_id = undefined;
        this.product_type_id = undefined;
        this.promo_type_id = undefined;
        if(this.headquarter_id && this.pickup_date){
            this.candyService.pickup_date = this.pickup_date;
            this.candyService.day = this.candyService.weekdays[this.candyService.pickup_date != null ? this.candyService.pickup_date.getDay():0];
            this.candyService.day_number = this.candyService.pickup_date.getDate();
            this.candyService.month = this.candyService.months[this.candyService.pickup_date != null ? this.candyService.pickup_date.getMonth(): 0];
            this.candyService.year = this.candyService.pickup_date.getFullYear();
            this.fetchTypes();
            this.fetchData();
            this.getData();
        }
    }

    fetchData() {
        this.candyService.fetchCombos({headquarter_id: this.headquarter_id, presale_date: moment(this.candyService.pickup_date).format('YYYY-MM-DD')});
        this.candyService.fetchProducts({headquarter_id: this.headquarter_id, presale_date: moment(this.candyService.pickup_date).format('YYYY-MM-DD')});
        this.candyService.fetchPromos({headquarter_id: this.headquarter_id, today: moment(this.candyService.pickup_date).format('YYYY-MM-DD')});
        if (this.isLoggedIn){
            this.candyService.fetchFavorites({headquarter_id: this.headquarter_id,presale_date:moment(this.candyService.pickup_date).format('YYYY-MM-DD')});
        }
    }

    fetchTypes() {
        this.$comboTypes = this.candyService.getComboTypes({headquarter_id: this.headquarter_id});
        this.$productTypes = this.candyService.getProductTypes({headquarter_id: this.headquarter_id});
        this.$promoTypes = this.candyService.getPromoTypes({headquarter_id: this.headquarter_id});
    }

    trackCombos(index: number, combo: Candy) {
        return combo.id;
    }

    trackProducts(index: number, products: Candy) {
        return products.id;
    }

    trackPromos(index: number, products: Candy) {
        return products.id;
    }

    trackFavorites(index: number, products: Candy) {
        return products.id;
    }

    updatedProduct(product: Candy) {
        if (this.tab === 'favoritos') {

            if (product.sweet_type === 'combo') {
                const i = this.combos.findIndex(x => x.id === product.id);
                if (i >= 0) {
                    this.combos[i] = product;
                }
            } else {
                const i = this.products.findIndex(x => x.id === product.id);
                if (i >= 0) {
                    this.products[i] = product;
                }
            }

        } else {
            const i = this.favorites.findIndex(x => x.id === product.id);
            if (i >= 0) {
                this.favorites[i] = product;
            }
        }
    }

    onChangeProductType() {
        if (this.product_type_id) {
            this.filteredProducts = this.products.filter(x => x.type_id === this.product_type_id);
        } else {
            this.filteredProducts = this.products;
        }
    }

    onChangePromoType() {
        if (this.promo_type_id) {
            this.filteredPromos = this.promos.filter(x => x.type_id === this.promo_type_id);
        } else {
            this.filteredPromos = this.promos;
        }
    }

    onChangeComboType() {
        if (this.combo_type_id) {
            this.filteredCombos = this.combos.filter(x => x.type_id === this.combo_type_id);
        } else {
            this.filteredCombos = this.combos;
        }
    }

    showFilters() {
        this.showCandyFilters = true;
        this._product_type_id = this.product_type_id;
        this._combo_type_id = this.combo_type_id;
        this._promotion_type_id = this.promo_type_id;
    }

    closeCandyFilters() {
        this.showCandyFilters = false;
        this._product_type_id = undefined;
        this._combo_type_id = undefined;
        this._promotion_type_id = undefined;
    }


    filter() {
        if (this.tab === 'combos') {
            this.combo_type_id = this._combo_type_id;
            this.product_type_id = undefined;
            this.promo_type_id = undefined;
            this.onChangeComboType();
        } else if (this.tab === 'products') {
            this.product_type_id = this._product_type_id;
            this.combo_type_id = undefined;
            this.promo_type_id = undefined;
            this.onChangeProductType();
        } else if (this.tab === 'promotions') {
            this.promo_type_id = this._promotion_type_id;
            this.product_type_id = undefined;
            this.combo_type_id = undefined;
            this.onChangePromoType();
        }

        this.closeCandyFilters();
    }

    reset() {
        this.candyService.reset();
        this.showMyPurchase = false;
        this.fetchData();
    }

    initPurchase() {
        this.showModalConfirmation();
    }

    showChocolateria() {
        return this.candyService.selectedProducts.length || this.candyService.chocoAwards.filter( x => ( x.quantity || 0 ) > 0 ).length;
    }

    showModalConfirmation() {
        this.modalService.show( ModalResponsiveChocolateriaConfirmationComponent, {
            initialState: {
                headquarter_id: this.headquarter_id,
                combo_type_id: this.combo_type_id,
                product_type_id: this.product_type_id,
                promo_type_id: this.promo_type_id,
                name_headquarter: this.name_headquarter
            },
            class: 'modal-responsive-chocolateria-confirmation'
        } );
    }
}
