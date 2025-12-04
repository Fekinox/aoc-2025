export type GridItem<T> = {
  x: number;
  y: number;
  value: T;
};

export class Grid<T> {
  width = 0;
  height = 0;
  data: T[];

  constructor();
  constructor(width: number, height: number, data: T[]);
  constructor(width?: number, height?: number, data?: T[]) {
    if (width === undefined) {
      this.width = 0;
      this.height = 0;
      this.data = [];
    } else if (height !== undefined && data !== undefined) {
      this.width = width;
      this.height = height;
      this.data = data;
    } else {
      this.width = 0;
      this.height = 0;
      this.data = [];
    }
  }

  static makeGrid<T>(width: number, height: number, def: T) {
    return new Grid(width, height, Array(width * height).fill(def));
  }

  static makeGridWith<T>(
    width: number,
    height: number,
    fn: (x: number, y: number) => T,
  ) {
    return new Grid(
      width,
      height,
      Array.from({ length: width * height }, (_, i) => {
        const x = i % width;
        const y = Math.floor(i / width);

        return fn(x, y);
      }),
    );
  }

  static gridFromSlice<T>(width: number, height: number, ...slice: T[]) {
    if (slice.length !== width * height) {
      throw new Error(
        `Invalid number of items: expected {width*height}, got {slice.length}`,
      );
    }

    return new Grid(width, height, slice);
  }

  static gridFromSlices<T>(...slices: T[][]) {
    const height = slices.length;
    let width = 0;
    if (height != 0) {
      width = slices[0].length;
    }
    return new Grid(
      width,
      height,
      Array.from({ length: width * height }, (_, i) => {
        const x = i % width;
        const y = Math.floor(i / width);
        return slices[y][x];
      }),
    );
  }

  static gridFromStrings(...strings: string[]): Grid<string> {
    return this.gridFromSlices(...strings.map((s) => Array.from(s)));
  }

  inBounds(x: number, y: number) {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  get(x: number, y: number) {
    if (!this.inBounds(x, y)) {
      return null;
    }

    return this.data[y * this.width + x];
  }

  mustGet(x: number, y: number) {
    return this.data[y * this.width + x];
  }

  set(x: number, y: number, v: T) {
    if (!this.inBounds(x, y)) {
      return;
    }

    this.data[y * this.width + x] = v;
  }

  resize(ox: number, oy: number, neww: number, newh: number, def: T) {
    return Grid.makeGridWith(neww, newh, (x, y) => {
      const xx = x - ox;
      const yy = y - oy;
      const v = this.get(xx, yy);
      if (v === null) {
        return def;
      }
      return v;
    });
  }

  region(ox: number, oy: number, w: number, h: number) {
    const res: GridItem<T>[] = [];
    const yLo = Math.max(oy, 0);
    const yHi = Math.min(oy + h, this.height - 1);
    const xLo = Math.max(ox, 0);
    const xHi = Math.min(ox + w, this.width - 1);

    for (let yy = yLo; yy <= yHi; yy++) {
      for (let xx = xLo; xx <= xHi; xx++) {
        res.push({
          x: xx,
          y: yy,
          value: this.mustGet(xx, yy),
        });
      }
    }

    return res;
  }

  neighborhood(x: number, y: number, radius: number, inclusive: boolean) {
    if (radius <= 0) {
      return [];
    }

    const res: GridItem<T>[] = [];
    const yLo = Math.max(y - radius, 0);
    const yHi = Math.min(y + radius, this.height - 1);
    const xLo = Math.max(x - radius, 0);
    const xHi = Math.min(x + radius, this.width - 1);

    for (let yy = yLo; yy <= yHi; yy++) {
      for (let xx = xLo; xx <= xHi; xx++) {
        if (!(!inclusive && xx == x && yy == y)) {
          res.push({
            x: xx,
            y: yy,
            value: this.mustGet(xx, yy),
          });
        }
      }
    }

    return res;
  }

  iter(f: (x: number, y: number, v: T) => void) {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        f(x, y, this.mustGet(x, y));
      }
    }
  }
}
