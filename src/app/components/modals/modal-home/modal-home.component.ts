import {Component, OnInit} from '@angular/core';
import {BsModalRef} from "ngx-bootstrap/modal";
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-modal-home',
    templateUrl: './modal-home.component.html',
    styleUrls: ['./modal-home.component.scss']
})
export class ModalHomeComponent implements OnInit {
    image: any;
    movie_id: any;
    popup_title: any;
    button_name: any;
    movie_title: any;

    constructor( public bsModalRef: BsModalRef, private router: Router,private route: ActivatedRoute,) { }

    ngOnInit(): void {
    }

    buy(): void {
        let route = `/peliculas/${this.movie_id}`;

        this.router.navigate( [route] ).finally();
        this.bsModalRef.hide();
    }

}
