import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { BannerInterface } from '@interfaces/banner.interface';
import { StorageUtils } from '@utils/storage.utils';
import { environment } from '../../environments/environment';

@Injectable( {
    providedIn: 'root'
} )
export class BannersService extends StorageUtils {

    private _bannersSubject = new BehaviorSubject<BannerInterface[]>( [] );
    private _banners: BannerInterface[] = [];

    constructor( private http: HttpClient ) {
        super();
    }

    private fetchBanners( type: string ) {
        if ( this.getLocalStorage( type ) ) {
            this._banners = JSON.parse( this.getLocalStorage( type ) );
            this._bannersSubject.next( this._banners );
        }

        const bannerType = type === 'banners_desktop' ? 'web' : 'responsive';

        const url = `${environment.api}/get-banners`;
        this.http.get( url ).subscribe( ( res: any ) => {
            this._banners = res.data.filter( ( x: any ) => x.type === bannerType );
            this._bannersSubject.next( this._banners );
            this.setLocalStorage( type, JSON.stringify( this._banners ) );
        } );
    }

    getBanners( type: string ) {
        this.fetchBanners( type );
        return this._bannersSubject.asObservable();
    }
}
