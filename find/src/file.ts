import { access, constants, stat, readdir } from "fs";
import { Maybe, Nothing, Just, MaybeTernary } from "./utils";

export type Info = {
  infoPath: FilePath;
  infoPerms: Maybe<Permissions>;
  infoStats: Maybe<Stats>;
};

export type FilePath = string;
export type Permissions = {
  exist: boolean;
  readable: boolean;
  writable: boolean;
  executable: boolean;
};

const { F_OK, R_OK, W_OK, X_OK } = constants;
export function getFilePermissions(
  path: FilePath,
): Promise<Maybe<Permissions>> {
  function check(mode: number) {
    return new Promise(resolve => {
      access(path, mode, err => {
        resolve(!!err);
      });
    });
  }
  return new Promise(async resolve => {
    try {
      const exist = await check(F_OK);
      const readable = await check(R_OK);
      const writable = await check(W_OK);
      const executable = await check(X_OK);
      resolve(
        new Just({
          exist,
          readable,
          writable,
          executable,
        }),
      );
    } catch {
      resolve(new Nothing());
    }
  });
}

export function getFileStat(path: FilePath): Promise<Maybe<Stats>> {
  return new Promise(resolve => {
    stat(path, (err, stats) => {
      if (err) resolve(new Nothing());
      else resolve(new Just(stats));
    });
  });
}

export function getInfo(path: FilePath): Info {
  return {
    infoPath: path,
    infoPerms: getFilePermissions(path),
    infoStats: getFileStat(path),
  };
}

export function getUsefulContents(path: FilePath): Promise<Array<FilePath>> {
  return new Promise(resolve => {
    readdir(path, "utf8", (err, files) => {
      if (err) resolve([]);
      else resolve(files);
    });
  });
}

export function isDirectory(info: Info): boolean {
  return MaybeTernary(info.infoStats, false, stats => stats.isDirectory());
}

interface Stats {
  isFile(): boolean;
  isDirectory(): boolean;
  isBlockDevice(): boolean;
  isCharacterDevice(): boolean;
  isSymbolicLink(): boolean;
  isFIFO(): boolean;
  isSocket(): boolean;

  dev: number;
  ino: number;
  mode: number;
  nlink: number;
  uid: number;
  gid: number;
  rdev: number;
  size: number;
  blksize: number;
  blocks: number;
  atimeMs: number;
  mtimeMs: number;
  ctimeMs: number;
  birthtimeMs: number;
  atime: Date;
  mtime: Date;
  ctime: Date;
  birthtime: Date;
}
