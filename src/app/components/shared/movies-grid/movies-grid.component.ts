import { Component, Input, OnInit } from '@angular/core';
import { Movie } from '@models/movie.model';

@Component({
    selector: 'app-movies-grid',
    templateUrl: './movies-grid.component.html',
    styleUrls: [ './movies-grid.component.scss' ]
})
export class MoviesGridComponent implements OnInit {

    @Input() movies: Movie[] = [];
    @Input() cinemaId?: number;

    constructor() {
    }

    ngOnInit(): void {
    }

    trackByFn(index: number, movie: Movie) {
        return movie.id;
    }

}
