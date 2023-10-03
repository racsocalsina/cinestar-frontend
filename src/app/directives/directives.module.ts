import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlphaNumericDirective } from '@directives/alpha-numeric.directive';


@NgModule( {
    declarations: [
        AlphaNumericDirective
    ],
    exports: [
        AlphaNumericDirective
    ],
    imports: [
        CommonModule
    ]
} )
export class DirectivesModule {}
