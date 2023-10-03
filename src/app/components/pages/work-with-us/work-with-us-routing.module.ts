import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkWithUsComponent } from '@components/pages/work-with-us/work-with-us.component';
import { ServicesModule } from '@services/services.module';

const routes: Routes = [
    {
        path: '',
        component: WorkWithUsComponent
    }
];

@NgModule( {
    imports: [
        RouterModule.forChild( routes ),
        ServicesModule
    ],
    exports: [RouterModule]
} )
export class WorkWithUsRoutingModule {}
