import { Component, OnInit } from '@angular/core';
import { ScreenService } from '@services/screen.service';
import { CandyService } from '@services/candy.service';
import { Router } from '@angular/router';
import {Subscription} from "rxjs";
import {UserService} from "@services/user.service";

@Component( {
    selector: 'app-payment-chocolateria',
    templateUrl: './payment-chocolateria.component.html',
    styleUrls: ['./payment-chocolateria.component.scss']
} )
export class PaymentChocolateriaComponent implements OnInit {
    isLoggedIn: boolean = false;
    subs: Subscription[] = [];
    constructor( private router: Router,
                 public screenService: ScreenService,
                 private candyService: CandyService,
                 private userService: UserService) { }

    ngOnInit(): void {
        this.subs.push( this.userService.isLoggedIn.subscribe( res => this.isLoggedIn = res ) );
        if ( !this.candyService.selectedProducts.length && !this.candyService.chocoAwards.filter( x => ( x.quantity || 0 ) > 0 ).length ) {
            this.router.navigateByUrl( '/chocolateria' ).finally();
        }
    }

}
