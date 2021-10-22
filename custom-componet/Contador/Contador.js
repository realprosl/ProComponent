import {html} from '../../pro-js/pro.js';
import {Pro} from '../../pro-js/pro.js';

export class Contador extends Pro {

    static props = {
        value :0,
        min :0,
        max :100
    }

    body (){
        return (html`<>
                        <h1 
                            class= value>${this.value}
                        </h1>
                        <button 
                            onClick=${()=>{
                                if(this.value > this.min)this.setValue(this.value -1)
                            }}>
                            -
                        </button>
                        <button 
                            onClick=${()=>{
                                if(this.value < this.max)this.setValue(this.value +1)
                            }}>
                            +
                        </button>
                    </>`);
    }
}
Contador.define();


