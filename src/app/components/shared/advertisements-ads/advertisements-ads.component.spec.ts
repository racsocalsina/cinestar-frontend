import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvertisementsAdsComponent } from './advertisements-ads.component';

describe('AdvertisementsAdsComponent', () => {
  let component: AdvertisementsAdsComponent;
  let fixture: ComponentFixture<AdvertisementsAdsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvertisementsAdsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvertisementsAdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
