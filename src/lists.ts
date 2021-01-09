import { BasicList, ListAction, ListContext, ListItem, Neovim, window, Uri, workspace, Position } from 'coc.nvim';
// import colors from 'colors/safe'
import { exec, ChildProcess } from 'child_process'

export default class DemoList extends BasicList {
  public readonly name = 'demo_list';
  public readonly description = 'CocList for coc-finder';
  public readonly defaultAction = 'open';
  public actions: ListAction[] = [];

  constructor(nvim: Neovim) {
    super(nvim);

    const preferences = workspace.getConfiguration('coc.preferences')
    let jumpCommand = preferences.get<string>('jumpCommand', 'open')

    this.addAction('open', async (item: ListItem) => {
      // window.showMessage(`${item.label}, ${item.data.name}`);
      let uri = item.data.location.uri;
      let position = Position.create(item.data.line, item.data.character)
      await workspace.jumpTo(uri, position, jumpCommand);
    });
  }

  public async loadItems(context: ListContext): Promise<ListItem[]> {
    const { args } = context
    if (args.length === 0) {
      return [];
    }

    const keyWord: string = args[0];
    const result: ListItem[] = [];
    // const reg: RegExp = new RegExp(keyWord)
    let jsons = await runCommand(`rg --json --with-filename --column --line-number --color never -F ${keyWord} F:\\dev\\time_difference_deployment`);
    // const jsons = content.replace(/\n$/, '').split('\n')
    for (const json of jsons) {
      const obj = JSON.parse(json)
      if (obj.type === 'match') {
        const uri = Uri.file(obj.data.path.text).toString()
        result.push({
          label: `${obj.data.path.text} |${obj.data.line_number}| ${obj.data.lines.text}`,
          data: {
            location: {
              uri,
              line: obj.data.line_number,
              character: obj.data.lines.text.indexOf(keyWord)
            }
          },
          location: {
            uri,
            line: obj.data.lines.text,
            text: keyWord
          }
        });
      }
    }
    return result;
  }
}

function runCommand(cmd: string, timeout?: number): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    if (timeout) {
      setTimeout(() => {
        reject(new Error(`timeout after ${timeout}s`))
      }, timeout * 1000)
    }
    const childProcess: ChildProcess = exec(cmd)
    const result: Array<string> = []
    if (childProcess.stdout) {
      childProcess.stdout.on('data', content => {
        const jsons = content.replace(/\n$/, '').split('\n')
        for (const json of jsons) {
          result.push(json)
        }
      });
      
      childProcess.on('close', () => {
        resolve(result)
      })
    } else {
      resolve('')
    }
  })
}
