import { commands, CompleteResult, ExtensionContext, listManager, sources, window, workspace } from 'coc.nvim';
import DemoList from './lists';

// https://www.mankier.com/1/rg#--count-matches
// https://stackoverflow.com/questions/46756523/child-process-spawn-doesnt-emit-any-events

export async function activate(context: ExtensionContext): Promise<void> {
  window.showMessage(`coc-finder works!`);

  context.subscriptions.push(
    commands.registerCommand('coc-finder.Command', async (...args: any[]) => {
      window.showMessage(`coc-finder Commands works!`);
      workspace.nvim.command('CocList demo_list ' + args.join(' '))
    }),

    listManager.registerList(new DemoList(workspace.nvim)),

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
