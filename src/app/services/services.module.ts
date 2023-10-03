import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ContactService } from './contact.service';
import { MoviesService } from './movies.service';
import { CinemaService } from '@services/cinema.service';
import { AuthService } from '@services/auth.service';
import { AuthInterceptorService } from '../interceptors/auth-interceptor.service';
import { UserService } from '@services/user.service';
import { GeneralService } from '@services/general.service';
import { ClaimService } from './claim.service';
import { AuthModalsService } from '@services/auth-modals.service';
import { WebsocketService } from '@services/websocket.service';
import { BuyTicketService } from '@services/buy-ticket.service';
import { SeoService } from '@services/seo.service';
import { CandyService } from '@services/candy.service';
import { PromosService } from '@services/promos.service';
import { BannersService } from '@services/banners.service';
import { CreditCardService } from '@services/credit-card.service';


@NgModule( {
    declarations: [],
    imports: [
        CommonModule,
        HttpClientModule,
    ],
    providers: [
        ContactService,
        CinemaService,
        AuthService,
        AuthModalsService,
        ClaimService,
        PromosService,
        BannersService,
        {
            provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true
        }
    ],
    exports: [
        HttpClientModule
    ]
} )
export class ServicesModule {
    static forRoot(): ModuleWithProviders<any> {
        return {
            ngModule: ServicesModule,
            providers: [
                WebsocketService,
                MoviesService,
                BuyTicketService,
                GeneralService,
                SeoService,
                UserService,
                CandyService,
                CreditCardService
            ]
        };
    }
}
