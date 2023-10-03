import { Component, Input, OnInit } from '@angular/core';
import { NotificationInterface } from '@interfaces/notification.interface';

@Component( {
    selector: 'app-message-notification',
    templateUrl: './message-notification.component.html',
    styleUrls: ['./message-notification.component.scss']
} )
export class MessageNotificationComponent implements OnInit {

    @Input() notification: NotificationInterface | null = {};

    constructor() { }

    ngOnInit(): void {
    }

}
