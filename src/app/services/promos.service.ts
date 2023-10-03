import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {BehaviorSubject, Observable} from "rxjs";
import {Promotion} from "@models/promotion.model";
import {HttpClient} from "@angular/common/http";
import {StorageUtils} from "@utils/storage.utils";

@Injectable({
    providedIn: 'root'
})
export class PromosService extends StorageUtils {
    private _promotionsSubject = new BehaviorSubject<Promotion[]>([]);
    private _promotions: Promotion[] = [];

    constructor(private http: HttpClient) {
        super();
    }

    fetchPromotions(getLocaStorage = true) {

        if (getLocaStorage && this.getLocalStorage('promotions')) {
            this._promotions = JSON.parse(this.getLocalStorage('promotions')).map((x: Promotion) => new Promotion(x));
            this._promotionsSubject.next(this._promotions);
        }

        let url = `${environment.api}/partners/promotions`;
        this.http.get(url).subscribe((res: any) => {

            this._promotions = res.data.map((x: Promotion) => new Promotion(x));

            this._promotionsSubject.next(this._promotions);
            this.setLocalStorage('promotions', JSON.stringify(this._promotions));
        });

    }

    getPromotions(): Observable<Promotion[]> {

        if (!this._promotions.length) {
            this.fetchPromotions();
        }
        return this._promotionsSubject.asObservable();
    }


}
