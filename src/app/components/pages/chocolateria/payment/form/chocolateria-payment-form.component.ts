import {
    AfterViewChecked,
    ChangeDetectorRef,
    Component,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges
} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CreditCards, Documents, Voucher} from '@utils/enums';
import {CustomValidators} from '@utils/validators.utils';
import {DocumentTypeInterface} from '@interfaces/document-type.interface';
import {Subscription} from 'rxjs';
import {GeneralService} from '@services/general.service';
import {FormUtils} from '@utils/form.utils';
import {User} from '@models/user.model';
import {UserService} from '@services/user.service';
import {BuyTicketService} from '@services/buy-ticket.service';
import {ModalTermsComponent} from '@modals/modal-terms/modal-terms.component';
import {BsModalService} from 'ngx-bootstrap/modal';
import {CandyService} from '@services/candy.service';
import {Utils} from '@utils/utils';
import {CreditCardService} from '@services/credit-card.service';
import {ModalAddCreditCardComponent} from '@modals/modal-add-credit-card/modal-add-credit-card.component';
import {CreditCard} from '@models/credit-card.model';
import {StorageUtils} from '@utils/storage.utils';
import {ModalCvvComponent} from '@modals/modal-cvv/modal-cvv.component';
import {ModalPayConfirmationComponent} from '@modals/modal-pay-confirmation/modal-pay-confirmation.component';
import {Router} from '@angular/router';
import {CreditCardInfoInterface} from "@interfaces/credit-card-info.interface";
import {environment} from "../../../../../../environments/environment";
import {ScreenService} from "@services/screen.service";
import * as moment from 'moment';
import * as aes from 'crypto-js/aes';
import * as encHex from 'crypto-js/enc-hex'
import * as padZeroPadding from 'crypto-js/pad-zeropadding'

@Component({
    selector: 'app-chocolateria-payment-form',
    templateUrl: './chocolateria-payment-form.component.html',
    styleUrls: ['./chocolateria-payment-form.component.scss']
})
export class ChocolateriaPaymentFormComponent extends StorageUtils implements OnInit, OnDestroy, AfterViewChecked, OnChanges {
    @Input() isLoggedIn: boolean | any;
    form!: FormGroup;
    Documents = Documents;
    Voucher = Voucher;
    typeDocuments: DocumentTypeInterface[] = [];
    subs: Subscription[] = [];
    user!: User;
    selectedCard!: CreditCard | undefined;
    isLoading!: boolean;
    creditCardInfo!: CreditCardInfoInterface;
    creditCards = CreditCards;
    cvvText: string = "CVV";
    showModalTerm = false;

    constructor(private fb: FormBuilder,
                private router: Router,
                private changeDetector: ChangeDetectorRef,
                private modalService: BsModalService,
                private userService: UserService,
                private buyTicketService: BuyTicketService,
                public candyService: CandyService,
                public creditCardService: CreditCardService,
                private generalService: GeneralService,
                public screenService: ScreenService) {
        super();
    }

