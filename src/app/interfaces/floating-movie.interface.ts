import { Movie } from '@models/movie.model';

export interface FloatingMovieInterface {
    movie: Movie;
    cinemaId?: number;
}
