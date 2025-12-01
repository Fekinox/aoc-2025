type MemoFunction<Input, Output> = (
  v: Input,
  rec: (v: Input) => Output,
) => Output;

function recurse<Input, Output>(
  memo: Map<Input, Output>,
  f: MemoFunction<Input, Output>,
  v: Input,
) {
  let val = memo.get(v);
  if (val !== undefined) {
    return val;
  }
  val = f(v, (vv) => {
    return recurse(memo, f, vv);
  });
  memo.set(v, val);
  return val;
}

export default function memoize<Input, Output>(
  fn: MemoFunction<Input, Output>,
) {
  const memo = new Map();
  return (v: Input) => recurse(memo, fn, v);
}