    ngOnInit(): void {
        this.subs.push(this.generalService.getDocumentTypes().subscribe(types => this.typeDocuments = types));
        if (this.isLoggedIn) {
            this.subs.push(this.userService.User.subscribe(user => this.user = user));
        }

        this.subs.push(this.buyTicketService.initNiubiz.asObservable().subscribe(() => this.pay()));

        this.initForm();

        this.subs.push(this.creditCardService._creditCardDeleteSubject.subscribe(res => {
            console.log("UPDATE CARD", res);
            if (res && this.form.value.token && res == this.form.value.token) {
                this.selectedCard = undefined;
                this.form.get('token')?.setValue(null);
            }
        }))
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.isLoggedIn) {
            if (this.isLoggedIn && this.form) {
                this.form.removeControl('payment_method');
                this.form.removeControl('number');
                this.form.removeControl('expiration_date');
                this.form.removeControl('full_name');
                this.form.removeControl('security_code');
            }
        }

    }

    ngAfterViewChecked() {
        this.changeDetector.detectChanges();
    }

    ngOnDestroy() {
        this.subs.forEach(s => s.unsubscribe());
    }

    initForm() {
        const config: any = {
            payment_method: [null, Validators.required],
            number: [null, [Validators.required, Validators.minLength(16)]],
            expiration_date: [null, [Validators.required, Validators.minLength(4)]],
            full_name: [null, Validators.required],
            security_code: [null, Validators.required],
            document_type: [this.isLoggedIn ? this.user.document_type : Documents.DNI, Validators.required],
            document_number: [this.isLoggedIn ? this.user.document_number : null, Validators.required],
            name: [this.isLoggedIn ? this.user.name : null, Validators.required],
            lastname: [this.isLoggedIn ? this.user.lastname : null, Validators.required],
            email: [this.isLoggedIn ? this.user.email : null, [Validators.required, CustomValidators.isValidEmail]],
            voucher_type: [Voucher.Boleta, Validators.required],
            checkTerms: [null, Validators.required],
            token: [null, Validators.required]
        };
        if (this.isLoggedIn) {
            delete config.payment_method;
            delete config.number;
            delete config.expiration_date;
            delete config.full_name;
            delete config.security_code;
        }
        this.form = this.fb.group(config);

    }

    pay() {
        if (!this.isLoggedIn) {
            this.changeValidator('token', this.form, false);
        }
        this.form.markAllAsTouched();
        
        if (this.form.valid && this.form.get('checkTerms')?.value) {
            let date = moment(this.candyService.pickup_date).format('YYYY-MM-DD');
            let params = {
                ...this.form.value,
                purchase_id: this.candyService.purchase?.id,
                pickup_date: date,
                device_session_id: this.getSessionStorage('deviceSessionId'),
                cc_data: {
                    "token": this.form.value.token?? null,
                    "security_code": this.form.value.security_code?? null,
                    "number": this.form.value.number?? null,
                    "payment_method": this.form.value.payment_method?? null,
                    "expiration_date":  this.form.value.expiration_date ? this.form.value.expiration_date.substring(2, 4) + '/' + this.form.value.expiration_date.substring(0, 2) : null,
                    "full_name": this.form.value.full_name?? null,
                }
            };
            delete params.security_code;
            delete params.number;
            delete params.payment_method;
            delete params.expiration_date;
            delete params.full_name;
            delete params.checkTerms;

            if (this.isLoggedIn) {
                const modal = this.modalService.show(ModalCvvComponent, {
                    class: 'modal-cvv',
                    initialState: {
                        card: this.selectedCard
                    }
                });
                modal.content?.dataEvt.subscribe((security_code: string) => {
                    params.cc_data.security_code = security_code;
                    this.nexPay(params);
                });

            }else{
                this.nexPay(params);
            }
        }
    }

    nexPay(params: any){

        let encryptedData = JSON.stringify(params);
        let key = encHex.parse(environment.encryptionSecretKey);
        let iv =  encHex.parse(environment.encryptionInitializationVector);
        let encrypted = aes.encrypt(encryptedData, key, {iv:iv, padding:padZeroPadding}).toString();

        this.buyTicketService.$loading.next(true);
        this.isLoading = true;

        this.buyTicketService.pay(encrypted)
        .then((res: any) => {
            this.buyTicketService.reset();
            this.payConfirmationModal(res.data);
            return this.userService.getProfile();
        })
        .then(() => {
            this.router.navigateByUrl('/chocolateria');
        })
        .catch(error => {
            Utils.showToast(error);
        })
        .finally(() => {
            this.buyTicketService.$loading.next(false);
            this.isLoading = false;
        });
    }

    payConfirmationModal(data: any): void {
        this.modalService.show(ModalPayConfirmationComponent, {
            initialState: {data},
            class: 'modal-pay-confirmation',
            backdrop: 'static',
            keyboard: false
        });
    }

    onDocumentTypeChange() {
        const type = this.form.get('document_type')?.value;
        const control = this.form.get('document_number');

        if (control) {
            FormUtils.validateDocumentType(type, control);
        }
    }

    onVoucherTypeChange() {

        const {voucher_type} = this.form.value;

        if (voucher_type === Voucher.Factura) {
            this.form.addControl('ruc', new FormControl(null, [
                Validators.required,
                Validators.minLength(11),
                Validators.maxLength(11),
                Validators.pattern(/^[0-9]*$/)
            ]));
            this.form.addControl('business_name', new FormControl(
                null, Validators.required));
            this.form.addControl('address', new FormControl(null));
            this.form.addControl('phone', new FormControl(null, Validators.minLength(9)));
        } else {
            this.form.removeControl('ruc');
            this.form.removeControl('business_name');
            this.form.removeControl('address');
            this.form.removeControl('phone');
        }

    }

    showTerms() {
        if (!this.showModalTerm) {
            this.showModalTerm = true;
            const modal = this.modalService.show(ModalTermsComponent, {
                class: 'modal-terms'
            });

            modal.content?.onAccept.subscribe(() => {
                this.form.get('checkTerms')?.setValue(true);
                this.showModalTerm = false;
            });

            modal.content?.onClose.subscribe((status: any) => {
                if (status) {
                    this.showModalTerm = false;
                }
            });
        }
    }

    addCard() {
        if (!this.isLoading) {
            const modal = this.modalService.show(ModalAddCreditCardComponent, {
                backdrop: 'static',
                keyboard: false,
            });

            modal.content?.onAdded.subscribe(() => {
                console.log('onAdded');
                this.creditCardService.getCreditCards();
            });
        }

    }

    onSelectCard(card?: CreditCard) {
        this.selectedCard = card;
        this.form.get('token')?.setValue(card?.token);
    }

    onChange() {
        const {number} = this.form.value;
        this.creditCardInfo = Utils.getCreditCardType(number);
        this.form.get('payment_method')?.setValue(this.creditCardInfo?.type);
        this.cvvText = this.creditCardInfo?.type === CreditCards.Amex ? 'CSC' : 'CVV';

        this.form.get('number')?.setValidators([
            Validators.required,
            Validators.minLength(this.creditCardInfo?.length || 16),
        ]);
        this.form.get('security_code')?.setValidators([
            Validators.required,
            Validators.minLength(this.creditCardInfo?.code.length || 3),
        ]);
        this.form.get('number')?.updateValueAndValidity();
        this.form.get('security_code')?.updateValueAndValidity();

    }

    changeValidator(name: string, form: FormGroup, required: boolean) {
        if (required) {
            form.get(name)?.setValidators([Validators.required]);
        } else {
            form.get(name)?.setValidators(null);
        }
        form.get(name)?.updateValueAndValidity();

    }


}
