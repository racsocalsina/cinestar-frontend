import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './auth/login/login.component';
import { RecoverPasswordComponent } from './auth/recover-password/recover-password.component';
import { RestorePasswordComponent } from './auth/restore-password/restore-password.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DirectivesModule } from '@directives/directives.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgSelectModule } from '@ng-select/ng-select';
import { TicketDetailComponent } from './ticket-detail/ticket-detail.component';
import { ModalYoutubeTrailerComponent } from './modal-youtube-trailer/modal-youtube-trailer.component';
import { ModalCinemaDetailsComponent } from './modal-cinema-details/modal-cinema-details.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ModalPromotionalCodeComponent } from './modal-promotional-code/modal-promotional-code.component';
import { ModalResponsivePurchaseConfirmationComponent } from './modal-responsive-purchase-confirmation/modal-responsive-purchase-confirmation.component';
import { ModalDesktopPurchaseConfirmationComponent } from './modal-desktop-purchase-confirmation/modal-desktop-purchase-confirmation.component';
import { ModalDesktopChocolateriaConfirmationComponent } from '@modals/modal-desktop-chocolateria-confirmation/modal-desktop-chocolateria-confirmation.component';
import { ModalResponsiveChocolateriaConfirmationComponent } from '@modals/modal-responsive-chocolateria-confirmation/modal-responsive-chocolateria-confirmation.component';
import { SharedModule } from '../../shared.module';
import { ServicesModule } from '@services/services.module';
import { SharedComponentsModule } from '@components/shared/shared-components.module';
import { ModalPayConfirmationComponent } from './modal-pay-confirmation/modal-pay-confirmation.component';
import { ModalCancelBuyComponent } from './modal-cancel-buy/modal-cancel-buy.component';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { ModalPaymentDeniedComponent } from './modal-payment-denied/modal-payment-denied.component';
import { ModalTermsComponent } from './modal-terms/modal-terms.component';
import { ModalAddCreditCardComponent } from './modal-add-credit-card/modal-add-credit-card.component';
import { ModalCvvComponent } from './modal-cvv/modal-cvv.component';
import { ModalRewardsComponent } from './modal-rewards/modal-rewards.component';
import { ModalPointsExpireComponent } from './modal-points-expire/modal-points-expire.component';
import { ModalNotPromotionsComponent } from './modal-not-promotions/modal-not-promotions.component';
import { ModalHomeComponent } from './modal-home/modal-home.component';
import { AgmCoreModule } from '@agm/core'; 
import { environment } from 'environments/environment';
defineLocale( 'es', esLocale );


@NgModule( {
    declarations: [
        LoginComponent,
        RecoverPasswordComponent,
        RestorePasswordComponent,
        SignUpComponent,
        TicketDetailComponent,
        ModalYoutubeTrailerComponent,
        ModalCinemaDetailsComponent,
        ModalPromotionalCodeComponent,
        ModalResponsivePurchaseConfirmationComponent,
        ModalDesktopChocolateriaConfirmationComponent,
        ModalResponsiveChocolateriaConfirmationComponent,
        ModalDesktopPurchaseConfirmationComponent,
        ModalPayConfirmationComponent,
        ModalCancelBuyComponent,
        ModalPaymentDeniedComponent,
        ModalTermsComponent,
        ModalAddCreditCardComponent,
        ModalCvvComponent,
        ModalRewardsComponent,
        ModalPointsExpireComponent,
        ModalNotPromotionsComponent,
        ModalHomeComponent
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        ReactiveFormsModule,
        FormsModule,
        BsDatepickerModule.forRoot(),
        NgSelectModule,
        DirectivesModule,
        CarouselModule,
        AgmCoreModule.forRoot( {
         apiKey: environment.google_maps_api_key
         } ),
        PerfectScrollbarModule,
        SharedModule,
        ServicesModule,
        SharedComponentsModule
    ],

} )
export class ModalsModule {}
