import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';
import {BannerInterface} from '@interfaces/banner.interface';
import {StorageUtils} from '@utils/storage.utils';
import {environment} from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ContentService extends StorageUtils {


    constructor(private http: HttpClient) {
        super();
    }

    getcontent(view: string) {
        const url = `${environment.api}/contents/${view}`;
        return this.http.get(url).toPromise();
    }
}
