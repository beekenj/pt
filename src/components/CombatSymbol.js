import '../css/combatsymbol.css';

export default function CombatSymbol ({fadeProp}) {
    // const [fadeProp, setFadeProp] = useState({
    //     fade:'fade-in',
    // });

    // useEffect(() => {
    //     const timeout = setInterval(() => {
    //         if (fadeProp.fade === 'fade-in') {
    //             setFadeProp({
    //                 fade:'fade-out',
    //             });
    //         } else {
    //             setFadeProp({
    //                 fade:'fade-in',
    //             });
    //         }
    //     }, 2000);

    //     return () => clearInterval(timeout);
    // }, [fadeProp]);

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