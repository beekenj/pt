import '../css/stats.css';

export default function Stats(props) {
    return (
        <div className="stats--container">
            <h3>{props.title}:</h3>
            <div>
                Shields: {props.shields}
            </div>
            <div>
                Targeting: {props.targeting}
            </div>
            <div>
                Evasion: {props.evasion}
            </div>
            <div>
                Initiative: {props.initiative}
            </div>
        </div>
    )
}