import { printTree, TreeNode } from "./print-tree";

const L0_0: TreeNode = {
  name: "L0-0",
  children: [
    {
      name: "L1-0",
      children: [],
    },
    {
      name: "L1-1",
      children: [
        {
          name: "L2-0",
          children: [
            {
              name: "L3-0",
              children: [],
            },
            {
              name: "L3-1",
              children: [],
            },
          ],
        },
        {
          name: "L2-1",
          children: [],
        },
      ],
    },
  ],
};

const L0_1: TreeNode = {
  name: "L0-1",
  children: [
    {
      name: "L1-0",
      children: [
        {
          name: "L2-0",
          children: [],
        },
      ],
    },
  ],
};

test("Tree", () => {
  const result = [
    "├─ L0-0",
    "│  ├─ L1-0",
    "│  └─ L1-1",
    "│     ├─ L2-0",
    "│     │  ├─ L3-0",
    "│     │  └─ L3-1",
    "│     └─ L2-1",
    "└─ L0-1",
    "   └─ L1-0",
    "      └─ L2-0",
  ];
  const tree = printTree([L0_0, L0_1]);
  expect(tree).toEqual(result);
});
