import {
  Info,
  FilePath,
  getUsefulContents,
  getInfo,
  isDirectory,
} from "./file";
import { join } from "path";

class SeedWrapper<S> {
  constructor(public seed: S) {}
  unwrap() {
    return this.seed;
  }
}
class Done<S> extends SeedWrapper<S> {}
class Skip<S> extends SeedWrapper<S> {}
class Continue<S> extends SeedWrapper<S> {}

type Iterate<S> = Done<S> | Skip<S> | Continue<S>;
type Iterator<S> = (a: S, b: Info) => Iterate<S>;

export async function foldTree<S>(
  iter: Iterator<S>,
  initSeed: S,
  path: FilePath,
): Promise<S> {
  const endSeed = await fold(initSeed, path);
  return endSeed.unwrap();

  async function fold(seed: S, subpath: FilePath) {
    const names = await getUsefulContents(subpath);
    return walk(seed, names);
  }

  async function walk(
    seed: S,
    [name, ...names]: FilePath[],
  ): Promise<SeedWrapper<S>> {
    const path_ = join(path, name);
    const info = getInfo(path_);
    const seedWrapper = iter(seed, info);
    if (seedWrapper instanceof Done) {
      return seedWrapper;
    }
    if (seedWrapper instanceof Skip) {
      const seed_ = seedWrapper.unwrap();
      return walk(seed_, names);
    }
    if (seedWrapper instanceof Continue) {
      const seed_ = seedWrapper.unwrap();
      if (isDirectory(info)) {
        const next = await fold(seed_, path_);
        if (next instanceof Done) {
          return next;
        } else {
          return walk(next.unwrap(), names);
        }
      } else {
        return walk(seed_, names);
      }
    }
  }
}
