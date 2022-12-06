import { useEffect } from 'react';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';

export default function SystemIcon(props) {
    // const selected = false;

    useEffect(() => {
        tippy(`#img${props.name}`, {
            content: props.name,
            placement: 'top',
        });
    }, [props]);

    return (
        <div 
            style={{
                backgroundColor: props.selected ? "#4c66af" : "gray", 
                height: "60px",
                borderRadius: "5px",
            }}
            onClick={props.handleClick}
        >
            <img 
                id={`img${props.name}`} 
                src={require(`../img/${props.img}`)} 
                alt={props.name} 
            />
        </div>
    )
}