import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable( {
    providedIn: 'root'
} )
export class WebsocketService {

    private _isConnected = new Subject<boolean>();

    constructor( private socket: Socket ) {

        this.listen( 'connect' ).subscribe( () => {
            console.log( 'CONECTADO al servidor de sockets' );
            this._isConnected.next( true );
        } );

        this.socket.on( 'disconnect', () => {
            console.log( 'DESCONECTADO de servidor de sockets' );
            this._isConnected.next( false );
        } );
    }

    isConnected() {
        return this._isConnected.asObservable();
    }

    listen( event: string ) {
        return this.socket.fromEvent( event );
    }

    emit( event: string, payload?: any, callback?: ( res: any ) => void ) {
        this.socket.emit( event, payload, callback );
    }
}
