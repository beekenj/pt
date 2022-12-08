const combat = (p1, p2) => {
    let h1 = p1.health;
    let h2 = p2.health;
    let s1 = p1.shield;
    let s2 = p2.shield;
    const p1Hit = Math.min(Math.max(1,3-p1.targeting+p2.evasion),5);
    const p2Hit = Math.min(Math.max(1, 3-p2.targeting+p1.evasion),5);

    while (h1 > 0 && h2 > 0) {
      h2 -= p1.hd.reduce((acc, hit) => 
        Math.ceil(Math.random()*6) > p1Hit ? hit + acc : 0 + acc, 0);
      h1 -= p1.hd.reduce((acc, hit) => 
        Math.ceil(Math.random()*6) > p2Hit ? hit + acc : 0 + acc, 0);
      // sum([i if ciel(rand()*6) > p1_hit else 0 for i in p1.hd])
      // h2 -= 1
      h1 += Math.max(s1-p2.shieldPen, 0);
      h2 += Math.max(s2-p1.shieldPen, 0);
      s2 -= 1
      s1 -= 1
    };
    
    if (h1 >= h2) return 1;
    else return 0;
  };

export default combat;