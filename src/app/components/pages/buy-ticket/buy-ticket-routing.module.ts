import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BuyTicketComponent } from '@components/pages/buy-ticket/buy-ticket.component';
import { BuyTicketStep1Component } from '@components/pages/buy-ticket/buy-ticket-step1/buy-ticket-step1.component';
import { BuyTicketStep2Component } from '@components/pages/buy-ticket/buy-ticket-step2/buy-ticket-step2.component';
import { BuyTicketStep3Component } from '@components/pages/buy-ticket/buy-ticket-step3/buy-ticket-step3.component';
import { BuyTicketStep4Component } from '@components/pages/buy-ticket/buy-ticket-step4/buy-ticket-step4.component';

const routes: Routes = [
    {
        path: '',
        component: BuyTicketComponent,
        children: [
            {
                path: '1',
                component: BuyTicketStep1Component
            },
            {
                path: '2',
                component: BuyTicketStep2Component
            },
            {
                path: '3',
                component: BuyTicketStep3Component
            },
            {
                path: '4',
                component: BuyTicketStep4Component
            },
            {
                path: '**',
                redirectTo: '1'
            }
        ]
    }
];

@NgModule( {
    imports: [RouterModule.forChild( routes )],
    exports: [RouterModule]
} )
export class BuyTicketRoutingModule {}
