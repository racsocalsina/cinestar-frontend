import { Injectable } from '@angular/core';
import { Movie } from '@models/movie.model';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Tariff } from '@models/tariff.model';
import { BehaviorSubject, Subject } from 'rxjs';
import { PurchaseInterface } from '@interfaces/purchase.interface';
import { StorageUtils } from '@utils/storage.utils';
import { MovieTime } from '@models/show-time.model';
import { Seat } from '@interfaces/seat.interface';
import { Router } from '@angular/router';
import { CandyService } from '@services/candy.service';
import { ChocoAwardInterface, CodeAwardInterface, TicketAwardInterface } from '@interfaces/awards';

@Injectable( {
    providedIn: 'root'
} )
export class BuyTicketService extends StorageUtils {

    wait_time = 300;
    selectedOption!: {
        movie: Movie;
        format: number;
        movie_time: number;
        cinema: number;
    } | null;
    pointsChecked: any;
    tariffs: Tariff[] = [];
    ticketAwards: TicketAwardInterface[] = [];
    ticketAwardsUsedPoints = 0;
    codes: CodeAwardInterface[] = [];
    graph!: string;
    original_graph!: string;
    purchase!: PurchaseInterface | null;
    movieTime!: MovieTime | undefined;
    initNiubiz = new Subject<boolean>();
    $loading = new Subject<boolean>();
    seats: Seat[] = [];
    paymentAmount = 0;
    tickets_number = 0;
    onError = new Subject<boolean>();
    public _name: any;
    public _address : any;
    private countdownInterval!: number;
    private _seatsSubject = new BehaviorSubject<Seat[]>( [] );
    private _payment = new BehaviorSubject<number>( 0 );

    constructor( private http: HttpClient,
                 private candyService: CandyService,
                 private router: Router ) {
        super();
    }

    reset() {
        this.stopCountdown();
        this.tariffs = [];
        /*if ( this.purchase ) {
            this.cancelPurchase( this.purchase.id ).then( res => {
                console.log( res );
            } ).catch( error => {
                console.log( error );
            } );
        }*/
        this.selectedOption = null;
        this.purchase = null;
        this.setPayment( 0 );
        this.setSeats( [] );
        this.candyService.paymentAmount = 0;
        this.candyService.selectedProducts = [];
        this.candyService.purchase = null;
        this.candyService.paymentAmount = 0;
        this.tickets_number = 0;
        this.pointsChecked = null;
        this.ticketAwards = [];
        this.ticketAwardsUsedPoints = 0;
        this.candyService.chocoAwards = [];
        this.candyService.chocoAwardsUsedPoints = 0;
        this.codes = [];
        this.clearSessionStorage();
    }

    getPayment() {
        return this._payment.asObservable();
    }

    setPayment( value: number ) {
        this.paymentAmount = value;
        this._payment.next( value );
    }

    countTotals() {
        let totalPay = 0;
        this.tickets_number = 0;
        this.ticketAwardsUsedPoints = 0;
        this.candyService.chocoAwardsUsedPoints = 0;

        this.tariffs.forEach( x => {
            totalPay += x.quantity * x.online_price;
            this.tickets_number += x.quantity * x.tickets_number;
        } );

        this.ticketAwards.forEach( x => {
            this.ticketAwardsUsedPoints += x.points * x.quantity || 0;
            totalPay += ( x.quantity || 0 ) * x.online_price;
            this.tickets_number += ( x.quantity || 0 ) * x.tickets_number;
        } );

        this.candyService.chocoAwards.forEach( x => {
            this.candyService.chocoAwardsUsedPoints += x.points * x.quantity || 0;
            totalPay += ( x.quantity || 0 ) * x.price;
        } );

        this.codes.forEach( x => {
            totalPay += x.quantity * x.online_price;
            this.tickets_number += x.quantity * x.tickets_number;
        } );

        this.setPayment( totalPay );
    }

    updateSeats( seat: Seat ) {
        const i = this.seats.findIndex( x => x.index === seat.index );
        if ( i >= 0 ) {
            this.seats.splice( i, 1 );
        } else if ( seat.position ) {
            this.seats.push( seat );
        }

        this.seats.sort( ( a: Seat, b: Seat ) => ( a.index === b.index ) ? 0 : a.index ? -1 : 1 );

        this._seatsSubject.next( this.seats );
    }

