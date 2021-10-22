import { Pro } from '../../pro-js/pro.js';

export const handleButton = (ele)=>{

    ele.querySelector('input').value = '';
    ele.send(ele.initial)
}