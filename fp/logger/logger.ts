import { Monad, GGE, gge, GG, gg, Inject } from "../Monad";

export type Log = string[];

export class Logger<T extends unknown> implements Monad<T> {
  data: T;
  log: Log;

  constructor([d, s]: [T, string]) {
    this.log = s ? [s] : [];
    this.data = d;
  }

  gge(f) {
    return new Logger([null, null]);
  }

  static execLogger<U>(logger: Logger<U>) {
    return [logger.data, logger.log];
  }

  static record(s: string) {
    return new Logger([null, s]);
  }

  static inject<U>(d: U) {
    return new Logger<U>([d, null]);
  }
}

export let runLogger = Logger.execLogger;
export let record = Logger.record;
export let injectLogger: Inject = <T>(d: T) => Logger.inject(d);
