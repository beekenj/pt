import { useEffect } from 'react';
import '../css/card.css';
// import Tippy from '@tippyjs/react/headless';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
// import CardTooltip from './CardTooltip';

export default function Card(props) {
    const {icon, name, type} = props.card;

    useEffect(() => {
        tippy('#targeting', {
            content: "Targeting",
            placement: 'top',
        });
        tippy('#evasion', {
            content: "Evasion",
            placement: 'top',
        });
    }, []);

    const cardStyle = {
        background: type === 'system' ? "#272727" : "#c7c7c7",
        color: type === 'system' ? "white" : "black",
        border: props.selected ? "thick solid #4c66af" : "thick solid rgba(0, 0, 0, .5)",
        cursor: type === 'system' ? "not-allowed" : "pointer",
    }

    const test = () => {
        console.log("ability");
    }

    return (
        <div className='container' style={cardStyle} onClick={props.handleClick}>
            <div className='image'>
                <img src={require(`../img/${icon}`)} alt="icon"/>
            </div>
            <div className='title'>
                <h3>{name}</h3>
            </div>
            <div style={{display:"flex", justifyContent:"center"}}>
                {type === 'officer' && <div className='ability' style={{
                    backgroundColor: props.selected ? "#4c66af" : "gray",
                    cursor: "context-menu",
                }}
                onClick={test}
                >
                <img 
                    // id={`img${props.name}`} 
                    src={require(`../img/nav.png`)} 
                    alt="testing" 
                    style={{
                        width:"32px",
                        height:"32px",
                    }}
                />
                </div>}
            </div>
            {type === 'ship' && <div className='info'>
                <div id='targeting' className='stats'>{props.card.targeting}</div>
                <div id='evasion' className='stats'>{props.card.evasion}</div>
            </div>}
        </div>
    )
}