import Day01 from "./Day01";
import Day02 from "./Day02";
import Day03 from "./Day03";
import Day04 from "./Day04";
import Day05 from "./Day05";
import Day06 from "./Day06";
import Day07 from "./Day07";
import Day08 from "./Day08";
import Day09 from "./Day09";
import Day10 from "./Day10";
import Day11 from "./Day11";
import Day12 from "./Day12";

const Solutions = {
  solvers: [
    { name: "Day 01", collection: Day01 },
    { name: "Day 02", collection: Day02 },
    { name: "Day 03", collection: Day03 },
    { name: "Day 04", collection: Day04 },
    { name: "Day 05", collection: Day05 },
    { name: "Day 06", collection: Day06 },
    { name: "Day 07", collection: Day07 },
    { name: "Day 08", collection: Day08 },
    { name: "Day 09", collection: Day09 },
    { name: "Day 10", collection: Day10 },
    { name: "Day 11", collection: Day11 },
    { name: "Day 12", collection: Day12 },
  ],

  get: function (n: number, variant = "main") {
    const v = this.solvers[n].collection.get(variant);
    if (v === undefined) {
      throw new Error("cannot find variant");
    }
    return v;
  },
};

export default Solutions;
