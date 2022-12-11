import '../css/combatsymbol.css';

export default function CombatSymbol ({fadeProp}) {
    return (
        <div>
            {/* <span className={fadeProp.fade}>FIGHT!</span> */}
            <span className={fadeProp.fade}>
                <img src={require("../img/combat.png")} alt='FIGHT!' />
                {/* src\img\combat.png */}
            </span>
            &nbsp;
        </div>
    )
}