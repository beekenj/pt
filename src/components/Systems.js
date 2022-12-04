import '../css/systems.css';
// import SystemIcon from './SystemIcon';

export default function Systems({children}) {
    // const systems = [
    //     {name:'Shields', img:'g13879.png'}, 
    //     {name:'Scanners', img:'sensors.png'}, 
    //     {name:'ECM', img:'ecm.png'}, 
    //     {name:'Engine', img:'foot.png'}, 
    //     {name:'Navigation', img:'nav.png'},
    // ];
    // const prettySystems = systems.map((sys, idx) => 
    //     <div key={idx}>
    //         {/* <input type="checkbox" /> {sys}  */}
    //         {/* <img src={require('../img/g13879.png')} /> */}
    //         <SystemIcon name={sys.name} img={sys.img}/>
    //     </div>
    // );
    return (
        <>
            {/* <h2>Systems</h2><br /> */}
            <div className='systems'>{children}</div>
        </>
    );
}