    setSeats( seats: Seat[] ) {
        this.seats = seats;
        this._seatsSubject.next( this.seats );
    }

    getSeats() {
        return this._seatsSubject.asObservable();
    }

    stopCountdown(): void {
        clearInterval( this.countdownInterval );
        this.wait_time = 300;
    }

    initCountdown(): void {
        this.countdownInterval = window.setInterval( () => {
            if ( this.wait_time <= 0 ) {
                this.stopCountdown();
                console.log( 'cancelar compra' );
                const arrRoute = this.router.url.split( '/' );
                const back = [arrRoute[ 0 ], arrRoute[ 1 ], arrRoute[ 2 ], arrRoute[ 3 ]].join( '/' );
                this.router.navigateByUrl( back ).finally();
            } else {
                this.wait_time--;
            }
        }, 1000 );
    }

    getTariffs( movieTime: number ): Promise<Tariff[]> {
        const url = `${environment.api}/movie-times/${movieTime}/tariffs`;
        return this.http.get( url )
        .pipe( map( ( res: any ) => res.data.map( ( x: any ) => new Tariff( x ) ) ) ).toPromise();
    }

    initPurchase( params: any ) {
        const url = `${environment.api}/purchases`;
        return this.http.post( url, params ).toPromise();
    }

    cancelPurchase( id: number ) {
        const url = `${environment.api}/purchases/${id}`;
        return this.http.delete( url ).toPromise();
    }

    updatePurchase( params: any, id: number ) {
        const url = `${environment.api}/purchases/${id}`;
        return this.http.patch( url, params ).toPromise();
    }

    updatePurchaseSeat( params: any ) {
        const url = `${environment.api}/purchases/${this.purchase?.id}/seat`;
        return this.http.post( url, params ).toPromise();
    }

    createSesionNiubiz( params: any ) {
        const url = `${environment.api}/payment-gateways/niubiz/session`;
        return this.http.post( url, params )
        .pipe( map( ( res: any ) => res.data ) ).toPromise();
    }

    pay( params: any ) {
        const url = `${environment.api_v2}/purchases/pay`;
        return this.http.post( url, params ).toPromise();
    }

    getPurchase( params: any ) {
        const url = `${environment.api}/purchases/finished`;
        return this.http.get( url, { params } )
        .pipe( map( ( res: any ) => res.data ) ).toPromise();
    }

    /*savePurchaseSessionStorage( params: any ) {
     const purchaseData = {
     ...this.getPurchaseSessionStorage(),
     ...params
     };

     this.setSessionStorage( 'purchaseData', JSON.stringify( purchaseData ) );
     }

     getPurchaseSessionStorage() {
     if ( this.getSessionStorage( 'purchaseData' ) ) {
     return JSON.parse( this.getSessionStorage( 'purchaseData' ) );
     } else {
     return null;
     }
     }*/

    getGraph() {
        const url = `${environment.api}/purchases/${this.purchase?.id}/graph`;
        return this.http.get( url ).pipe( map( ( res: any ) => res.data ) ).toPromise();
    }

    confirm() {
        const url = `${environment.api}/purchases/${this.purchase?.id}/confirmation`;
        return this.http.post( url, {} ).toPromise();
    }

    checkPoints( params: any ) {
        const url = `${environment.api}/check-points`;
        return this.http.get( url, { params } )
        .pipe( map( ( res: any ) => res.data ) ).toPromise();
    }

    getTicketAwards( params: any ): Promise<TicketAwardInterface[]> {
        const url = `${environment.api}/ticket_awards`;
        return this.http.get( url, { params } )
        .pipe( map( ( res: any ) => res.data ) ).toPromise();
    }

    getChocoAwards(): Promise<ChocoAwardInterface[]> {
        const url = `${environment.api}/choco_awards`;
        return this.http.get( url )
        .pipe( map( ( res: any ) => res.data ) ).toPromise();
    }

    validateCode( movie_time_id: any, code: string ): Promise<CodeAwardInterface> {
        const url = `${environment.api}/consult_code/${code}`;
        return this.http.post( url, { movie_time_id } )
        .pipe( map( ( res: any ) => res.data ) ).toPromise();
    }
}
