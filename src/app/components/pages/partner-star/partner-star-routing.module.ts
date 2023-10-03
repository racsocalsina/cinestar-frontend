import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PartnerStarComponent } from '@components/pages/partner-star/partner-star.component';

const routes: Routes = [{
    path: '',
    component: PartnerStarComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartnerStarRoutingModule { }
