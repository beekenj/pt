import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import '../css/playbutton.css';

export default function PlayButton({playTooltip, clickPlay, legal, firstDraw}) {
    return (
        <Tippy content={playTooltip}>
            <button 
                type="button" 
                className="btn btn-primary" 
                onClick={clickPlay} 
                style={{
                    cursor: !legal ? "not-allowed" : "pointer",
                    backgroundColor: legal ? "#4c66af" : "#3e1f1f",
                }}
            >
                {firstDraw ? "Draw" : "Play"}
            </button>
      </Tippy>
    )
}