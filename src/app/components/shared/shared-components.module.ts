import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderHomeComponent } from './header-home/header-home.component';
import { BannersComponent } from './banners/banners.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { FooterComponent } from './footer/footer.component';
import { MovieCardComponent } from './movie-card/movie-card.component';
import { ResponsiveMenuComponent } from './responsive-menu/responsive-menu.component';
import { MessageNotificationComponent } from './message-notification/message-notification.component';
import { ControlMessagesComponent } from '@components/shared/control-messages/control-messages.component';
import { HeaderMoviesComponent } from './header-movies/header-movies.component';
import { FloatingMovieSummaryComponent } from './floating-movie-summary/floating-movie-summary.component';
import { MoviesGridComponent } from './movies-grid/movies-grid.component';
import { HeaderMovieDetailsResponsiveComponent } from '@components/shared/header-movie-details-responsive/header-movie-details-responsive.component';
import { CarouselBannerComponent } from './carousel-banner/carousel-banner.component';
import { SelectCinemaComponent } from './select-cinema/select-cinema.component';
import { FloatingProfileComponent } from './floating-profile/floating-profile.component';
import { FloatingShoppingComponent } from './floating-shopping/floating-shopping.component';
import { HeaderBuyTicketComponent } from './header-buy-ticket/header-buy-ticket.component';
import { TimeRemainingComponent } from './time-remaining/time-remaining.component';
import { RatesComponent } from './rates/rates.component';
import { QuantityPickerComponent } from './quantity-picker/quantity-picker.component';
import { SelectSeatComponent } from './select-seat/select-seat.component';
import { RoomComponent } from './room/room.component';
import { SharedModule } from '../../shared.module';
import { PaymentComponent } from './payment/payment.component';
import { PromoCodesComponent } from './promo-codes/promo-codes.component';
import { CandyCardComponent } from './candy-card/candy-card.component';
import { HeaderChocolateriaComponent } from './header-chocolateria/header-chocolateria.component';
import { FormUpdateProfileComponent } from './form-update-profile/form-update-profile.component';
import { FormUpdatePasswordComponent } from './form-update-password/form-update-password.component';
import { ProfileListCreditCardComponent } from './profile-list-credit-card/profile-list-credit-card.component';
import { ProfileAddCreditCardComponent } from './profile-add-credit-card/profile-add-credit-card.component';
import { CreditCardsListComponent } from './credit-cards-list/credit-cards-list.component';
import { FormAddCreditCardComponent } from './form-add-credit-card/form-add-credit-card.component';
import { CinemasListComponent } from './cinemas-list/cinemas-list.component';
import { PromotionsProfileComponent } from './promotions-profile/promotions-profile.component';
import { AdvertisementsAdsComponent } from './advertisements-ads/advertisements-ads.component';

/*import { defineLocale } from 'ngx-bootstrap/chronos';
 import { esLocale } from 'ngx-bootstrap/locale';
 defineLocale( 'es', esLocale );*/

@NgModule( {
    declarations: [
        HeaderHomeComponent,
        BannersComponent,
        FooterComponent,
        MovieCardComponent,
        ResponsiveMenuComponent,
        MessageNotificationComponent,
        ControlMessagesComponent,
        HeaderMoviesComponent,
        FloatingMovieSummaryComponent,
        MoviesGridComponent,
        HeaderMovieDetailsResponsiveComponent,
        CarouselBannerComponent,
        SelectCinemaComponent,
        FloatingProfileComponent,
        FloatingShoppingComponent,
        HeaderBuyTicketComponent,
        TimeRemainingComponent,
        RatesComponent,
        QuantityPickerComponent,
        SelectSeatComponent,
        RoomComponent,
        PaymentComponent,
        PromoCodesComponent,
        CandyCardComponent,
        HeaderChocolateriaComponent,
        FormUpdateProfileComponent,
        FormUpdatePasswordComponent,
        ProfileListCreditCardComponent,
        ProfileAddCreditCardComponent,
        CreditCardsListComponent,
        FormAddCreditCardComponent,
        CinemasListComponent,
        PromotionsProfileComponent,
        AdvertisementsAdsComponent
    ],
    imports: [
        CommonModule,
        CarouselModule.forRoot(),
        SharedModule
    ],
    exports: [
        HeaderHomeComponent,
        BannersComponent,
        FooterComponent,
        MovieCardComponent,
        ResponsiveMenuComponent,
        MessageNotificationComponent,
        ControlMessagesComponent,
        HeaderMoviesComponent,
        FloatingMovieSummaryComponent,
        MoviesGridComponent,
        HeaderMovieDetailsResponsiveComponent,
        CarouselBannerComponent,
        SelectCinemaComponent,
        FloatingProfileComponent,
        FloatingShoppingComponent,
        HeaderBuyTicketComponent,
        TimeRemainingComponent,
        RatesComponent,
        QuantityPickerComponent,
        SelectSeatComponent,
        RoomComponent,
        PaymentComponent,
        PromoCodesComponent,
        CandyCardComponent,
        HeaderChocolateriaComponent,
        CreditCardsListComponent,
        FormAddCreditCardComponent,
        CinemasListComponent,
        AdvertisementsAdsComponent
    ]
} )
export class SharedComponentsModule {
}
