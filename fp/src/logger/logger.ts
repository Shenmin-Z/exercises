import { Monad, Chain, chain, Seq, seq, Inject } from "../Monad";

export type Log = string[];

export class Logger<T extends unknown> extends Monad<T> {
  private data: T;
  private log: Log;

  constructor([d, s]: [T, Log | null]) {
    super();
    this.log = s ? s : [];
    this.data = d;
  }

  chain<U>(fn: (a: T) => Logger<U>): Logger<U> {
    let [data, log] = Logger.execLogger(this);
    let newLogger = fn(data);
    let [newData, newLog] = Logger.execLogger<U>(newLogger);
    return new Logger([newData, log.concat(newLog)]);
  }

  static execLogger<U>(logger: Logger<U>): [U, Log] {
    return [logger.data, logger.log];
  }

  static record(s: string): Logger<any> {
    return new Logger([null, [s]]);
  }

  static inject<U>(d: U) {
    return new Logger<U>([d, null]);
  }
}

export let runLogger = Logger.execLogger;
export let record = Logger.record;
export let injectLogger: Inject = <T>(d: T) => Logger.inject(d);
