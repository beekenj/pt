import '../css/nav.css';

export default function Nav(props) {
    return (
        <nav>
            <div>
                Power: {props.curPower}/{props.power}
            </div>
            <div style={{color: props.curCommand >= 0 ? "white" : "red"}}>
                Command: {props.curCommand}/{props.command}
            </div>
            <div style={{color: props.curSupport >= 0 ? "white" : "red"}}>
                Support: {props.curSupport}/{props.support}
            </div>
            <div>
                Health: {props.health}
            </div>
        </nav>
    );
}