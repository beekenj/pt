import '../css/nav.css';

export default function Nav(props) {
    return (
        <nav>
            <div>
                Power: {props.power}
            </div>
            <div>
                Command: {props.command}
            </div>
            <div>
                Support: {props.support}
            </div>
        </nav>
    );
}