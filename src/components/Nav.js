import '../css/nav.css';

export default function Nav(props) {
    return (
        <nav>
            <div>
                Power: {props.curPower}/{props.power}
            </div>
            <div>
                Command: {props.curCommand}/{props.command}
            </div>
            <div>
                Support: {props.curSupport}/{props.support}
            </div>
            <div>
                Health: {props.health}
            </div>
        </nav>
    );
}