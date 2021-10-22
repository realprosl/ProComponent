import { Pro,html } from '../../pro-js/pro.js';

export class PopUp extends Pro {

    static props = {
        on: false,
        msg:'No result!!'
    }

    body(){
        return (this.on)
                    ?html`<h2>${ this.msg }</h2>`
                    :html`<h2></h2>`
    }
}
PopUp.define();