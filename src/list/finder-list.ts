import { BasicList, ListAction, ListContext, ListItem, Neovim, Uri, workspace, window, Position } from 'coc.nvim';
import shellescape from 'shell-escape'
import { argsTransform, commandExecute } from '../util';
import { ChildProcess } from 'child_process'
import { RgMessageMatch } from '../interfaces';
import colors from 'colors/safe'

function rgCommandBuilder(mode: string, keyWord: string, cwd: string): string {
  return shellescape([
    'rg',
    '--json',
    '--with-filename',
    '--column',
    '--line-number',
    '--color', 'never',
    mode,
    keyWord,
    cwd
  ]);
}

function lineBuilder(lineText: string, indexStart: number, indexEnd: number) {
  let line = colors.white(lineText.substring(0, indexStart));
  line += colors.bgYellow(colors.white(lineText.substring(indexStart, indexEnd)));
  line += colors.white(lineText.substring(indexEnd));
  return line;
}

function listItemBuilder(message: RgMessageMatch): ListItem {
  const uri = Uri.file(message.data.path.text).toString();
  const { path, line_number, lines, submatches } = message.data;
  // Get the first submatch
  const indexStart = submatches.length > 0 ? submatches[0].start : 0;
  const indexEnd = submatches.length > 0 ? submatches[0].end : 0;
  const line = lineBuilder(lines.text, indexStart, indexEnd);
  return {
    label: colors.cyan(`${path.text} |${line_number}|`) + line,
    data: {
      uri,
      line_number,
      start: indexStart,
      end: indexEnd
    }
  };
}

function getResultFromChildProcess(childProcess: ChildProcess): Promise<string[]> {
  return new Promise<string[]>((resolve, reject) => {
    if (childProcess.stdout) {
      let jsonText: string = '';
      childProcess.stdout.on('data', (content: string) => {
        jsonText += content;
      });

      childProcess.on('exit', (code) => {
        switch (code) {
          case 0:
            const jsons = jsonText.replace(/\n$/, '').split('\n');
            resolve(jsons);
            break;
          case 1:  // no match
            resolve([]);
            break;
          default:
            reject(new Error(`Process exits with an exit code '${code}', please check your arguments`));
        }
      });

      childProcess.on('error', (err) => {
        reject(err);
      });
    }
  });
}

export default class FinderList extends BasicList {
  public readonly name = 'finder';
  public readonly description = 'CocList for finder-list';
  public readonly defaultAction = 'open';
  public readonly interactive = true;
  public actions: ListAction[] = [];

  private currentResult: ListItem[] = [];

  public constructor(nvim: Neovim) {
    super(nvim);

    const preferences = workspace.getConfiguration('coc.preferences')
    let jumpCommand = preferences.get<string>('jumpCommand', 'open')

    // action open file
    this.addAction('open', async (item: ListItem) => {
      const { uri, line_number, start, end } = item.data;
      const line = line_number - 1;
      const position = Position.create(line, start)
      const range = {
        start: {line, character: start},
        end:  {line, character: end}
      };
      await workspace.jumpTo(uri, position, jumpCommand);
      // workspace.applyEdit({
      //   changes: {
      //     uri: [{
      //       range,
      //       newText: ''
      //     }]
      //   }
      // })
      await (await workspace.nvim.buffer).highlightRanges(0, 'Search', [range])
    });

    this.addAction('preview', async (item, context) => {
      const { uri, line_number, start, end } = item.data;
      const line = line_number - 1;
      const range = {
        start: {line: line - 2, character: 0},
        end:  {line: line + 2, character: 0}
      };
      context.options.autoPreview = true;
      await this.previewLocation({uri, range}, context)
      return
    });
  }

  public async loadItems(context: ListContext): Promise<ListItem[]> {
    if (context.args.length > 0) {
      this.currentResult = [];
      const { key = '', mode = '-F', cwd = context.cwd } = argsTransform(context.args);
      const childProcess = await commandExecute(rgCommandBuilder(mode, key, cwd));
      try {
        const jsons: string[] = await getResultFromChildProcess(childProcess);
        for (const json of jsons) {
          const message = JSON.parse(json);
          if (message.type === 'match') {
            this.currentResult.push(listItemBuilder(message));
          }
        }
      } catch (err) {
        window.showWarningMessage(err.toString());
        this.currentResult = [];
        return this.currentResult;
      }
      window.showMessage('done.');
    }
    return this.currentResult;
  }
}
