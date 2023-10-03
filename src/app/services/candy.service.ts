import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { CandyTypeInterface } from '@interfaces/candy-type.interface';
import { StorageUtils } from '@utils/storage.utils';
import { environment } from '../../environments/environment';
import { Candy } from '@models/candy.model';
import { PurchaseInterface } from '@interfaces/purchase.interface';
import { ChocoAwardInterface } from '@interfaces/awards';

@Injectable( {
    providedIn: 'root'
} )
export class CandyService extends StorageUtils {

    private _comboTypes = new BehaviorSubject<CandyTypeInterface[]>( [] );
    private _combosSubject = new BehaviorSubject<Candy[]>( [] );
    private _combos: Candy[] = [];
    private _productTypes = new BehaviorSubject<CandyTypeInterface[]>( [] );
    private _productsSubject = new BehaviorSubject<Candy[]>( [] );
    private _products: Candy[] = [];
    private _promoTypes = new BehaviorSubject<CandyTypeInterface[]>( [] );
    private _promosSubject = new BehaviorSubject<Candy[]>( [] );
    private _promos: Candy[] = [];
    private _favoritesSubject = new BehaviorSubject<Candy[]>( [] );
    private _favorites: Candy[] = [];

    selectedProducts: Candy[] = [];
    paymentAmount = 0;
    purchase!: PurchaseInterface | null;
    pickup_date! : Date | null;
    months = new Array ("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");
    weekdays = new Array("Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado");
    day! : any | null;
    day_number! : any | null;
    month! : any | null;
    year! : any | null;

    options?: {
        headquarter_id: number | undefined;
        combo_type_id: number | undefined;
        product_type_id: number | undefined;
        promo_type_id: number | undefined;
    };
    chocoAwards: ChocoAwardInterface[] = [];
    chocoAwardsUsedPoints = 0;

    constructor( private http: HttpClient ) {
        super();
    }

    reset() {
        this.selectedProducts = [];
        this.paymentAmount = 0;
        this.purchase = null;
        this.options = undefined;
        //this.chocoAwards = [];
        this.chocoAwards.forEach( x => { x.quantity = 0;} );
        this.chocoAwardsUsedPoints = 0;
    }

    fetchComboTypes( params: any ) {
        if ( this.getLocalStorage( 'comboTypes' ) ) {
            this._comboTypes.next( JSON.parse( this.getLocalStorage( 'comboTypes' ) ) );
        }

        const url = `${environment.api}/combo-types`;
        this.http.get( url, { params } ).subscribe( ( res: any ) => {
            this.setLocalStorage( 'comboTypes', JSON.stringify( res.data ) );
            this._comboTypes.next( res.data );
        } );
    }

    getComboTypes( params: any ) {
        this.fetchComboTypes( params );
        return this._comboTypes.asObservable();
    }

    fetchPromoTypes( params: any ) {
        if ( this.getLocalStorage( 'promoTypes' ) ) {
            this._promoTypes.next( JSON.parse( this.getLocalStorage( 'promoTypes' ) ) );
        }

        const url = `${environment.api}/promotions-types`;
        this.http.get( url, { params } ).subscribe( ( res: any ) => {
            this.setLocalStorage( 'promoTypes', JSON.stringify( res.data ) );
            this._promoTypes.next( res.data );
        } );
    }

    getPromoTypes( params: any ) {
        this.fetchPromoTypes( params );
        return this._promoTypes.asObservable();
    }

    fetchProductTypes( params: any ) {
        if ( this.getLocalStorage( 'productTypes' ) ) {
            this._productTypes.next( JSON.parse( this.getLocalStorage( 'productTypes' ) ) );
        }

        const url = `${environment.api}/product-types`;
        this.http.get( url, { params } ).subscribe( ( res: any ) => {
            this.setLocalStorage( 'productTypes', JSON.stringify( res.data ) );
            this._productTypes.next( res.data );
        } );
    }

    getProductTypes( params: any ) {
        this.fetchProductTypes( params );
        return this._productTypes.asObservable();
    }

    fetchCombos( params: any ) {
        if ( this.getLocalStorage( 'combos' ) ) {
            this._combos = JSON.parse( this.getLocalStorage( 'combos' ) ).map( ( x: Candy ) => new Candy( x ) );
            this._combosSubject.next( this._combos );
        }

        const url = `${environment.api}/combos`;
        this.http.get( url, { params } ).subscribe( ( res: any ) => {
            this._combos = res.data.map( ( x: Candy ) => new Candy( x ) );
            this.setLocalStorage( 'combos', JSON.stringify( this._combos ) );
            this._combosSubject.next( this._combos );
        } );
    }

