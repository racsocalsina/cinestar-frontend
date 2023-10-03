import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChocolateriaComponent } from '@components/pages/chocolateria/chocolateria.component';
import { IndexChocolateriaComponent } from '@components/pages/chocolateria/index/index-chocolateria.component';
import { PaymentChocolateriaComponent } from '@components/pages/chocolateria/payment/payment-chocolateria.component';
import { AuthGuard } from '../../../guards/auth.guard';

const routes: Routes = [
    {
        path: '',
        component: ChocolateriaComponent,
        children: [
            {
                path: '',
                component: IndexChocolateriaComponent
            },
            {
                path: 'pagar',
                component: PaymentChocolateriaComponent,
                // canActivate: [AuthGuard]
            }
        ]
    }
];

@NgModule( {
    imports: [RouterModule.forChild( routes )],
    exports: [RouterModule]
} )
export class ChocolateriaRoutingModule {}
