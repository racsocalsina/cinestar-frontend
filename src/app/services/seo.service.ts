import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';

// tslint:disable-next-line:ban-types
// declare let gtag: Function;

@Injectable( {
    providedIn: 'root'
} )
export class SeoService {

    constructor( private title: Title,
                 private router: Router ) {
        // this.setGoogleAnalytics();

        this.router.events.subscribe( ( evt => {
            if ( evt instanceof NavigationEnd ) {
                this.createCanonicalURL();
            }
        } ) );
    }

    setTitle( pageTitle?: string ) {
        if ( pageTitle ) {
            this.title.setTitle( `${pageTitle} | Cinestar` );
        } else {
            this.title.setTitle( 'Cinestar' );
        }

        /*gtag( 'config', environment.google_analytics_id, {
         page_path: this.router.url,
         page_title: this.title.getTitle()
         } );*/
    }

    /* private setGoogleAnalytics() {
     const script = document.createElement( 'script' );
     script.type = 'text/javascript';
     script.src = `https://www.googletagmanager.com/gtag/js?id=${environment.google_analytics_id}`;
     document.head.appendChild( script );
     }*/

    private createCanonicalURL() {
        const links = document.head.getElementsByTagName( 'link' );

        for ( let i = 0; i <= links.length; i++ ) {
            if ( links[ i ] && links[ i ].rel === 'canonical' ) {
                links[ i ].remove();
            }
        }

        const link: HTMLLinkElement = document.createElement( 'link' );
        link.setAttribute( 'rel', 'canonical' );
        link.setAttribute( 'href', document.URL );
        document.head.appendChild( link );

    }
}
