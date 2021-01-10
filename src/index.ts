import { commands, CompleteResult, ExtensionContext, listManager, sources, window, workspace } from 'coc.nvim';
import FinderList from './list/finder-list';

// https://www.mankier.com/1/rg#--count-matches
// https://stackoverflow.com/questions/46756523/child-process-spawn-doesnt-emit-any-events

export async function activate(context: ExtensionContext): Promise<void> {
  window.showMessage(`coc-finder works!`);

  context.subscriptions.push(
    commands.registerCommand('coc-finder.list-open', async () => {
      workspace.nvim.command('CocList finder');
    }),

    commands.registerCommand('coc-finder.search-regexp', async (...args: any[]) => {
      window.requestInput('Regexp search').then(keyword => {
        if (keyword === null || keyword.length === 0) {
          window.showWarningMessage('Please input keywords');
          return;
        }
        window.showMessage('searching...');
        workspace.nvim.command(`CocList finder mode=-e key=${keyword}`);
      });
    }),

    commands.registerCommand('coc-finder.search-string', async (...args: any[]) => {
      window.requestInput('Text search').then(keyword => {
        if (keyword === null || keyword.length === 0) {
          window.showWarningMessage('Please input keywords');
          return;
        }
        window.showMessage('searching...');
        workspace.nvim.command(`CocList finder mode=-F key=${keyword}`);
      });
    }),

    listManager.registerList(new FinderList(workspace.nvim)),

    sources.createSource({
      name: 'coc-finder completion source', // unique id
      doComplete: async () => {
        const items = await getCompletionItems();
        return items;
      },
    }),

    workspace.registerKeymap(
      ['n'],
      'finder-keymap',
      async () => {
        window.showMessage(`registerKeymap`);
      },
      { sync: false }
    ),

    workspace.registerKeymap(
      ['x'],
      'finder-search-selected',
      async () => {
        window.showMessage(`registerKeymap`);
      },
      { sync: false }
    ),

    workspace.registerAutocmd({
      event: 'InsertLeave',
      request: true,
      callback: () => {
        window.showMessage(`registerAutocmd on InsertLeave`);
      },
    })
  );
}

async function getCompletionItems(): Promise<CompleteResult> {
  return {
    items: [
      {
        word: 'TestCompletionItem 1',
        menu: '[coc-finder]',
      },
      {
        word: 'TestCompletionItem 2',
        menu: '[coc-finder]',
      },
    ],
  };
}