    getCombos( params?: any ) {
        if ( params ) {
            this.fetchCombos( params );
        }
        return this._combosSubject.asObservable();
    }

    fetchPromos( params: any ) {
        if ( this.getLocalStorage( 'promos' ) ) {
            this._promos = JSON.parse( this.getLocalStorage( 'promos' ) ).map( ( x: Candy ) => new Candy( x ) );
            this._promosSubject.next( this._promos );
        }

        const url = `${environment.api}/choco-promotions`;
        this.http.get( url, { params } ).subscribe( ( res: any ) => {
            this._promos = res.data.map( ( x: Candy ) => new Candy( x ) );
            this.setLocalStorage( 'promos', JSON.stringify( this._promos ) );
            this._promosSubject.next( this._promos );
        } );
    }

    getPromos( params?: any ) {
        if ( params ) {
            this.fetchPromos( params );
        }
        return this._promosSubject.asObservable();
    }

    fetchProducts( params: any ) {
        if ( this.getLocalStorage( 'products' ) ) {
            this._products = JSON.parse( this.getLocalStorage( 'products' ) ).map( ( x: Candy ) => new Candy( x ) );
            this._productsSubject.next( this._products );
        }

        const url = `${environment.api}/products`;
        this.http.get( url, { params } ).subscribe( ( res: any ) => {
            this._products = res.data.map( ( x: Candy ) => new Candy( x ) );
            this.setLocalStorage( 'products', JSON.stringify( this._products ) );
            this._productsSubject.next( this._products );
        } );
    }

    getProducts( params?: any ) {
        if ( params ) {
            this.fetchProducts( params );
        }
        return this._productsSubject.asObservable();
    }

    fetchFavorites( params: any ) {
        if ( this.getLocalStorage( 'favorites' ) ) {
            this._favorites = JSON.parse( this.getLocalStorage( 'favorites' ) ).map( ( x: Candy ) => new Candy( x ) );
            this._favoritesSubject.next( this._favorites );
        }

        const url = `${environment.api}/sweets/favorites`;
        this.http.get( url, { params } ).subscribe( ( res: any ) => {
            this._favorites = res.data.map( ( x: Candy ) => new Candy( { ...x, favorite: true } ) );
            this.setLocalStorage( 'favorites', JSON.stringify( this._favorites ) );
            this._favoritesSubject.next( this._favorites );
        } );
    }

    getFavorites( params?: any ) {
        if ( params ) {
            this.fetchFavorites( params );
        }
        return this._favoritesSubject.asObservable();
    }

    toggleFavorite( sweet_type: string, id: number ) {
        const url = `${environment.api}/sweets/toggle-favorite`;
        return this.http.post( url, { sweet_type, id } ).toPromise();
    }

    setProduct( product: Candy ) {
        if ( !this.selectedProducts.find( x => x.id === product.id ) ) {
            this.selectedProducts.push( product );
            this.updateAmount();
        }
    }

    deleteProduct( product: Candy ) {
        this.selectedProducts = this.selectedProducts.filter( x => x.id !== product.id );
        this.updateAmount();
    }

    updateAmount() {
        this.paymentAmount = this.selectedProducts.reduce( ( x, a ) => x + a.quantity * a.price, 0 );
    }

    initPurchase( params: any ) {
        const url = `${environment.api}/sweets/purchases`;
        return this.http.post( url, params ).toPromise();
    }

    updatePurchase( params: any, purchase_id: any ) {
        const url = `${environment.api}/sweets/purchases/${purchase_id}`;
        return this.http.patch( url, params ).toPromise();
    }

    createOrEditPurchase( headquarter_id: any, purchase_id: any ) {
        const params: any = {
            origin: 'web',
            headquarter_id,
            purchase_id,
            sweets: []
        };

        this.selectedProducts.forEach( x => {
            const sweet = {
                id: x.id,
                quantity: x.quantity,
                type: x.sweet_type,
                promotion_id: x.type === 'NORMAL' ? 0 : x.choco_promotion_id,
                type_promotion: x.type
            };

            params.sweets.push( sweet );
        } );

        this.chocoAwards.forEach( x => {
            if ( x.quantity > 0 ) {
                const sweet = {
                    id: x.id,
                    quantity: x.quantity,
                    type: x.sweet_type,
                    promotion_id: x.promotion_id,
                    type_promotion: x.type
                };
                params.sweets.push( sweet );
            }
        } );

        console.log( params );

        if ( this.purchase ) {
            return this.updatePurchase( params, purchase_id );
        } else {
            return this.initPurchase( params );
        }
    }

}
