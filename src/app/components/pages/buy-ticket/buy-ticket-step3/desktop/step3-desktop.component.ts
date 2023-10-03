import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { CandyTypeInterface } from '@interfaces/candy-type.interface';
import { CandyService } from '@services/candy.service';
import { BuyTicketService } from '@services/buy-ticket.service';
import { Candy } from '@models/candy.model';
import {UserService} from "@services/user.service";

@Component( {
    selector: 'app-step3-desktop',
    templateUrl: './step3-desktop.component.html',
    styleUrls: ['./step3-desktop.component.scss']
} )
export class Step3DesktopComponent implements OnInit, OnDestroy {

    subs: Subscription[] = [];
    tab = 'combos';
    comboTypes: CandyTypeInterface[] = [];
    productTypes: CandyTypeInterface[] = [];
    promoTypes: CandyTypeInterface[] = [];
    combo_type_id?: number;
    product_type_id?: number;
    promo_type_id?: number;
    combos: Candy[] = [];
    filteredCombos: Candy[] = [];
    products: Candy[] = [];
    filteredProducts: Candy[] = [];
    promos: Candy[] = [];
    filteredPromos: Candy[] = [];
    favorites: Candy[] = [];
    isLoggedIn: boolean = false;
    constructor( private candyService: CandyService,
                 public buyTicket: BuyTicketService,
                 private userService: UserService) { }

    ngOnInit(): void {
        this.subs.push( this.userService.isLoggedIn.subscribe( res => this.isLoggedIn = res ) );

        this.subs.push( this.candyService.getProductTypes( { headquarter_id: this.buyTicket.selectedOption?.cinema } )
        .subscribe( data => this.productTypes = data ) );

        this.subs.push( this.candyService.getComboTypes( { headquarter_id: this.buyTicket.selectedOption?.cinema } )
        .subscribe( data => this.comboTypes = data ) );

        this.subs.push( this.candyService.getPromoTypes( {
            headquarter_id: this.buyTicket.selectedOption?.cinema, movie_time_id: this.buyTicket.selectedOption?.movie_time
        } ).subscribe( data => this.promoTypes = data ) );

        this.getData();
    }

    ngOnDestroy() {
        this.subs.forEach( s => s.unsubscribe() );
    }

    getData() {
        this.subs.push( this.candyService.getCombos( { headquarter_id: this.buyTicket.selectedOption?.cinema } )
        .subscribe( combos => {
            combos.forEach( ( x, i ) => {
                if ( this.candyService.selectedProducts.find( y => y.id === x.id ) ) {
                    combos[ i ] = this.candyService.selectedProducts.find( y => y.id === x.id ) || new Candy( {} );
                }
            } );
            this.combos = combos;
            this.onChangeComboType();
        } ) );

        this.subs.push( this.candyService.getProducts( { headquarter_id: this.buyTicket.selectedOption?.cinema } )
        .subscribe( products => {
            products.forEach( ( x, i ) => {
                if ( this.candyService.selectedProducts.find( y => y.id === x.id ) ) {
                    products[ i ] = this.candyService.selectedProducts.find( y => y.id === x.id ) || new Candy( {} );
                }
            } );
            this.products = products;
            this.onChangeProductType();
        } ) );

        this.subs.push( this.candyService.getPromos( {
            headquarter_id: this.buyTicket.selectedOption?.cinema, movie_time_id: this.buyTicket.selectedOption?.movie_time
        } ).subscribe( promos => {
            promos.forEach( ( x, i ) => {
                if ( this.candyService.selectedProducts.find( y => y.id === x.id ) ) {
                    promos[ i ] = this.candyService.selectedProducts.find( y => y.id === x.id ) || new Candy( {} );
                }
            } );
            this.promos = promos;
            this.onChangePromoType();
        } ) );
        if (this.isLoggedIn){
            this.subs.push( this.candyService.getFavorites( { headquarter_id: this.buyTicket.selectedOption?.cinema } )
                .subscribe( favorites => {
                    favorites.forEach( ( x, i ) => {
                        if ( this.candyService.selectedProducts.find( y => y.id === x.id ) ) {
                            favorites[ i ] = this.candyService.selectedProducts.find( y => y.id === x.id ) || new Candy( {} );
                        }
                    } );
                    this.favorites = favorites;
                } ) );
        }

    }

    trackCombos( index: number, combo: Candy ) {
        return combo.id;
    }

    trackProducts( index: number, products: Candy ) {
        return products.id;
    }

    trackPromos( index: number, promo: Candy ) {
        return promo.id;
    }

    trackFavorites( index: number, products: Candy ) {
        return products.id;
    }

    updatedProduct( product: Candy ) {
        if ( this.tab === 'favoritos' ) {

            if ( product.type === 'NORMAL' ) {
                if ( product.sweet_type === 'combo' ) {
                    const i = this.combos.findIndex( x => x.id === product.id );
                    if ( i >= 0 ) {
                        this.combos[ i ] = product;
                    }
                } else {
                    const i = this.products.findIndex( x => x.id === product.id );
                    if ( i >= 0 ) {
                        this.products[ i ] = product;
                    }
                }
            } else {
                const i = this.promos.findIndex( x => x.id === product.id );
                if ( i >= 0 ) {
                    this.promos[ i ] = product;
                }
            }

        } else {
            const i = this.favorites.findIndex( x => x.id === product.id );
            if ( i >= 0 ) {
                this.favorites[ i ] = product;
            }
        }
    }

    onChangeProductType() {
        if ( this.product_type_id ) {
            this.filteredProducts = this.products.filter( x => x.type_id === this.product_type_id );
        } else {
            this.filteredProducts = this.products;
        }
    }

    onChangeComboType() {
        if ( this.combo_type_id ) {
            this.filteredCombos = this.combos.filter( x => x.type_id === this.combo_type_id );
        } else {
            this.filteredCombos = this.combos;
        }
    }

    onChangePromoType() {
        if ( this.promo_type_id ) {
            this.filteredPromos = this.promos.filter( x => x.type_id === this.promo_type_id );
        } else {
            this.filteredPromos = this.promos;
        }
    }
}
