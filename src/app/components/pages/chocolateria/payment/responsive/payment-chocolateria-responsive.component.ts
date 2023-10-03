import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import { BuyTicketService } from '@services/buy-ticket.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { CandyService } from '@services/candy.service';

@Component( {
    selector: 'app-payment-chocolateria-responsive',
    templateUrl: './payment-chocolateria-responsive.component.html',
    styleUrls: ['./payment-chocolateria-responsive.component.scss']
} )
export class PaymentChocolateriaResponsiveComponent implements OnInit, OnDestroy {
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

    cancel() {
        this.candyService.reset();
        this.router.navigateByUrl( '/chocolateria' ).finally();
    }
}
