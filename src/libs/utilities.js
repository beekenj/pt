function shuffleDeck(arr) {
  // starting from the end of the array, let j be random index between 
  // 0 and i. Switch the elements at indeces i and j; iterete.
  for (let i = arr.length -1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

function handleClick(id, dispatch, setState) {
  dispatch({type:setState, id:id});
};

const drawCards = (n, deckCycle, dispatch, setDeckCycle, legal) => {
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
    // setDeckCycle({
    //   draw:inDraw,
    //   hand:inHand,
    //   discard:inDiscard,
    // });
    dispatch({type:setDeckCycle, draw:inDraw, hand:inHand, discard:inDiscard});
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
  };

  // setDeckCycle({
  //   draw:inDraw,
  //   hand:inHand,
  //   discard:inDiscard,
  // });
  dispatch({type:setDeckCycle, draw:inDraw, hand:inHand, discard:inDiscard});
  // console.log("1,1".split(",").map(elem => +elem));
};

export {shuffleDeck, handleClick, drawCards};