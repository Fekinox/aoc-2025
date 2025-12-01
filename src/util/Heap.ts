export type HeapItem<K, V> = {
  key: K;
  value: V;
};

export type ComparisonFunction<K> = (a: K, b: K) => boolean;

export class Heap<K, V> {
  private data: HeapItem<K, V>[];
  private lt: ComparisonFunction<K>;

  constructor(lt: ComparisonFunction<K>) {
    this.data = [];
    this.lt = lt;
  }

  static makeMinHeap<V>() {
    return new Heap<number, V>((a, b) => a < b);
  }

  static makeMaxHeap<V>() {
    return new Heap<number, V>((a, b) => a > b);
  }

  private siftUp(idx: number) {
    while (idx > 0) {
      const cur = this.data[idx];
      const parent = this.data[Math.floor(idx / 2)];
      if (this.lt(parent.key, cur.key)) {
        return;
      }
      [this.data[idx], this.data[Math.floor(idx / 2)]] = [parent, cur];

      idx = Math.floor(idx / 2);
    }
  }

  private siftDown(idx: number) {
    while (2 * idx <= this.data.length - 1) {
      const left = 2 * idx;
      const right = 2 * idx + 1;
      let smallest = idx;

      if (
        left <= this.data.length - 1 &&
        this.lt(this.data[left].key, this.data[smallest].key)
      ) {
        smallest = left;
      }

      if (
        right <= this.data.length - 1 &&
        this.lt(this.data[right].key, this.data[smallest].key)
      ) {
        smallest = right;
      }

      if (smallest == idx) {
        return;
      }

      [this.data[idx], this.data[smallest]] = [
        this.data[smallest],
        this.data[idx],
      ];
      idx = smallest;
    }
  }

  push(key: K, value: V) {
    this.data.push({ key: key, value: value });
    this.siftUp(this.data.length - 1);
  }

  pop() {
    if (this.data.length === 0) {
      return null;
    }

    const res = this.data[0];
    this.data[0] = this.data[this.data.length - 1];
    this.data.pop();
    this.siftDown(0);
    return res;
  }

  peek() {
    if (this.data.length === 0) {
      return null;
    }
    return this.data[0];
  }

  length() {
    return this.data.length;
  }
}
