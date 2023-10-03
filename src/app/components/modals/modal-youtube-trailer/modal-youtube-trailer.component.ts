import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component( {
    selector: 'app-modal-youtube-trailer',
    templateUrl: './modal-youtube-trailer.component.html',
    styleUrls: ['./modal-youtube-trailer.component.scss']
} )
export class ModalYoutubeTrailerComponent implements OnInit {

    videoId!: string;
    youtubeVideo!: SafeResourceUrl;

    constructor( private sanitization: DomSanitizer ) { }

    ngOnInit(): void {
        this.youtubeVideo = this.sanitization.bypassSecurityTrustResourceUrl( `https://www.youtube.com/embed/${this.videoId}` );
    }

}
