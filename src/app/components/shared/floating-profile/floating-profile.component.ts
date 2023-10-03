import { Component, OnDestroy, OnInit } from '@angular/core';
import { Utils } from '@utils/utils';
import { UserService } from '@services/user.service';
import { Subscription } from 'rxjs';
import { User } from '@models/user.model';

@Component( {
    selector: 'app-floating-profile',
    templateUrl: './floating-profile.component.html',
    styleUrls: ['../floating-shopping/floating-shopping.component.scss', './floating-profile.component.scss']
} )
export class FloatingProfileComponent implements OnInit, OnDestroy {

    subs: Subscription[] = [];
    user!: User;
    activeTab = 'profile';
    profileOption = 'profile';
    Utils = Utils;
    creditCardAdded!: boolean;

    constructor( private userService: UserService ) {}

    ngOnInit(): void {
        this.subs.push( this.userService.User.subscribe( user => {
            this.user = user;
        } ) );
    }

    ngOnDestroy() {
        this.subs.forEach( s => s.unsubscribe() );
    }

    hideProfile(): void {
        const floating = document.getElementById( 'floating-profile' );
        if ( floating ) {
            floating.style.right = '-100%';
        }

        this.profileOption = 'profile';
    }

    showTab( tab: string ): void {
        this.activeTab = tab;

        const profile = document.getElementById( 'profile-tab' );
        const rewards = document.getElementById( 'rewards' );

        if ( profile && rewards ) {
            if ( tab === 'profile' ) {
                profile.classList.add( 'active' );
                rewards.classList.remove( 'active' );
            } else {
                profile.classList.remove( 'active' );
                rewards.classList.add( 'active' );
            }
        }
    }

    onAddCard() {
        this.profileOption = 'credit-cards';
        this.creditCardAdded = true;
        setTimeout( () => this.creditCardAdded = false, 2000 );
    }
}
