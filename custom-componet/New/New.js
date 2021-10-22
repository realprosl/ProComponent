import { Pro , html } from '../../pro-js/pro.js';

export class New extends Pro {
    static props ={
        $value : 32 ,
    }
    
    body(){
      return (html`<>
                    <div> algo mas </div>
                </>`)
    }
}
New.define();