import combat from './combat';

  const simulateCombat = (p1, p2, n) => {
    return new Promise(resolve => {
      let total = 0;
      for (let i=0; i<n; i++) {
        total += combat(p1,p2);
      }
      resolve(total/n);
      // resolve("hi")
    })
  }

  const callCombat = async (p1, p2, n) => {
    const result = await simulateCombat(p1, p2, n);
    // console.log(result)
    setSimCombat(result);
    // return result;
  }

  export default callCombat;