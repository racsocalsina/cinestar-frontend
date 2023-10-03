import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import {
    GoogleLoginProvider,
    FacebookLoginProvider,
} from 'angularx-social-login';
import { environment } from '../environments/environment';

import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { GuardsModule } from './guards/guards.module';
import { ServicesModule } from '@services/services.module';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';

defineLocale( 'es', esLocale );

const config: SocketIoConfig = { url: environment.ws_url, options: { query: {token: environment.ws_token} } };


@NgModule( {
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserAnimationsModule,
        AppRoutingModule,
        HttpClientModule,
        SocialLoginModule,
        GuardsModule,
        ServicesModule.forRoot(),
        SocketIoModule.forRoot( config )
    ],
    providers: [
        {
            provide: 'SocialAuthServiceConfig',
            useValue: {
                autoLogin: false,
                providers: [
                    {
                        id: GoogleLoginProvider.PROVIDER_ID,
                        provider: new GoogleLoginProvider( environment.google_key ),
                    },
                    {
                        id: FacebookLoginProvider.PROVIDER_ID,
                        provider: new FacebookLoginProvider( environment.facebook_key ),
                    },
                ],
            } as SocialAuthServiceConfig,
        }
    ],
    bootstrap: [AppComponent]
} )
export class AppModule {}
