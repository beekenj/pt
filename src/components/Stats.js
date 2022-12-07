export default function Stats(props) {
    return (
        <>
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
        </>
    )
}