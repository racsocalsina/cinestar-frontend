import { Component, OnInit } from '@angular/core';
import { Movie } from '@models/movie.model';
import { MoviesService } from '@services/movies.service';

@Component( {
    selector: 'app-next-releases',
    templateUrl: './next-releases.component.html',
    styleUrls: ['./next-releases.component.scss']
} )
export class NextReleasesComponent implements OnInit {

    movies: Movie[] = [];
    isLoading = false;

    constructor( private moviesService: MoviesService ) { }

    ngOnInit(): void {
        this.getMovies();
    }

    getMovies(): void {
        this.isLoading = true;

        this.moviesService.fetchNextReleases()
        .then( movies => this.movies = movies )
        .catch( console.log )
        .finally( ( () => this.isLoading = false ) );
    }

}
