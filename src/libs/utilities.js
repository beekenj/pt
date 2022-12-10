function shuffleDeck(arr) {
  // starting from the end of the array, let j be random index between 
  // 0 and i. Switch the elements at indeces i and j; iterete.
  for (let i = arr.length -1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

function handleClick(id, setState) {
  setState(prev => prev.map(elem => {
    return elem.id === id && elem.type !== 'system' && elem.pow !== 0 ?
      {...elem, selected:!elem.selected} :
      elem
    }
  ));
};

function clickHand(id, setState) {
  setState(prev => {
    // console.log(prev.hand)
    // return prev
    return {
      ...prev,
      hand: prev.hand.map(elem => {
        return elem.id === id && elem.type !== 'system' && elem.pow !== 0 ?
          {...elem, selected:!elem.selected} :
          elem
      }),
    }});
}

const drawCards = (n, deckCycle, setDeckCycle, legal) => {
  let inDraw = [...deckCycle.draw];
  let inHand = [...deckCycle.hand];
  let inDiscard = [...deckCycle.discard];
  if (!legal) return;
  if (n > deckCycle.draw.length + deckCycle.hand.length + deckCycle.discard.length) {
    console.log("handsize too high for deck!");
    return
  }
  if (inHand.length === 0) {
    // console.log("case 1");
    // setFirstDraw(false);

    // fill hand
    inHand = inDraw.slice(0, n);
    // remove hand from draw
    if (n === deckCycle.draw.length + deckCycle.hand.length + deckCycle.discard.length) inDraw = [];
    else inDraw = inDraw.slice(n-inDraw.length);

    // setHand(inHand);
    // setDraw(inDraw);
    setDeckCycle({
      draw:inDraw,
      hand:inHand,
      discard:inDiscard,
    });
    // console.log(inDraw, inHand, inDiscard);
    return
  }
  if (deckCycle.draw.length > n) {
    // console.log("case 2");
    
    // discard hand
    inDiscard = [
      ...inHand.map(card => {
        return {...card, selected:false}
      }), 
      ...inDiscard
    ];
    // fill hand
    inHand = inDraw.slice(0, n);
    // remove hand from draw
    inDraw = inDraw.slice(n-inDraw.length);
  } else if (deckCycle.draw.length === n) {
    // console.log("case 3");

    // discard hand
    inDiscard = [
      ...inHand.map(card => {
        return {...card, selected:false}
      }), 
      ...inDiscard
    ];
    // fill hand
    inHand = inDraw.slice(0, n);
    // empty draw pile (edge case)
    inDraw = [];
  } else {
    // console.log("case 4");

    // discard hand
    inDiscard = [
      ...inHand.map(card => {
        return {...card, selected:false}
      }), 
      ...inDiscard
    ];
    // shuffle discard, place under remaining hand
    inDraw = [...inDraw, ...shuffleDeck(inDiscard)];
    inDiscard = [];
    // fill hand
    inHand = inDraw.slice(0, n);
    // remove hand from draw
    inDraw = inDraw.slice(n-inDraw.length);
  }
  // setDraw(inDraw);
  // setHand(inHand);
  // setDiscard(inDiscard);
  setDeckCycle({
    draw:inDraw,
    hand:inHand,
    discard:inDiscard,
  });
  // console.log(inDraw, inHand, inDiscard);
};

export {shuffleDeck, handleClick, clickHand, drawCards};