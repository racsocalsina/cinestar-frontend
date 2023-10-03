import { Component, OnInit } from '@angular/core';

@Component( {
    selector: 'app-corporate-sales',
    templateUrl: './corporate-sales.component.html',
    styleUrls: ['./corporate-sales.component.scss']
} )
export class CorporateSalesComponent implements OnInit {

    items: { icon: string; description: string }[] = [];

    constructor() { }

    ngOnInit(): void {
        this.setOptions();

    }

    setOptions(): void {
        this.items = [
            {
                icon: 'salas',
                description: `Alquiler de Salas <br> para Eventos`
            },
            {
                icon: 'pantallas',
                description: `Alquiler de <br> Pantallas`
            },
            {
                icon: 'funciones-privadas',
                description: `Funciones <br> Privadas`
            },
            {
                icon: 'banners',
                description: `Banners y cartelera <br> estática en el hall`
            },
            {
                icon: 'activacion',
                description: `Activación de <br> marca`
            }
        ];
    }
}
