import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CorporateComponent } from '@components/pages/corporate/corporate.component';

const routes: Routes = [{
    path: '',
    component: CorporateComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CorporateRoutingModule { }
