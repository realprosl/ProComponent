import { assets } from '../../pro-js/pro.js';

export const listenTabla = ( e , el )=>{
    const _this = el.getThis();
    const nameTarget = e.target.tagName.toLowerCase();
    const popUp = _this.querySelector('x-popup');

    if(nameTarget === 'x-buscador'){
        if(isEmpty(e.detail)){
            popUp.setOn(true);
            setTimeout(()=>{
                popUp.setOn(false)
            },1000)
            
        }else{
            _this.setArray(e.detail)
        }
    }

}
