export function html(str,...raw){

    str = str.toString();
    let objectEvents = {};
    let events = 0;
    let prop ;
    let nameProp;
    const hasEvent = (nameEvent)=>{

        if(nameProp.includes(nameEvent)){

            let op1 = `${nameEvent} = @var`;
            let op2 = `${nameEvent}=@var`;
            let op3 = `${nameEvent} =@var`;
            let op4 = `${nameEvent}= @var`;
            str = str.replace(op1 ,`event = ${events}`)
                        .replace(op2,`event = ${events}`)
                        .replace(op3,`event = ${events}`)
                        .replace(op4,`event = ${events}`);
            objectEvents[events] = {name : nameEvent.toLowerCase().replace('on',''), value :raw[0]}
            events++;
            return false;
        }else{
            return true;
        }
    }
    str = str.replace(/,/g,'@var')
    raw.map(item =>{
        prop = str.match('@var');
        nameProp = str.slice(prop.index-12,prop.index);

        if(typeof item === 'string' || 
            typeof item === 'number' || 
            typeof item === 'object'){
                if(item.children){
                    const children = Array.from(item.children)
                    str = str.replace('@var',children[0].outerHTML)
                    raw = raw.slice(1,raw.lenght)

                }else if(Array.isArray(item) 
                            && item[0].constructor.name === 'DocumentFragment'){
                    let joinElements = '';
                    item.map(item=>{
                        joinElements += item.children[0].outerHTML.replace(/"/g,'');
                    })
                    str = str.replace('@var',joinElements)
                    raw = raw.slice(1,raw.lenght)

                }else{
                    str = str.replace('@var',JSON.stringify(raw[0]))
                    raw = raw.slice(1, raw.length);
                }
            
        }
        if(typeof item === 'function'){

            let res = hasEvent('onClick');
            if(res) res = hasEvent('onChange');
            if(res){
                if(raw[0] != undefined){

                    let valor = raw[0]();
                    // compruebo si lo que me llega es un elemento html
                    if(typeof valor === 'object' && valor.innerHTML != undefined){
                        str = str.replace('@var',valor.innerHTML);
                    }else{
                        str = str.replace('@var',valor);
                    }
                }else{
                    console.log('raw[0] es :', raw[0]);
                }
            }
            raw = raw.slice(1,raw.length);
        }

    })
    str = str.replace('<>','').replace('</>','');// quito el contenedor
    const container = document.createElement('div')
        container.innerHTML = str;
// busco los atributos event para añadir los eventos
    let elements = container.querySelectorAll('[event]');
    for(let item of elements){
        let position = item.getAttribute('event');
        if(objectEvents[position] != undefined){

            item.addEventListener(objectEvents[position].name,objectEvents[position].value)
    }
}
    const frag = new DocumentFragment();
    const children = Array.from(container.children);
        children.forEach(item=>{
            frag.appendChild(item)
        })
    return frag;

    /////
}
export const renderDom = (query,element)=>{
    
    document.querySelector(query).appendChild(document.createElement(element))
}
export function FirstUpperCase(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
export function getObservedProps(props){
    let notObserved = {};
    let yesObserved = {};
    for(let item in props){
        if(item.includes('$')){
            let newItem = item.replace('$','')
            notObserved = {...notObserved,[newItem]:props[item]}
        }else{
            yesObserved = {...yesObserved,[item]:props[item]}
        }
    }
    return { yesObserved , notObserved }
}
export class Comp{ 

constructor({styles,states,body,props}){
    this.styles = styles;
    this.states = states;
    this.body = body;
    this.props = props;
    this.render = 1;
    this.mount = false;
    this.cloned = 0;
    this.component = [];
    
// implemento estados
    if(this.states != {}){
        for(let state in states){
            this[state] = states[state];
            const name = FirstUpperCase(state)
            this[`set${name}`] = (value)=>{
                this.setState(value,state);
            };        }
        }

}

// this.states //
    setState(value,state){
        this[state] = value;
        this.states[state] = value;
        if(this.mount) this.render = this.render +1;
        if(event){
            if(event.target.getAttribute('key')){
                let key = event.target.getAttribute('key');
                this.props.id = key;
                document.getElementById(key).replaceWith(this.$(this.props))
            }else{
                document.getElementById(this.id).replaceWith(this.$(this.props))
                
            }
        }
    }
// this.render //
    $(props){
// amplio los props que viene por el componente
        if(props) this.props = {...this.props,...props};
        let component = this.body(this.props);
        this.id = component.getAttribute('id');
// inicio estado propio del componente duplicado 
        /*if(props){
            if(isNaN(parseInt(props.initial))){
                this.states[props.id]= props.initial;
            }else{
                this.states[props.id]= parseInt(props.initial);

            }
        }*/
// meto un atributo key en los elementos que contengan un evento para despues renderizar los componentes reutlizados
        if(component.querySelectorAll('[event]')){
            let child = component.querySelectorAll('[event]');
            child.forEach(item=>item.setAttribute('key',(props)?props.id:this.id))
        }
// evento componente esta cargado 
        document.addEventListener('DOMContentLoaded',(e)=>{
           
            if(document.getElementById(this.id)){
                if(this.mount) {
                    console.log('Componente reutilizando >>',this.id.toString().replace(/[0-9]*/g,'')) ;
                    this.cloned ++;
                }
                this.mount = true;
                this.component.push({
                    mount:this.mount,
                    index : this.cloned,
                    key: (props)?props.id:this.id,
                })
            }
            console.log('Component montado >> ',(props)?props.id:this.id);
        })
        let htmlCollection ;
        if(component.children.length == 0){
            htmlCollection = [component];
        }else{
            htmlCollection = component.children
        }
// comprobar si hay componentes custom 
    for(let item of htmlCollection){
        
        if(item.constructor.toString().includes('Unknown')){
            let name = (FirstUpperCase(item.tagName.toLowerCase()));
            
            // compruebo si hay una funcion o clase con este nombre para remplazarla
            if(this.props[name]){
                // saco los props del tag component para pasarlos al componente clase
                let attrs = item.attributes;
                let props = {};
                for(let i = 0 ; i < attrs.length ; i++){
                    let value = (attrs[i].nodeValue);
                    let name = (attrs[i].name);
                    props = {...props,[name]:value}
                }
                ///
                if(this.props[name].$){
                    let newItem = this.props[name].$(props);
                    item.replaceWith(newItem);
                }else{
                    item.replaceWith(this.props[name](props));
                }
            }
        }

    }
   

    
        return component;
    }
}
export class Pro extends HTMLElement {

    constructor(){
       super();
       this.mount = false; 
       const { yesObserved , notObserved } = getObservedProps(this.constructor.props)
       this.states = yesObserved;
       this.props = notObserved;
       this.event = this.constructor.listen;
       this.typeEvent = this.constructor.typeEvent || 'send';
    // creo un evento escuchador para comunicar los hijos con los padres
               if(this.event != undefined){
                   this.addEventListener(this.typeEvent,this.event)
               }
    // creo funcion getter para los estados
               if(this.states != undefined){
       
                   const props = this.states;
                   for(let item in props){
                       if(props[item] === undefined)console.log('undefined>>>>>>');
                       if(this.getAttribute(item) === undefined)console.log('undefined>>>>>')
                       this[item] = JSON.parse(this.getAttribute(item)) || props[item];
           
                       item = FirstUpperCase(item);
           
                       this['set'+item] = (value)=>{
                           this.setAttribute(item,JSON.stringify(value));
                           
                       }
                   }
               }
    // creo funcion getter para las props no escuchables
               if(this.props != undefined){
                   for(let item in this.props){
                       this[item] = this.props[item]
                       this[`set${FirstUpperCase(item)}`] = (value)=>{
                            this[item] = value;
                            this.props[item] = value;
                       }
                   }
               }
        this.constructor.getThis = ()=>{
            return this;
        }
        
       
    }

    connectedCallback(){
        this.onMount();
        this.render()
        this.mount = true;
    }

    static get observedAttributes(){
        let states;
        if(this.props != undefined){
            states = Object.keys(this.props);
        }else{
            states = ['']
        }
        return [...states];
    }

    attributeChangedCallback(atributo , viejoValor,nuevoValor ){
        if(nuevoValor === undefined && nuevoValor === ''){
            console.log('valor vacio o nulo');
        }
        if(viejoValor != nuevoValor){
            this[atributo] = JSON.parse(this.getAttribute(atributo))
            this.render();
    }
    }

    render(){
        this.innerHTML = '';
        this.appendChild(this.body())
    }

    static define(){
        console.log('componente definido',this.name);
        customElements.define(`x-${this.name.toLowerCase()}`,this)
    }

    send( detail , type = 'send' ){
       this.dispatchEvent(new CustomEvent(type,{bubbles:true,detail}))
    }

   // metodos valor initial
    onMount(){

    }

    body(){
        return (html`<div>Vacio</div>`)
    }

}
export const assets = (()=>{
    
    window.isEmpty = (value)=>{
        if(typeof value === 'object'){

            for(let item in value){
                if(value.hasOwnProperty(item)){
                    return false;
                }
            }
            return true
        }else{
            if(value === undefined || value === null){
                return true
            }else{
                return false
            }
        }
    }
    window.Cargando = ()=>{
        return (html`<h1>Cargando...</h1>`).str
    }
   
})()

