import { Info, FilePath, getUsefulContents, getInfo } from "./file";
import {join} from 'path'

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
type Iterator<S> = (a: S) => (b: Info) => Iterate<S>;

async function foldTree<S>(iter: Iterator<S>, initSeed:S, path: FilePath) {
  const endSeed = await fold(initSeed, path)
  return Promise.resolve(endSeed.unwrap())

  async function fold(seed: S, subpath: FilePath) {
    const names = await getUsefulContents(path)
    return walk(seed, names)
  }

  function walk(seed: S, [name, ...names]: FilePath[]) {
    const path_ = join(path, name)
    const info = getInfo(path_)
    const seedWrapper = iter(seed)(info)
    if (seedWrapper instanceof Done) {
      return seedWrapper
    }
    if (seedWrapper instanceof Skip) {
      const seed_ = seedWrapper.unwrap()
      return walk(seed_, names)
    }
    if (seedWrapper instanceof Continue) {
    }
  }
}
