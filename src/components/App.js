import { useEffect, useReducer } from 'react';

// css
import '../css/App.css';
import 'tippy.js/dist/tippy.css';

// state
import { initState, reducer } from '../state';

// utilties
import { handleClick, drawCards } from '../libs/utilities';
import { combatAnimation } from '../libs/combat';

// Components
import Card from './Card';
import Hand from './Hand';
import Nav from './Nav';
import Systems from './Systems';
import PlayButton from './PlayButton';
import SystemIcon from './SystemIcon';
import Stats from './Stats';
import CombatSymbol from './CombatSymbol';

function App() {
  const HANDSIZE = 5;  

  const [state, dispatch] = useReducer(reducer, initState);
  // console.log(state)
 
 // console.log("render");
 
  // Set max stats when deck changes
  useEffect(() => {
    dispatch({type:'setShipStats'});
  }, [state.deckComplete]);

  // Initialize hit chances
  useEffect(() => {
    // setPlayerHitChance(calcCombat(state.combatStats, state.enemyStats));
    dispatch({type:'setPlayerHitChance'})
    dispatch({type:'setEnemyHitChance'})
    // setEnemyHitChance(calcCombat(state.enemyStats, state.combatStats));
  }, [state.combatStats, state.enemyStats]);

  // Set all stats
  useEffect(() => {
    dispatch({type:'setCombatStats'});
  }, [state.deckCycle, state.systems, state.shipStats]);

  // Setup draw button
  useEffect(() => {
    dispatch({type:'setLegal'});
    if (state.combatStats.power < 0) {
      dispatch({type:'setPlayTooltip', text:'Insufficient Power!'});
    } else if (state.combatStats.command < 0) {
      dispatch({type:'setPlayTooltip', text:'Insufficient Command!'});
    } else if (state.combatStats.support < 0) {
      dispatch({type:'setPlayTooltip', text:'Insufficient Support!'});
    } else {
      dispatch({type:'setPlayTooltip', text:'Draw Cards!'});
    }
  }, [state.combatStats, state.firstDraw]);

  // jsx
  return (
    <div className="App">      
      <Nav 
        // draw={0}
        draw={state.deckCycle.draw.length}
        discard={state.deckCycle.discard.length}
        // discard={0}
        curPower={state.combatStats.power}
        curCommand={state.combatStats.command}
        curSupport={state.combatStats.support}
        health={state.combatStats.armor}
      />
      <main style={{marginTop:"80px"}}>
        <div style={{display:"flex", alignItems:"center"}}>
        <Stats 
          title="Player"
          stats={state.combatStats}
          hitChance={state.playerHitChance}
        />
        <CombatSymbol fadeProp={state.fadeProp}/>
        <Stats 
          title={state.enemyStats.name}
          stats={state.enemyStats}
          hitChance={state.enemyHitChance}
        />
        </div>
        <h2>
          {state.combatResults}
        </h2>
      </main>
      
      <div style={{
        position:"fixed", 
        // margin: "20px",
        width:"100%",
        bottom:"0", 
        right:"0",
        left:"0",
      }}>   
      {state.actionMenu && <Systems>
            {state.actions.map((sys, idx) => 
              <div key={idx}>
                  <SystemIcon 
                    name={sys.name} 
                    img={sys.img} 
                    selected={sys.selected} 
                    handleClick={() => handleClick(sys.id, dispatch, 'setActions')}
                  />
              </div>
            )}
          </Systems>}
          <br/>
        <Hand>
          {state.deckCycle.hand.length > 0 && state.deckCycle.hand.map((card, idx) => 
            <Card 
              key={idx} 
              card={card} 
              selected={card.selected}
              handleClick={() => handleClick(card.id, dispatch, 'setDeckCycleClick')}
            />
          )}
        </Hand>
        <div style={{
          display:"flex",
          justifyContent:"space-between",
          alignItems:"flex-end",
          margin:"20px",
        }}>
          <Systems>
            {state.systems.map((sys, idx) => 
              <div key={idx}>
                  <SystemIcon 
                    name={sys.name} 
                    img={sys.img} 
                    selected={sys.selected} 
                    handleClick={() => handleClick(sys.id, dispatch, 'setSystems')}
                  />
              </div>
            )}
          </Systems>
          <button style={{
            color:"black", 
            cursor:"pointer", 
          }} className="button" onClick={() => {
              combatAnimation(state.combatStats, state.enemyStats, dispatch, 'setCombatResults', 'setFadeProp');
            }
          }>
              Roll
          </button>
          <PlayButton
            playTooltip={state.playTooltip}
            clickPlay={() => {
              // setFirstDraw(false);
              dispatch({type:'setFirstDraw'});
              drawCards(HANDSIZE, state.deckCycle, dispatch, 'setDeckCycleDraw', state.legal);
            }}
            legal={state.legal}
            firstDraw={state.firstDraw}
          />  
        </div>
      </div>
    </div>
  );
}

export default App;