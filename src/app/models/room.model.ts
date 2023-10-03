import { Seat } from '@interfaces/seat.interface';

export class Room {
    seats: Seat[] = [];
    columns = 0;

    constructor( str: string ) {
        // str = "NNAANNNAAAPNNAAANNAAANNAPNNAANNNNNN/AANNAAANNNPAANNNAANNNAANPAANNAAANNN/NNAANNNAAAPNNAAANNAAANNAPNNAANNNANN/AANNAAANNNPNNNNNNNNNNNNPPAANNAAANNN/NNNNNNNNAAPNNAANNNAAANNPPAANNNNNNNN/NNNNNNNNNNPNANNAAANNNAAPPNNNNNNNNNN/NNNNNNNNNNPNNNNAAANNNNNNPNNNNNNNNNN/NNNNNNNNNNPNNNNNNNNNNNNNPNNNNNNNNNN/NNNNNNNNNNPNNNNNNNNNNNNNPNNNNNNNNNN/";
        console.log( str.split( '/' ) );
        this.setSeats( str );
    }

    private static getRowLetter( id: number ): string {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        return letters.charAt( id );
    }

    getIcon( value: string, first_row: boolean): string | null {
        if ( value === 'A' ) {
            return 'disponible.svg';
        } else if ( value === '4' ) {
            if(first_row){
                return 'vip.svg';
            }else{
                return '4x.svg';
            }
        } else if ( value === 'R' ) {
            return 'reservado.svg';
        } else if ( value === 'O' ) {
            return 'ocupado.svg';
        } else if ( value === 'N' ) {
            return 'no-disponible.svg';
        } else if ( value === 'S' ) {
            return 'disabled_chair.svg';
        } else {
            return null;
        }
    }

    private setSeats( str: string ): void {
        let index = 0;
        let first_row = true; 
        if ( str ) {
            str.split( '/' ).forEach( ( strRow, row ) => {
                // let corridors = 0;
                strRow.split( '' ).forEach( ( value, column ) => {
                    this.columns = strRow.length;

                    /*if ( column > 0 && value === 'P' ) {
                     corridors++;
                     }*/
    
                        this.seats.push( {
                            index,
                            row, column, value,
                            // position: `${Room.getRowLetter( row )}${column}`,
                            icon: this.getIcon( value, first_row),
                            cursor: value === 'A' || value === '4' || value === 'R' || value === 'S'
                        } );
                   
                    index++;

                } );
                first_row = false;
            } );

        }
    }
}

