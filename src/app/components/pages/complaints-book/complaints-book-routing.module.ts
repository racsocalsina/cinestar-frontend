import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ComplaintsBookComponent } from '@components/pages/complaints-book/complaints-book.component';

const routes: Routes = [
    {
        path: '',
        component: ComplaintsBookComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComplaintsBookRoutingModule { }
