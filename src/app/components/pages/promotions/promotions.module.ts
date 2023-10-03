import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PromotionsRoutingModule } from './promotions-routing.module';
import { PromotionsComponent } from './promotions.component';
import {SharedModule} from "../../../shared.module";
import {SharedComponentsModule} from "@components/shared/shared-components.module";
import {ServicesModule} from "@services/services.module";
import { DetailComponent } from './detail/detail.component';


@NgModule({
  declarations: [PromotionsComponent, DetailComponent],
  imports: [
    CommonModule,
    PromotionsRoutingModule,
      SharedModule,
      SharedComponentsModule,
      ServicesModule
  ]
})
export class PromotionsModule { }
