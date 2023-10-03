import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if ( environment.production ) {
    enableProdMode();
}

if ( !environment.debug ) {
    console.log( '%cSi estás leyendo este mensaje es que eres demasiado inteligente!', 'color: #bada55; font-weight: bold; font-size: 16px' );

    window.console.log = () => { };
    window.console.info = () => { };
    window.console.error = () => { };
    window.console.table = () => { };
    window.console.warn = () => { };
}

platformBrowserDynamic().bootstrapModule( AppModule )
.catch( err => console.error( err ) );
