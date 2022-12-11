import '../css/stats.css';

export default function Stats(props) {
    const stats = props.stats;

    return (
        <div className="stats--container">
            <h3>{props.title}:</h3>
            <div>
                Targeting: {stats.targeting}
            </div>
            <div>
                Evasion: {stats.evasion}
            </div>
            <div>
                Shields: {stats.shield}
            </div>
            <div>
                ShieldPen: {stats.shieldPen}
            </div>
            <div>
                Initiative: {stats.initiative}
            </div>
            <div>
                Armor: {stats.armor}
            </div>
            <br />
            <div>
                Hit Chance: <br /> {String(props.hitChance)}%
            </div>
        </div>
    )
}