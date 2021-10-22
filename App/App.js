import { html , Pro , assets } from '../pro-js/pro.js'
import { Tabla } from '../custom-componet/Tabla/Tabla.js';
import { New } from '../custom-componet/New/New.js';

// assets

export class App extends Pro{

    body(){
        return (html`<>
                        <x-tabla></x-tabla>
                    </>`)
    }
} 
App.define()
    


