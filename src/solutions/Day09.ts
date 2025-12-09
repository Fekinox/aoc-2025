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

    const res = {
      src: tiles[i],
      dst: tiles[j],
      top: Math.min(tiles[i][1], tiles[j][1]),
      bot: Math.max(tiles[i][1], tiles[j][1]),
      lft: Math.min(tiles[i][0], tiles[j][0]),
      rgt: Math.max(tiles[i][0], tiles[j][0]),
      dir: "R",
    };

    if (dx === 0 && dy === -1) {
      res.dir = "U";
    } else if (dx === 0 && dy === 1) {
      res.dir = "D";
    } else if (dy === 0 && dx === -1) {
      res.dir = "L";
    }

    return res;
  });

  const lLines = [];
  const rLines = [];
  const uLines = [];
  const dLines = [];

  for (const l of lines) {
    switch (l.dir) {
      case "U":
        uLines.push(l);
        break;
      case "D":
        dLines.push(l);
        break;
      case "L":
        lLines.push(l);
        break;
      case "R":
        rLines.push(l);
        break;
    }
  }

  for (let i = 0; i < tiles.length; i++) {
    for (let j = i + 1; j < tiles.length; j++) {
      const w = Math.abs(tiles[i][0] - tiles[j][0]) + 1;
      const h = Math.abs(tiles[i][1] - tiles[j][1]) + 1;
      const area = w * h;

      const top = Math.min(tiles[i][1], tiles[j][1]);
      const bot = Math.max(tiles[i][1], tiles[j][1]);
      const lft = Math.min(tiles[i][0], tiles[j][0]);
      const rgt = Math.max(tiles[i][0], tiles[j][0]);
      if (silver < area) {
        silver = w * h;
      }

      if (gold < area) {
        let good = true;
        goldsplit: for (let k = 0; k < tiles.length; k++) {
          const ln = lines[k];

          if (ln.dir === "D" && rgt > ln.rgt) {
            let closestOpp = null;
            for (const lLn of uLines) {
              if (
                ((lLn.top <= top && top < lLn.bot) ||
                  (lLn.top < bot && bot <= lLn.bot)) &&
                lLn.rgt >= rgt
              ) {
                if (closestOpp === null) {
                  closestOpp = lLn.src[0];
                } else {
                  closestOpp = Math.min(closestOpp, lLn.src[0]);
                }
                if (closestOpp < ln.rgt) {
                  continue goldsplit;
                }
              }
            }
            if (
              (ln.top <= top && top < ln.bot) ||
              (ln.top < bot && bot <= ln.bot)
            ) {
              good = false;
              break goldsplit;
            }
          }
          if (ln.dir === "U" && lft < ln.lft) {
            let closestOpp = null;
            for (const lLn of dLines) {
              if (
                ((lLn.top <= top && top < lLn.bot) ||
                  (lLn.top < bot && bot <= lLn.bot)) &&
                lLn.lft <= lft
              ) {
                if (closestOpp === null) {
                  closestOpp = lLn.src[0];
                } else {
                  closestOpp = Math.max(closestOpp, lLn.src[0]);
                }
                if (closestOpp < ln.lft) {
                  continue goldsplit;
                }
              }
            }
            if (
              (ln.top <= top && top < ln.bot) ||
              (ln.top < bot && bot <= ln.bot)
            ) {
              good = false;
              break goldsplit;
            }
          }
          if (ln.dir === "R" && top < ln.top) {
            let closestOpp = null;
            for (const lLn of lLines) {
              if (
                ((lLn.lft <= lft && lft < lLn.rgt) ||
                  (lLn.lft < rgt && rgt <= lLn.rgt)) &&
                lLn.bot >= bot
              ) {
                if (closestOpp === null) {
                  closestOpp = lLn.src[1];
                } else {
                  closestOpp = Math.min(closestOpp, lLn.src[1]);
                }
                if (closestOpp < ln.top) {
                  continue goldsplit;
                }
              }
            }
            if (
              (ln.lft <= lft && lft < ln.rgt) ||
              (ln.lft < rgt && rgt <= ln.lft)
            ) {
              good = false;
              break goldsplit;
            }
          }
          if (ln.dir === "L" && bot > ln.bot) {
            let closestOpp = null;
            for (const lLn of rLines) {
              if (
                ((lLn.lft <= lft && lft < lLn.rgt) ||
                  (lLn.lft < rgt && rgt <= lLn.rgt)) &&
                lLn.top <= top
              ) {
                if (closestOpp === null) {
                  closestOpp = lLn.src[1];
                } else {
                  closestOpp = Math.max(closestOpp, lLn.src[1]);
                }
                if (closestOpp > ln.bot) {
                  continue goldsplit;
                }
              }
            }
            if (
              (ln.lft <= lft && lft < ln.rgt) ||
              (ln.lft < rgt && rgt <= ln.lft)
            ) {
              good = false;
              break goldsplit;
            }
          }
        }
        if (good) {
          gold = area;
        }
      }
    }
  }

  // need to detect collission between polygon and AABB

  return {
    silver: silver.toString(),
    gold: gold.toString(),
  };
}

function Slick(text: string) {
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

    const res = {
      src: tiles[i],
      dst: tiles[j],
      top: Math.min(tiles[i][1], tiles[j][1]),
      bot: Math.max(tiles[i][1], tiles[j][1]),
      lft: Math.min(tiles[i][0], tiles[j][0]),
      rgt: Math.max(tiles[i][0], tiles[j][0]),
      dir: "R",
    };

    if (dx === 0 && dy === -1) {
      res.dir = "U";
    } else if (dx === 0 && dy === 1) {
      res.dir = "D";
    } else if (dy === 0 && dx === -1) {
      res.dir = "L";
    }

    return res;
  });

  for (let i = 0; i < tiles.length; i++) {
    for (let j = i + 1; j < tiles.length; j++) {
      const w = Math.abs(tiles[i][0] - tiles[j][0]) + 1;
      const h = Math.abs(tiles[i][1] - tiles[j][1]) + 1;
      const area = w * h;

      if (silver < area) {
        silver = w * h;
      }

      if (gold < area) {
        let skip = false;
        inner: for (const ln of lines) {
          if (ln.src[0] === ln.dst[0]) {
            console.log(
              ln.dir,
              ln.src[0] > tiles[i][0],
              ln.src[0] > tiles[j][0],
            );
            skip =
              ln.src[0] > tiles[i][0] !== ln.src[0] > tiles[j][0] &&
              (ln.src[1] > tiles[i][1] !== ln.dst[1] > tiles[i][1] ||
                ln.src[1] > tiles[j][1] !== ln.dst[1] > tiles[j][1]);
          } else {
            skip =
              ln.src[1] > tiles[i][1] !== ln.src[1] > tiles[j][1] &&
              (ln.src[0] > tiles[i][0] !== ln.dst[0] > tiles[i][0] ||
                ln.src[0] > tiles[j][0] !== ln.dst[0] > tiles[j][0]);
          }
          if (skip) {
            console.log(tiles[i], tiles[j], ln.src, ln.dst);
            break inner;
          }
        }
        if (skip) {
          continue;
        }
        gold = area;
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
day09.set("slick", Slick);

export default day09;
