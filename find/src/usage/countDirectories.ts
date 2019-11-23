import { Iterator, Continue, foldTree } from "..";
import { isDirectory, FilePath, getFilePath } from "../file";
import { printResult } from "./printResult";
import { join } from "path";

const countDirectories: Iterator<number> = (count, info) => {
  const dCount = isDirectory(info) ? count + 1 : count;
  return new Continue(dCount);
};

const findDirectories: Iterator<FilePath[]> = (dirs, info) => {
  const directories = isDirectory(info) ? [getFilePath(info), ...dirs] : dirs;
  return new Continue(directories);
};

const dir = join(__dirname, "../../../../ngm-site-www");
const r1 = foldTree(countDirectories, 0, dir);
printResult(r1);
const r2 = foldTree(findDirectories, [], dir);
printResult(r2);
