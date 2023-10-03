import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { NotificationInterface } from '../interfaces/notification.interface';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable( {
    providedIn: 'root'
} )
export class ContactService {

    private notificationSubject = new Subject<NotificationInterface>();

    constructor( private http: HttpClient ) { }

    showNotification( notification: NotificationInterface, timer = 3000 ): void {
        this.notificationSubject.next( notification );

        setTimeout( () => this.notificationSubject.next( { show: false } ), timer );
    }

    getNotification = () => this.notificationSubject.asObservable();

    sendContactUs(params: any): Promise<any> {
        const url = `${environment.api}/contacts`;
        return this.http.post( url, params ).toPromise();
    }

    sendJobApplications(params: any): Promise<any> {
        const url = `${environment.api}/job-applications`;
        return this.http.post( url, params ).toPromise();
    }
}
