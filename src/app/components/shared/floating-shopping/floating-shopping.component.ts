import { Component, OnDestroy, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { TicketDetailComponent } from '@components/modals/ticket-detail/ticket-detail.component';
import { MyPurchaseInterface } from '@interfaces/my-purchase.interface';
import { Subscription } from 'rxjs';
import { UserService } from '@services/user.service';

@Component( {
    selector: 'app-floating-shopping',
    templateUrl: './floating-shopping.component.html',
    styleUrls: ['./floating-shopping.component.scss']
} )
export class FloatingShoppingComponent implements OnInit, OnDestroy {

    activeTab = 'current';
    current: MyPurchaseInterface[] = [];
    concluded: MyPurchaseInterface[] = [];
    subs: Subscription[] = [];

    constructor( private modalService: BsModalService,
                 private userService: UserService ) { }

    ngOnInit(): void {
        this.subs.push(
            this.userService.getMyPurchases().subscribe( purchases => {
                console.log( purchases );
                this.current = purchases.filter( x => x.tab_type === 'valid' );
                this.concluded = purchases.filter( x => x.tab_type === 'concluded' );

            } )
        );
    }

    ngOnDestroy() {
        this.subs.forEach( s => s.unsubscribe() );
    }

    hideShopping(): void {
        const floating = document.getElementById( 'floating-shopping' );
        if ( floating ) {
            floating.style.right = '-100%';
        }
    }

    showTab( tab: string ): void {
        this.activeTab = tab;

        const current = document.getElementById( 'current' );
        const completed = document.getElementById( 'completed' );

        if ( current && completed ) {
            if ( tab === 'current' ) {
                current.classList.add( 'active' );
                completed.classList.remove( 'active' );
            } else {
                current.classList.remove( 'active' );
                completed.classList.add( 'active' );
            }
        }
    }

    ticketDetail( purchase: MyPurchaseInterface ): void {
        const initialState = { purchase };
        this.modalService.show( TicketDetailComponent, {
            class: 'modal-pay-confirmation',
            initialState,
            backdrop: 'static',
            keyboard: true
        } );
    }

    trackByFn( index: number, purchase: MyPurchaseInterface ) {
        return purchase.id;
    }

}
