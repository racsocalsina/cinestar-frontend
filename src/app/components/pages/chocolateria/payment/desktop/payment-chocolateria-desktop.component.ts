import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import { CandyService } from '@services/candy.service';
import { BuyTicketService } from '@services/buy-ticket.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component( {
    selector: 'app-payment-chocolateria-desktop',
    templateUrl: './payment-chocolateria-desktop.component.html',
    styleUrls: [
        '../../index/desktop/index-chocolateria-desktop.component.scss',
        './payment-chocolateria-desktop.component.scss'
    ]
} )
export class PaymentChocolateriaDesktopComponent implements OnInit, OnDestroy {
    @Input() isLoggedIn: boolean | any;
    isLoading = false;
    subs: Subscription[] = [];

    constructor( private router: Router,
                 public candyService: CandyService,
                 private buyTicketService: BuyTicketService ) { }

    ngOnInit(): void {
        this.subs.push( this.buyTicketService.$loading
        .asObservable().subscribe( value => this.isLoading = value ) );
    }

    ngOnDestroy() {
        this.subs.forEach( s => s.unsubscribe() );
    }

    pay() {
        this.buyTicketService.initNiubiz.next();
    }

    clear() {
        this.candyService.reset();
        this.router.navigateByUrl( '/chocolateria' ).finally();
    }
}
