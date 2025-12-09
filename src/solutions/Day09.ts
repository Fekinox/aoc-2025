import type { SolverCollection } from "./types";

const day09: SolverCollection = new Map();

function Main(text: string) {
  let silver = 0;
  let gold = 0;
  const tiles: number[][] = text
    .split("\n")
    .map((l) => l.split(",").map(Number));
  const lines = tiles.map((_, i) => {
    let j = i + 1;
    if (j >= tiles.length) {
      j = 0;
    }
    const dx = Math.sign(tiles[j][0] - tiles[i][0]);
    const dy = Math.sign(tiles[j][1] - tiles[i][1]);
    if (dx === 0 && dy === -1) {
      return {
        src: tiles[i],
        dst: tiles[j],
        dir: "U",
      };
    } else if (dx === 0 && dy === 1) {
      return {
        src: tiles[i],
        dst: tiles[j],
        dir: "D",
      };
    } else if (dy === 0 && dx === -1) {
      return {
        src: tiles[i],
        dst: tiles[j],
        dir: "L",
      };
    } else {
      return {
        src: tiles[i],
        dst: tiles[j],
        dir: "R",
      };
    }
  });
  for (let i = 0; i < tiles.length; i++) {
    for (let j = i + 1; j < tiles.length; j++) {
      const w = Math.abs(tiles[i][0] - tiles[j][0]) + 1;
      const h = Math.abs(tiles[i][1] - tiles[j][1]) + 1;

      const top = Math.min(tiles[i][1], tiles[j][1]);
      const bot = Math.max(tiles[i][1], tiles[j][1]);
      const lft = Math.min(tiles[i][0], tiles[j][0]);
      const rgt = Math.max(tiles[i][0], tiles[j][0]);
      silver = Math.max(silver, w * h);

      let good = true;
      goldsplit: for (let k = 0; k < tiles.length; k++) {
        const ln = lines[k];

        const lTop = Math.min(ln.src[1], ln.dst[1]);
        const lBot = Math.max(ln.src[1], ln.dst[1]);
        const lLft = Math.min(ln.src[0], ln.dst[0]);
        const lRgt = Math.max(ln.src[0], ln.dst[0]);

        if (ln.dir === "D" && rgt > lRgt) {
          let closestOpp = null;
          for (let l = 0; l < lines.length; l++) {
            const lLn = lines[l];
            if (
              lLn.dir === "U" &&
              ((lLn.dst[1] <= top && top < lLn.src[1]) ||
                (lLn.dst[1] < bot && bot <= lLn.src[1])) &&
              lLn.src[0] >= rgt
            ) {
              if (closestOpp === null) {
                closestOpp = lLn.src[0];
              } else {
                closestOpp = Math.min(closestOpp, lLn.src[0]);
              }
            }
          }
          if (closestOpp !== null && closestOpp < lRgt) {
            continue goldsplit;
          }
          if ((lTop <= top && top < lBot) || (lTop < bot && bot <= lBot)) {
            good = false;
            break goldsplit;
          }
        }
        if (ln.dir === "U" && lft < lLft) {
          let closestOpp = null;
          for (let l = 0; l < lines.length; l++) {
            const lLn = lines[l];
            if (
              lLn.dir === "D" &&
              ((lLn.dst[1] <= top && top < lLn.src[1]) ||
                (lLn.dst[1] < bot && bot <= lLn.src[1])) &&
              lLn.src[0] <= lft
            ) {
              if (closestOpp === null) {
                closestOpp = lLn.src[0];
              } else {
                closestOpp = Math.max(closestOpp, lLn.src[0]);
              }
            }
          }
          if (closestOpp !== null && closestOpp < lLft) {
            continue goldsplit;
          }
          if ((lTop <= top && top < lBot) || (lTop < bot && bot <= lBot)) {
            good = false;
            break goldsplit;
          }
        }
        if (ln.dir === "R" && top < lTop) {
          let closestOpp = null;
          for (let l = 0; l < lines.length; l++) {
            const lLn = lines[l];
            if (
              lLn.dir === "L" &&
              ((lLn.dst[0] <= lft && lft < lLn.src[0]) ||
                (lLn.dst[0] < rgt && rgt <= lLn.src[0])) &&
              lLn.src[1] >= bot
            ) {
              if (closestOpp === null) {
                closestOpp = lLn.src[1];
              } else {
                closestOpp = Math.min(closestOpp, lLn.src[1]);
              }
            }
          }
          if (closestOpp !== null && closestOpp < lTop) {
            continue goldsplit;
          }
          if ((lLft <= lft && lft < lRgt) || (lLft < rgt && rgt <= lLft)) {
            good = false;
            break goldsplit;
          }
        }
        if (ln.dir === "L" && bot > lBot) {
          let closestOpp = null;
          for (let l = 0; l < lines.length; l++) {
            const lLn = lines[l];
            if (
              lLn.dir === "R" &&
              ((lLn.dst[0] <= lft && lft < lLn.src[0]) ||
                (lLn.dst[0] < rgt && rgt <= lLn.src[0])) &&
              lLn.src[1] <= top
            ) {
              if (closestOpp === null) {
                closestOpp = lLn.src[1];
              } else {
                closestOpp = Math.max(closestOpp, lLn.src[1]);
              }
            }
          }
          // if closest opposing line is above this line, ignore it
          if (closestOpp !== null && closestOpp > lBot) {
            continue goldsplit;
          }
          if ((lLft <= lft && lft < lRgt) || (lLft < rgt && rgt <= lLft)) {
            good = false;
            break goldsplit;
          }
        }
      }
      if (good && w * h > gold) {
        console.log(tiles[i], tiles[j], w * h);
        gold = Math.max(gold, w * h);
      }
    }
  }

  // need to detect collission between polygon and AABB

  return {
    silver: silver.toString(),
    gold: gold.toString(),
  };
}

day09.set("main", Main);

export default day09;
