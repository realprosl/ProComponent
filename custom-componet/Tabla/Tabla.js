import { html,Pro ,assets } from '../../pro-js/pro.js'
import { Buscador } from '../Buscador/Buscador.js';
import { Lista } from '../Lista/Lista.js';
import { PopUp } from '../PopUp/PopUp.js';

// assets
import { listenTabla } from './listenTabla.js';

const array = [
        {
            id:10,
            name:'Alberto_prado'
        },
        {
            id:22,
            name:'Paco_garcia'
        }]

export class Tabla extends Pro{
    static props = {
        array:array,
        $initial:array
    };
    static listen = (e) =>{ listenTabla( e , this ) };

    body(){
        return (html`<>
                        <x-buscador search=${ this.array } initial=${ this.initial } size='30'>
                        </x-buscador>
                        <x-lista listar=${ this.array }></x-lista>
                        <x-popup></x-popup>
                    </>`)
    }
} 
Tabla.define()


