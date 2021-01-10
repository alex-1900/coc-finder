import { exec, ChildProcess, ExecOptions } from 'child_process'

export function commandExecute(cmd: string, opts: ExecOptions = {}, timeout?: number): Promise<ChildProcess> {
  return new Promise<ChildProcess>((resolve, reject) => {
    let timer: NodeJS.Timer
    if (timeout) {
      timer = setTimeout(() => {
        reject(new Error(`timeout after ${timeout}s`));
      }, timeout * 1000);
    }
    opts.maxBuffer = 500 * 1024
    let childProcess: ChildProcess = exec(cmd, opts, () => {
      if (timer) {
        clearTimeout(timer);
      }
    });
    resolve(childProcess);
  });
}

/**
 * Transform args with '='
 * @param args string[]
 */
export function argsTransform(args: string[]): {[key: string]: any} {
  const result = {}
  for (const arg of args) {
    const trans = arg.split('=');
    if (trans.length == 1) {
      result[trans[0]] = true;
    } else if (trans.length > 1) {
      result[trans[0]] = trans[1];
    }
  }
  return result;
}
