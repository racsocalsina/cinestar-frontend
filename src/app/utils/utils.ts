import * as FileSaver from 'file-saver';
import {CreditCards, Documents} from '@utils/enums';
import * as creditCardType from 'credit-card-type';
import {CreditCardInfoInterface} from '@interfaces/credit-card-info.interface';

declare var mdtoast: any;


type FormatDate = 'DD/MM/YYYY' | 'YYYYMMDD' | 'DD/MM/YY' | 'YYYY-MM-DD' | 'DD-MM-YYYY';

export class Utils {

    static showToast(message: string) {
        mdtoast(message, {
            type: 'error',
            duration: 3000,
            interaction: true,
            interactionTimeout: 3000
        });
    }

    static isSafari() {
        const ua = navigator.userAgent.toLowerCase();
        if (ua.includes('safari')) {
            return !ua.includes('chrome');
        } else {
            return false;
        }
    }

    static removeEmpty(obj: any) {
        Object.keys(obj || {}).forEach((key) => (obj[key] == null || obj[key] === '') && delete obj[key]);
        return obj;
    }

    static viewMore(value?: string | null, length: number = 170): string {
        if (!value) {
            value = '';
        }
        const space = `${value.substr(length + 1, 1)}` == `\n`;
        const length_start = length + (space ? 2 : 1);
        return `${value.substr(0, length)}<span class="view-more">${value.substr(length_start)}</span>`;
    }

    static secondsToMinutes(seconds: number | string): string {
        if (isNaN(Number(seconds))) {
            return seconds.toString();
        }
        seconds = Number(seconds);
        let m: number | string = Math.floor(seconds % 3600 / 60);
        let s: number | string = Math.floor(seconds % 3600 % 60);
        if (m < 10) {
            m = `0${m}`;
        }
        if (s < 10) {
            s = `0${s}`;
        }

        return `${m}:${s}`;
    }

    static getStringDate({
                             date,
                             addDays,
                             format = 'DD/MM/YYYY'
                         }: { date?: any, addDays?: number, format?: FormatDate }): string {
        let d = new Date();

        try {
            if (date) {
                d = new Date(date);
            }
        } catch (e) {
            console.log('getStringDate', e);
        }

        if (d.toString() === 'Invalid Date') {
            return date;
        }

        if (addDays) {
            d.setDate(d.getUTCDate() + addDays);
        }

        const day = d.getDate() < 10 ? '0' + d.getDate() : d.getDate();
        const month = d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1);
        const year = d.getFullYear();

        switch (format) {
            case 'DD/MM/YYYY':
                return `${day}/${month}/${year}`;
            case 'DD-MM-YYYY':
                return `${day}-${month}-${year}`;
            case 'YYYYMMDD':
                return `${year}${month}${day}`;
            case 'YYYY-MM-DD':
                return `${year}-${month}-${day}`;
            case 'DD/MM/YY':
                const y = year.toString().substr(2, 2);
                return `${day}/${month}/${y}`;
            default:
                return `${day}/${month}/${year}`;
        }
    }

    static getStringUTCDate({
                                date,
                                addDays,
                                format = 'DD/MM/YYYY'
                            }: { date?: any, addDays?: number, format?: FormatDate }): string {
        let d = new Date();

        try {
            if (date) {
                d = new Date(date);
            }
        } catch (e) {
            console.log('getStringDate', e);
        }

        if (d.toString() === 'Invalid Date') {
            return date;
        }

        if (addDays) {
            d.setDate(d.getUTCDate() + addDays);
        }

        const day = d.getUTCDate() < 10 ? '0' + d.getUTCDate() : d.getUTCDate();
        const month = d.getUTCMonth() + 1 < 10 ? '0' + (d.getUTCMonth() + 1) : (d.getUTCMonth() + 1);
        const year = d.getUTCFullYear();

        switch (format) {
            case 'DD/MM/YYYY':
                return `${day}/${month}/${year}`;
            case 'DD-MM-YYYY':
                return `${day}-${month}-${year}`;
            case 'YYYYMMDD':
                return `${year}${month}${day}`;
            case 'YYYY-MM-DD':
                return `${year}-${month}-${day}`;
            case 'DD/MM/YY':
                const y = year.toString().substr(2, 2);
                return `${day}/${month}/${y}`;
            default:
                return `${day}/${month}/${year}`;
        }
    }

    static saveFile(buffer: any, fileName: string, type: string): void {
        const data: Blob = new Blob([buffer], {type});
        FileSaver.saveAs(data, fileName);
    }

    static getYouTubeId(url: string) {
        const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[7].length === 11) ? match[7] : false;
    }

    static minDate() {
        const date = new Date();
        date.setMonth(date.getMonth() - 216);
        return date;
    }

    static toBeginFilter() {
        return [
            {
                name: 'En 30 min',
                value: 1
            },
            {
                name: 'En 60 min',
                value: 2
            },
            {
                name: 'En 90 min',
                value: 3
            },
            {
                name: 'En 120 min',
                value: 4
            }
        ];
    }

    static arrToString({
                           arr, field, limit, separator = ', '
                       }: { arr: any[], field?: string, limit?: number, separator?: string }) {
        try {
            let arrStr = [];

            if (field) {
                (arr || []).forEach(x => arrStr.push(x[field]));
            } else {
                arrStr = arr;
            }
            const uniqueArray: any[] = [...new Set(arrStr)];
            const str = uniqueArray.join(separator);
            return limit && str.length > limit ? `${str.substr(0, limit)}...` : str;
        } catch (e) {
            console.log(e);
            return '';
        }

    }

    static getDocumentName(code: string) {
        switch (code) {
            case Documents.DNI:
                return 'DNI';
            case Documents.CE:
                return 'CE';
            case Documents.PAS:
                return 'PAS';
            case Documents.RUC:
                return 'RUC';
            default:
                return '';
        }
    }

    static getCreditCardIcon(type: CreditCards) {
        switch (type) {
            case 'VISA':
                return 'visa.svg';
            case 'MASTERCARD':
                return 'master-card.svg';
            case 'AMEX':
                return 'american-express.svg';
            case 'DINERS':
                return 'diners.png';
            default:
                return null;
        }
    }

    static getCreditCardType(number: string): CreditCardInfoInterface {
        const creditCardTypeInfo = creditCardType(number);

        let cardInfo!: CreditCardInfoInterface;

        if (creditCardTypeInfo && creditCardTypeInfo.length === 1) {
            switch (creditCardTypeInfo[0].type) {
                case 'visa':
                    cardInfo = {
                        type: CreditCards.Visa,
                        length: 16,
                        mask: '0000-0000-0000-0000',
                        code: {name: 'CVV', length: 3}
                    };
                    break;
                case 'mastercard':
                    cardInfo = {
                        type: CreditCards.Mastercard,
                        length: 16,
                        mask: '0000-0000-0000-0000',
                        code: {name: 'CVC', length: 3}
                    };
                    break;
                case 'american-express':
                    cardInfo = {
                        type: CreditCards.Amex,
                        length: 15,
                        mask: '0000-000000-00000',
                        code: {name: 'CID', length: 4}
                    };
                    break;
                case 'diners-club':
                    cardInfo = {
                        type: CreditCards.Diners,
                        length: 14,
                        mask: '0000-0000-0000-00',
                        code: {name: 'CVV', length: 3}
                    };
                    break;
            }
        }

        return cardInfo;
    }

    static isSingular(n: number) {
        return Math.abs(n) === 1;
    }
}
