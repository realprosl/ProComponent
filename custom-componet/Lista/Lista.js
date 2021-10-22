import { Pro,html } from '../../pro-js/pro.js';

export class Lista extends Pro {

    static props = {
        listar:[]
    }
    body(){
        return (html`
                        ${ (isEmpty(this.listar))
                            ? html`<h1>Cargando...</h1>`
                            : html` <ul class="container-lista">${ this.listar.map(item => 
                                html`   <li>
                                            <span>${ item.id }</span> 
                                            <span>${ item.name }</span> 
                                        </li>
                                ` )}</ul>`
                        }
                    `)
    }
}
Lista.define();