import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Room } from '@models/room.model';
import { Seat } from '@interfaces/seat.interface';
import { BuyTicketService } from '@services/buy-ticket.service';
import { WebsocketService } from '@services/websocket.service';
import { MovieTime } from '@models/show-time.model';
import { Subscription } from 'rxjs';
import { Utils } from '@utils/utils';

@Component( {
    selector: 'app-room',
    templateUrl: './room.component.html',
    styleUrls: ['./room.component.scss']
} )
export class RoomComponent implements OnInit, OnDestroy {

    @Input() minSize = true;
    @Input() clickable = true;

    // graph = 'PANAASPSAAP/PAAAAAPAAAP/PAAAAAPAAAP/PAAAAAPAAAP/PAAAAAPAAAP/PAAAAAPAAAP/PAAAAAPAAAP/PAAAAAPAAAP/PAANAAPAAAP/PAAANAPAAAP/';
    graph = '';
    room!: Room;
    original_room!: Room;
    movieTime!: MovieTime | undefined;
    subs: Subscription[] = [];
    updating = false;
    constructor( private buyTicketService: BuyTicketService,
                 private wsService: WebsocketService ) {
    }

    ngOnInit(): void {

        this.movieTime = this.buyTicketService.movieTime;
        this.graph = this.buyTicketService.graph;
        this.createRoom( this.graph );
        console.log("INIT ",   this.room);
        this.subs.push( this.wsService.isConnected().subscribe( connected => {
            if ( connected ) {
                this.getGraph();
            }
        } ) );

        this.subs.push( this.buyTicketService.onError.asObservable().subscribe( () => {
            this.getGraph();
        } ) );

        this.joinRoom();
    }

    ngOnDestroy() {
        this.subs.forEach( s => s.unsubscribe() );
    }

    getGraph() {
        this.buyTicketService.getGraph().then( ( res: any ) => {
            console.log( res );
            const oldSeats = [...this.buyTicketService.seats];
            const seats: Seat[] = [];
            this.buyTicketService.seats = [];

            res.seats.forEach( ( x: any ) => {
                const s = oldSeats.find( y => y.index === x.index );
                if ( s ) {
                    seats.push( { ...s, icon: 'reservado.svg' } );
                }
            } );

            // this.buyTicketService.seats.filter( x => res.seats.find( ( y: any ) => y.index === x.index ) );
            console.log( this.buyTicketService.seats );
            this.buyTicketService.setSeats( seats );
            this.createRoom( res.graph );
        } );
    }

    createRoom( graph: string ) {
        this.room = new Room( graph );
        this.original_room = new Room( this.buyTicketService.original_graph );
        console.log( this.room );

        console.log( this.buyTicketService.seats );

        this.buyTicketService.seats.forEach( x => {
            const i = this.room.seats.findIndex( s => s.index === x.index );
            if ( i >= 0 ) {
                this.room.seats[ i ] = x;
            }
        } );

        this.original_room.seats.forEach( x => {
            const seat = this.original_room.seats[ x.index ];
            const i = this.room.seats.find( s => s.index === x.index );
            if ( seat ) {
                if (seat.value == 'S' && i?.value == 'O') {
                    seat.icon = 'disabled_chair_occuped.svg';
                    seat.cursor = false;
                    this.room.seats[ x.index ] = seat;
                }
            } 
        });

        setTimeout(() => {
            const div_columns:any = document.getElementById('columns');
            div_columns.style.gridTemplateColumns = `repeat(${this.room.columns}, 1fr)`;
        }, 100);

    }

    joinRoom() {
        this.subs.push(
            this.wsService.listen( 'change-room-status' )
            .subscribe( ( res: any ) => {
                if ( res.roomId === this.movieTime?.remote_funkey ) {
                    // console.log( res );
                    this.toggleSelectionfromEvent( res );
                }
            } )
        );

        this.wsService.emit( 'join-room', { roomId: this.movieTime?.remote_funkey }, ( res ) => {
            console.log( res );
        } );
    }

    toggleSelectionfromEvent( data: any ) {
        data.index = Number( data.index );
        data.action = Number( data.action );
        console.log( 'toggleSelectionfromEvent 1', data );
        if ( data.action === 0 || ( data.purchaseId !== this.buyTicketService.purchase?.id && !this.buyTicketService.seats.find( x => x.index === data.index ) ) ) {
            const seat = this.original_room.seats[ data.index ];
            console.log( 'toggleSelectionfromEvent 2', seat );
            if ( seat ) {
                if ( data.action ) {
                    if (seat.value == 'S') {
                        seat.icon = 'disabled_chair_occuped.svg';
                    } else {
                        seat.icon = 'ocupado.svg';
                    }
                    seat.cursor = false;
                } else {
                    let first_row = true;
                    if(seat.row != 0){
                        first_row = false;
                    }
                    seat.icon = this.room.getIcon( seat.value, first_row);
                    seat.cursor = true;
                }

                this.room.seats[ data.index ] = seat;
            }
        }
    }

    toggleSelection( seat: Seat, i: number ) {

        console.log("Value: " + seat.value);
        if ( !this.updating ) {
            this.updating = true;

            let action;

            if (seat.value == 'S') {
                action = seat.icon !== 'disabled_chair_reserved.svg';
            } else {
                action = seat.icon !== 'reservado.svg';
            }


            if ( action ) {
                if ( this.buyTicketService.seats.length < this.buyTicketService.tickets_number ) {
                    if (seat.value == 'S') {
                        seat.icon = 'disabled_chair_reserved.svg';
                    } else {
                        seat.icon = 'reservado.svg';
                    }

                }
            } else {
                let first_row = true;
                if(seat.row != 0){
                    first_row = false;
                }
                seat.icon = this.room.getIcon( seat.value, first_row );
                action = false;
            }

            this.emitEvent( i, action );
            this.updatePurchaseSeat( i, action, seat );

            setTimeout( () => {
                this.updating = false;
            }, 1000 );
        }


    }

    emitEvent( index: number, action: boolean ) {
        this.wsService.emit( 'update-room', {
            origin: 'web',
            roomId: this.movieTime?.remote_funkey,
            index, action
        } );
    }

    updatePurchaseSeat( index: number, status: boolean, seat: Seat ) {
        this.buyTicketService.updatePurchaseSeat( { index, status } )
        .then( ( { data }: any ) => {
            console.log( 'updatePurchaseSeat 1', data );
            console.log( 'updatePurchaseSeat 2', seat );
            if ( data ) {
                if ( data.status === false ) {
                    data = {
                        ...data,
                        action: data.status
                    };

                    this.toggleSelectionfromEvent( data );
                    this.emitEvent( data.index, data.status );

                } else {
                    this.buyTicketService.updateSeats( {
                        ...seat,
                        position: data.seat_name,
                        index
                    } );
                }

            } else {
                this.buyTicketService.updateSeats( seat );
            }

            console.log( this.buyTicketService.seats );


        } ).catch( error => {
            console.log( error );
            this.toggleSelectionfromEvent( { index, action: !status } );
            this.emitEvent( index, !status );
            this.buyTicketService.updateSeats( seat );
            Utils.showToast( error );
        } );

    }

    trackByFn( index: number, seat: Seat ) {
        return seat.position;
    }
}
