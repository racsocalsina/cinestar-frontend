import * as CryptoJS from 'crypto-js';

interface ClearItems {
    except: string[];
    only: string[];
}

export class StorageUtils {

    private static getStorage( type: string, key: string ): string {
        let value: string;

        try {
            if ( type === 'local' ) {
                value = localStorage.getItem( key ) || '';
            } else {
                value = sessionStorage.getItem( key ) || '';
            }

            if ( value ) {
                value = StorageUtils.decrypt( value );
            }
            return value;
        } catch ( e ) {

            if ( type === 'local' ) {
                localStorage.removeItem( key );
            } else {
                sessionStorage.removeItem( key );
            }

            console.log( e );
            return '';
        }
    }

    private static encrypt( data: string ): string {
        try {
            const encrypted = CryptoJS.AES.encrypt( data, StorageUtils.getKey() );
            return encrypted.toString();
        } catch ( e ) {
            throw e;
        }
    }

    private static decrypt( data: string ): string {
        try {
            const decrypted = CryptoJS.AES.decrypt( data, StorageUtils.getKey() );
            return decrypted.toString( CryptoJS.enc.Utf8 );
        } catch ( e ) {
            throw e;
        }
    }

    private static getKey(): string {
        return `${StorageUtils._001()}${StorageUtils._002()}`;
    }

    private static _001(): string {
        const i = ( ( ( Math.pow( 2, 4 ) * 3 ) + 2 ) / 71 ) - 1;
        const j = ( ( Math.pow( 2, 4 ) * 3 ) + 2 ) / 30;
        const l = ( ( Math.pow( 3, 2 ) * 3 ) + 2 ) / parseInt( String( j ), 0 );
        const tmp1 = parseInt( String( j ), 0 ) * 7000 + ( parseInt( String( j ), 0 ) * 35 ) + ( parseInt( String( i ), 0 ) + 9 );
        const tmp2 = ( parseInt( String( i ), 0 ) * 1000 ) + ( parseInt( String( l ), 0 ) * 99 ) + ( parseInt( String( l ), 0 ) * 8 ) + parseInt( String( j ), 0 );
        return tmp1.toString() + tmp2;
    }

    private static _002(): string {
        const i = ( ( ( Math.pow( 2, 4 ) * 3 ) + 2 ) / 10 ) + 3 + ( ( Math.sqrt( 610 ) - 9 ) + 11 ) * 2 + 8;
        const j = ( ( ( Math.pow( 2, 4 ) * 3 ) + 2 ) / 10 ) + 3 + ( ( Math.sqrt( 610 ) - 9 ) + 2 ) * 3 + 7;
        const k = ( ( ( Math.pow( 2, 4 ) * 3 ) + 2 ) / 6 ) + 7 + ( ( Math.sqrt( 610 ) - 9 ) + 2 ) * 3 + 7;
        const l = ( ( ( Math.pow( 2, 4 ) * 3 ) + 2 ) / 4 ) + 5 + ( ( Math.sqrt( 610 ) - 9 ) + 2 ) * 3 + 7;
        const m = ( ( ( Math.pow( 2, 4 ) * 4 ) + 2 ) / 4 ) + 4 + ( ( Math.sqrt( 610 ) - 9 ) + 2 ) * 3 + 7;
        const n = ( ( ( Math.pow( 2, 4 ) * 4 ) + 2 ) / 4 ) + 4 + ( ( Math.sqrt( 610 ) - 9 ) + 2 ) * 3 + 8;
        const tmp1 = String.fromCharCode( i ) + String.fromCharCode( k ) + String.fromCharCode( i ) + String.fromCharCode( l );
        const tmp2 = String.fromCharCode( i ) + String.fromCharCode( m ) + String.fromCharCode( n ) + String.fromCharCode( j );
        return tmp2 + tmp1;
    }

    protected getLocalStorage( key: string ): string {
        return StorageUtils.getStorage( 'local', key );
    }

    protected setLocalStorage( key: string, data: string ): void {
        data = StorageUtils.encrypt( data );
        localStorage.setItem( key, data );
    }

    protected removeLocalStorage( key: string ): void {
        localStorage.removeItem( key );
    }

    /**
     * @description: Permite eliminar todos los registros del localStorage del navegador.
     * @param except: Permite excluir datos al momento del limpiar el storage
     * @param only: Si este parámetro existe, solo se elimnarán los que se hayan incluído en este array.
     */
    protected clearLocalStorage( { except, only }: ClearItems = { except: [], only: [] } ): void {

        except = [
            'cinemas',
            'formats',
            'cities',
            'ubigeo',
            'document_types',
            'claim_parameters'
        ];

        const keys = only && only.length ? only : Object.keys( localStorage ).filter( x => !( except || [] ).includes( x ) );
        keys.forEach( k => this.removeLocalStorage( k ) );
    }

    protected getSessionStorage( key: string ): string {
        return StorageUtils.getStorage( 'session', key );
    }

    protected setSessionStorage( key: string, data: string ): void {
        data = StorageUtils.encrypt( data );
        sessionStorage.setItem( key, data );
    }

    protected removeSessionStorage( key: string ): void {
        sessionStorage.removeItem( key );
    }

    /**
     * @description: Permite eliminar todos los registros del sessionStorage del navegador
     * @param except: Permite excluir datos al momento del limpiar el storage
     * @param only: Si este parámetro existe, solo se elimnarán los que se hayan incluído en este array.
     */
    protected clearSessionStorage( { except, only }: ClearItems = { except: [], only: [] } ): void {
        const keys = only && only.length ? only : Object.keys( sessionStorage ).filter( x => !( except || [] ).includes( x ) );
        keys.forEach( k => this.removeSessionStorage( k ) );
    }


}
