export default function groupBy(s: string, sep = "\n"): string[][] {
  const groups: string[][] = [];
  let curGroup: string[] = [];
  for (const line in s.split(sep)) {
    if (line === "\n") {
      groups.push(curGroup);
      curGroup = [];
      continue;
    }
    curGroup.push(line);
  }
  groups.push(curGroup);
  return groups;
}
