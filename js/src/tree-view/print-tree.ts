export type TreeNode = {
  name: string;
  children: TreeNode[];
};

// Up: 0; Right: 1; Down: 2; Left: 3
const T012 = "├";
const T13 = "─";
const T01 = "└";
const T03 = "│";

export function printTree(roots: TreeNode[]): string[] {
  const flatMap = <T>(items: Array<Array<T> | T>): T[] => {
    return items
      .map(i => (Array.isArray(i) ? i : [i]))
      .reduce((prev, cur) => [...prev, ...cur], [])
      .filter(Boolean);
  };
  const innerPrintTree = (node: TreeNode, isLast: boolean[]): string[] => {
    const pipes = isLast
      .slice(0, isLast.length - 1)
      .map(last => `${last ? " " : T03}  `)
      .join("");
    const prefix = isLast[isLast.length - 1]
      ? `${T01}${T13} `
      : `${T012}${T13} `;
    const self = `${pipes}${prefix}${node.name}`;
    const children = flatMap(
      node.children.map((child, idx) =>
        innerPrintTree(child, [...isLast, idx === node.children.length - 1]),
      ),
    );
    return [self].concat(children);
  };
  return flatMap(
    roots.map((root, idx) => innerPrintTree(root, [idx === roots.length - 1])),
  );
}
