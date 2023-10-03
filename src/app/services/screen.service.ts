import { Injectable } from '@angular/core';

@Injectable( {
    providedIn: 'root'
} )
export class ScreenService {

    widthScreen = window.innerWidth;

    constructor() {}

    get isResponsive(): boolean {
        return this.widthScreen < 768;
    }

    set width( width: number ) {
        this.widthScreen = width;
    }
}
