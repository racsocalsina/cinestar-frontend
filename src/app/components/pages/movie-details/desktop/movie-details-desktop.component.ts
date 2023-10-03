import { Component, Input, OnInit } from '@angular/core';
import { Utils } from '@utils/utils';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ModalYoutubeTrailerComponent } from '@components/modals/modal-youtube-trailer/modal-youtube-trailer.component';
import { Movie } from '@models/movie.model';

@Component( {
    selector: 'app-movie-details-desktop',
    templateUrl: './movie-details-desktop.component.html',
    styleUrls: ['../../movies/movies.component.scss', './movie-details-desktop.component.scss']
} )
export class MovieDetailsDesktopComponent implements OnInit {

    Utils = Utils;
    @Input() movie!: Movie;

    constructor( private router: Router,
                 private route: ActivatedRoute,
                 private modalService: BsModalService ) { }

    ngOnInit(): void {
        console.log( this.movie );
    }

    back(): void {
        const { cinema } = this.route.snapshot.params;

        if ( cinema ) {
            this.router.navigateByUrl( `/cines/${cinema}/peliculas` ).finally();
        } else {
            const queryParams: any = {};
            if ( this.movie.is_release ) {
                queryParams.tipo = 'proximos_estrenos';
            }
            this.router.navigate( ['/peliculas'], { queryParams } ).finally();
        }
    }

    showTrailerModal( videoId: any ): void {
        this.modalService.show( ModalYoutubeTrailerComponent, {
            initialState: { videoId },
            class: 'modal-youtube-trailer',
        } );
    }
}
