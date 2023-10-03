import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-advertisements-ads',
  templateUrl: './advertisements-ads.component.html',
  styleUrls: ['./advertisements-ads.component.scss']
})
export class AdvertisementsAdsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
      setTimeout(() => {
          try {
              // @ts-ignore
              (window["adsbygoogle"] = window["adsbygoogle"] || []).Push({});
          } catch (e) {
              console.error(e);
          }
      }, 3000);
  }

}
