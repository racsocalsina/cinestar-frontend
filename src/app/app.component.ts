import { Component, HostListener, OnInit } from '@angular/core';
import { NgSelectConfig } from '@ng-select/ng-select';
import { ScreenService } from '@services/screen.service';
import { WebsocketService } from '@services/websocket.service';
import { v4 as uuidv4 } from 'uuid';
import { StorageUtils } from '@utils/storage.utils';

@Component( {
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
} )
export class AppComponent extends StorageUtils implements OnInit {

    title = 'cinestar-frontend';

    constructor( private config: NgSelectConfig,
                 private webSocketService: WebsocketService,
                 private  screenService: ScreenService ) {
        super();
    }

    ngOnInit(): void {
        this.config.clearAllText = 'Limpiar';
        this.config.notFoundText = 'No hay datos';
        this.config.placeholder = 'Seleccionar';
        this.config.addTagText = 'Agregar';

        this.setSessionPayment();
    }

    @HostListener( 'window:resize', ['$event'] )
    onResize( event: any ) {
        this.screenService.width = event.target.innerWidth;
    }

    setSessionPayment() {
        const uuid = uuidv4();
        this.setSessionStorage( 'deviceSessionId', uuid );

        const script = document.createElement( 'script' );
        script.type = 'text/javascript';
        script.src = `https://maf.pagosonline.net/ws/fp/tags.js?id=${uuid}80200`;
        document.head.appendChild( script );

        const noscript = document.createElement( 'noscript' );
        const iframe = document.createElement( 'iframe' );
        iframe.width = '100px';
        iframe.height = '100px';
        iframe.className = 'pay-iframe';
        iframe.src = `https://maf.pagosonline.net/ws/fp/tags.js?id=${uuid}80200`;
        noscript.appendChild( iframe );
        document.head.appendChild( noscript );
    }

}
