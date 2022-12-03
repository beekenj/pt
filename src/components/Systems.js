import '../css/systems.css';

export default function Systems(props) {
    const systems = [
            'Shields', 
            'Scanners', 
            'ECM', 
            'Engine', 
            'Navigation',
        ];
    const prettySystems = systems.map(sys => <div><input type="checkbox" /> {sys}</div>)
    return (
        <>
            <h2>Systems</h2>
            <div className='systems'>{prettySystems}</div>
        </>
    );
}