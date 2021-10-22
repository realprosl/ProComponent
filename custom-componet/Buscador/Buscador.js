import { html,Pro } from '../../pro-js/pro.js';

// assets
import { handleInput } from './handleInput.js';
import { handleButton } from './handleButton.js';

export class Buscador extends Pro{
    static props = {
        size:25, 
        search:[],
        initial:[]
    }
  
    body(){
        return (html`<>
                        <input onChange=${ e =>{ handleInput(this) }} size=${ this.size } type="text">
                        <button onClick=${ e =>{ handleButton(this) }}>
                            X
                        </button>
                    </>`)
    }
}
Buscador.define();