import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClaimParametersInterface } from '@interfaces/claim-parameters.interface';
import { DepartmentInterface, DistrictInterface, ProvinceInterface } from '@interfaces/ubigeo';
import { Subscription } from 'rxjs';
import { UbigeoService } from '@services/ubigeo.service';

@Component( {
    selector: 'app-step1',
    templateUrl: './step1.component.html',
    styleUrls: ['./step1.component.scss']
} )
export class Step1Component implements OnInit, OnChanges, OnDestroy {

    @Input() claimParameters!: ClaimParametersInterface;
    @Input() form!: FormGroup;
    @Output() step = new EventEmitter<number>();

    departments: DepartmentInterface[] = [];
    provinces: ProvinceInterface[] = [];
    districts: DistrictInterface[] = [];
    subs: Subscription[] = [];

    constructor( private fb: FormBuilder,
                 private ubigeoService: UbigeoService ) {
    }

    ngOnInit(): void {
        console.log( this.form.value );
        window.scroll( 0, 0 );

        this.subs.push( this.ubigeoService.getUbigeo().subscribe( dpts => this.departments = dpts ) );

        const { departments, province } = this.form.value;
        if ( departments ) {
            this.provinces = this.departments.find( x => x.id === departments )?.provinces || [];
        }

        if ( province ) {
            this.districts = this.provinces.find( x => x.id === province )?.districts || [];
        }

    }

    ngOnDestroy() {
        this.subs.forEach( s => s.unsubscribe() );
    }

    ngOnChanges( changes: SimpleChanges ) {
        console.log( changes );
    }

    onClickNext(): void {
        this.form.markAllAsTouched();
        if ( this.form.valid ) {
            this.step.emit( 1 );
        }
    }

    onChangeDepartment( department: DepartmentInterface ) {
        if ( department ) {
            this.provinces = department.provinces;
            this.districts = [];
            this.form.get( 'province' )?.reset();
            this.form.get( 'sede_district_id' )?.reset();
        }
    }

    onChangeProvince( province: ProvinceInterface ) {
        if ( province ) {
            this.districts = province.districts;
            this.form.get( 'sede_district_id' )?.reset();
        }
    }
}
