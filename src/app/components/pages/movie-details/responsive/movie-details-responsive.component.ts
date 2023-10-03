import { Component, Input, OnInit } from '@angular/core';
import { Utils } from '@utils/utils';
import { Movie } from '@models/movie.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component( {
    selector: 'app-movie-details-responsive',
    templateUrl: './movie-details-responsive.component.html',
    styleUrls: ['./movie-details-responsive.component.scss']
} )
export class MovieDetailsResponsiveComponent implements OnInit {

    activeTab = 'first';
    Utils = Utils;
    @Input() movie!: Movie;
    youtubeVideo!: SafeResourceUrl;

    constructor( private sanitization: DomSanitizer ) { }

    ngOnInit(): void {
        this.youtubeVideo = this.sanitization.bypassSecurityTrustResourceUrl( `https://www.youtube.com/embed/${Utils.getYouTubeId( this.movie.url_trailer )}` );
    }

    showTab( tab: string ): void {
        this.activeTab = tab;

        const first = document.getElementById( 'first' );
        const second = document.getElementById( 'second' );

        if ( first && second ) {
            if ( tab === 'first' ) {
                first.classList.add( 'active' );
                second.classList.remove( 'active' );
            } else {
                first.classList.remove( 'active' );
                second.classList.add( 'active' );
            }
        }


    }
}
