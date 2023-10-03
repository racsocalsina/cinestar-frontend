import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ScreenService } from '@services/screen.service';
import { ModalPromotionalCodeComponent } from '@modals/modal-promotional-code/modal-promotional-code.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BuyTicketService } from '@services/buy-ticket.service';
import { Utils } from '@utils/utils';
import { MAX_TICKETS } from '@utils/constants';
import { CodeAwardInterface } from '@interfaces/awards';
import { CandyService } from '@services/candy.service';
import { UserService } from '@services/user.service';
import { User } from '@models/user.model';
import { Subscription } from 'rxjs';

@Component( {
    selector: 'app-promo-codes',
    templateUrl: './promo-codes.component.html',
    styleUrls: ['./promo-codes.component.scss']
} )
export class PromoCodesComponent implements OnInit, OnDestroy {

    MAX_TICKETS = MAX_TICKETS;
    @Input() type!: string;
    @Input() source!: string;
    showCustomCode = false;
    customCode: string | undefined;
    // awards: any[] = [];
    accumulatedPoints = 0;
    Utils = Utils;
    codes: CodeAwardInterface[] = [];
    user!: User;
    isLoggedIn = false;
    subs: Subscription[] = [];

    constructor( private modalService: BsModalService,
                 private userService: UserService,
                 public buyTicketService: BuyTicketService,
                 public candyService: CandyService,
                 public screenService: ScreenService ) { }

    ngOnInit(): void {
        this.subs.push( this.userService.isLoggedIn.subscribe( res => this.isLoggedIn = res ) );
        this.subs.push( this.userService.User.subscribe( user => {
            this.user = user;
            console.log(this.user);

            if ( this.source === 'choco' ) {
                this.accumulatedPoints = this.user.choco_promotional_data.total_points;
            }
        } ) );

        if ( this.type === 'ticket' ) {
            this.accumulatedPoints = this.buyTicketService.pointsChecked.ticket.total_points;
            if(this.isLoggedIn){
                this.getTicketAwards();
            }
        } else {

            if ( this.source === 'choco' ) {
                this.accumulatedPoints = this.user.choco_promotional_data.total_points;
            } else {
                this.accumulatedPoints = this.buyTicketService.pointsChecked.choco.total_points;
            }
            this.getChocoAwards();
        }
    }

    ngOnDestroy() {
        this.subs.forEach( s => s.unsubscribe() );
    }

    validateCode(): void {
        if ( this.customCode?.trim() ) {
            const codePromotion = this.customCode?.trim().toUpperCase();
            const movie_time_id = this.buyTicketService?.selectedOption?.movie_time;
            this.buyTicketService.validateCode( movie_time_id, this.customCode?.trim().toUpperCase() )
            .then( code => {
                this.customCode = '';
                if ( !this.codes.find( x => x.code_promotion === codePromotion ) ) {
                    this.codes.push( code );
                }
            } ).catch( error => Utils.showToast( error ) );
        }
    }

    openModalPromotionalCode() {
        this.modalService.show( ModalPromotionalCodeComponent, {
            initialState: {
                type: this.type,
                accumulatedPoints: this.accumulatedPoints
            },
            class: 'modal-promotional-code'
        } );
    }

    async getTicketAwards() {
        if ( !this.buyTicketService.ticketAwards.length ) {
            try {
                const params = {
                    movie_time_id: this.buyTicketService?.selectedOption?.movie_time
                };
                this.buyTicketService.ticketAwards = await this.buyTicketService.getTicketAwards( params );
                // this.awards = this.buyTicketService.ticketAwards;
            } catch ( e ) {
                console.log( e );
            }
        }
    }

    async getChocoAwards() {
        if ( !this.candyService.chocoAwards.length ) {
            try {
                this.candyService.chocoAwards = await this.buyTicketService.getChocoAwards();
            } catch ( e ) {
                console.log( e );
            }
        }
    }

    onChange() {
        this.buyTicketService.countTotals();
    }


    useCode( code: CodeAwardInterface ) {
        if ( this.buyTicketService.tickets_number + code.tickets_number <= MAX_TICKETS ) {
            if ( !this.buyTicketService.codes.find( x => x.code_promotion === code.code_promotion ) ) {
                this.buyTicketService.codes.push( { ...code, quantity: 1 } );
            }
        }

        this.buyTicketService.countTotals();
    }
}
