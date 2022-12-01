import { useEffect } from 'react';
import '../css/card.css';
// import Tippy from '@tippyjs/react/headless';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';

export default function Card(props) {
    const {icon, name} = props.card;

    useEffect(() => {
        tippy('#myButton', {
            content: 'My tooltip!',
            placement: 'top',
        });
    }, []);

    const style = {
        // background:'red',
    }

    return (
        <div className='container' style={style}>
            {/* <h1>hi</h1> */}
            <div className='image'>
                <img src={require(`../img/${icon}`)} alt="icon"/>
            </div>
            <div className='title'>
                <h3>{name}</h3>
            </div>
            <div id='myButton'>Info</div>
        </div>
    )
}