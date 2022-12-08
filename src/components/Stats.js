import '../css/stats.css';

export default function Stats(props) {
    return (
        <div className="stats--container">
            <h3>{props.title}:</h3>
            <div>
                Targeting: {props.targeting}
            </div>
            <div>
                Evasion: {props.evasion}
            </div>
            <div>
                Shields: {props.shields}
            </div>
            <div>
                Initiative: {props.initiative}
            </div>
            <div>
                Health: {props.health}
            </div>
            <br />
            <div>
                Hit Chance: <br /> {String(props.hitChance)}%
            </div>
        </div>
    )
}