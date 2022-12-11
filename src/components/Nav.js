import '../css/nav.css';

export default function Nav(props) {
    return (
        <nav>
            <div style={{color: props.curPower >= 0 ? "white" : "red"}}>
                Power: {props.curPower}
            </div>
            <div style={{color: props.curCommand >= 0 ? "white" : "red"}}>
                Command: {props.curCommand}
            </div>
            <div style={{color: props.curSupport >= 0 ? "white" : "red"}}>
                Support: {props.curSupport}
            </div>
            <div>
                Armor: {props.health}
            </div>
            <div>
                Draw/Discard: {props.draw}/{props.discard}
            </div>
        </nav>
    );
}