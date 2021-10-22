import { Pro } from '../../pro-js/pro.js';

export const handleInput = (ele) =>{

    const value = ele.querySelector('input').value;
    const search = ele.search;
    let res;

    if(search){
        
        res = search.filter(item=>{
            if(typeof item === 'string' || typeof item === 'number'){
                return (item.includes(value))
            }else{
                return (JSON.stringify(item).includes(value))
            }
        })
        ele.querySelector('input').value = '';
        ele.send(res);
    }else{
        console.log('Error : props',search,' viene vacia o undefined');
    }
}