import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DocumentTypeInterface } from '@interfaces/document-type.interface';
import { Documents } from '@utils/enums';
import { Subscription } from 'rxjs';
import { CustomValidators } from '@utils/validators.utils';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { User } from '@models/user.model';
import { Utils } from '@utils/utils';
import { FormUtils } from '@utils/form.utils';
import { UserService } from '@services/user.service';
import { GeneralService } from '@services/general.service';
import { DepartmentInterface } from '@interfaces/ubigeo';
import { UbigeoService } from '@services/ubigeo.service';

@Component( {
    selector: 'app-form-update-profile',
    templateUrl: './form-update-profile.component.html',
    styleUrls: ['./form-update-profile.component.scss']
} )
export class FormUpdateProfileComponent implements OnInit, OnDestroy {

    @Output() onBack = new EventEmitter();
    @Input() user!: User;
    locale = 'es';
    form!: FormGroup;
    typeDocuments: DocumentTypeInterface[] = [];
    Documents = Documents;
    isLoading?: boolean;
    error?: string;
    Utils = Utils;
    subs: Subscription[] = [];
    bsConfig: Partial<BsDatepickerConfig> = {
        containerClass: 'theme-red custom-auth-calendar',
        adaptivePosition: true,
        maxDate: Utils.minDate()
    };

    departments: DepartmentInterface[] = [];

    constructor( private fb: FormBuilder,
                 private localeService: BsLocaleService,
                 private generalService: GeneralService,
                 private userService: UserService,
                 private ubigeoService: UbigeoService ) {
        this.localeService.use( this.locale );
    }

    ngOnInit(): void {
        this.subs.push( this.generalService.getDocumentTypes().subscribe( types => this.typeDocuments = types ) );

        this.subs.push( this.ubigeoService.getUbigeo().subscribe( dpts => this.departments = dpts ) );

        this.initForm();
    }

    ngOnDestroy() {
        this.subs.forEach( s => s.unsubscribe() );
    }

    private initForm(): void {
        this.form = this.fb.group( {
            document_type: [
                {
                    value: this.user.document_type,
                    disabled: true
                }, Validators.required
            ],
            document_number: [
                {
                    value: this.user.document_number,
                    disabled: true
                }, null
            ],
            birthdate: [
                {
                    value: Utils.getStringUTCDate( { date: this.user.birthdate, format: 'DD-MM-YYYY' } ),
                    disabled: true
                }, Validators.required
            ],
            // birthdate: [this.user.birthdate, Validators.required],
            name: [this.user.name, [Validators.required, Validators.pattern( /^[a-zA-ZáéíóúÁÉÍÓÚÑñ ]*$/ )]],
            lastname: [this.user.lastname, [Validators.required, Validators.pattern( /^[a-zA-ZáéíóúÁÉÍÓÚÑñ ]*$/ )]],
            cellphone: [
                {
                    value: this.user.cellphone,
                    disabled: false
                }, [
                    Validators.required,
                    Validators.pattern( /^[0-9]*$/ ),
                    Validators.minLength( 9 ),
                    Validators.maxLength( 9 ),
                ]
            ],
            email: [
                {
                    value: this.user.email,
                    disabled: false
                }, [Validators.required, CustomValidators.isValidEmail]
            ],
            department_id: [{
                value: this.user.department?.id,
                disabled: false
            }, Validators.required],
        } );

        this.onChangeSelect();
    }

    onChangeSelect(): void {
        const type = this.form.get( 'document_type' )?.value;
        const control = this.form.get( 'document_number' );

        if ( control ) {
            FormUtils.validateDocumentType( type, control );
        }
    }

    update() {
        this.form.markAllAsTouched();
        this.error = undefined;

        if ( this.form.valid ) {
            const params = {
                ...this.form.getRawValue(),
                // birthdate: Utils.getStringDate( { date: this.form.value.birthdate, format: 'YYYY-MM-DD' } )
            };

            /*if ( new Date( params.birthdate ).toString() === 'Invalid Date' ) {
             params.birthdate = this.user.birthdate;
             }*/
            params.birthdate = this.user.birthdate;

            this.isLoading = true;

            this.userService.updateProfile( params ).then(() => {
                this.user.department = this.departments.find(x => x.id == this.form.get( 'department_id' )?.value)
                this.user = new User({ ...this.user, ...params });
                console.log(this.user);
                this.userService.setUser( this.user );
            } )
            .catch( error => this.error = error )
            .finally( () => this.isLoading = false );
        }
    }

}
