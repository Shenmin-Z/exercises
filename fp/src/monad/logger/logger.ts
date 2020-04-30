import { Monad } from "../monad";

export type Log = string[];

export class Logger<T extends unknown> extends Monad<T> {
  private data: T;
  private log: Log;

  private constructor([d, s]: [T, Log | null]) {
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

  seq<B>(b: Logger<B>): Logger<B> {
    return super.seq(b) as Logger<B>;
  }

  of<U>(d: U) {
    return new Logger<U>([d, null]);
  }

  static execLogger<U>(logger: Logger<U>): [U, Log] {
    return [logger.data, logger.log];
  }

  static record(s: string): Logger<any> {
    return new Logger([null, [s]]);
  }
}

export let runLogger = Logger.execLogger;
export let record = Logger.record;
export let ofLogger = Logger.prototype.of;
