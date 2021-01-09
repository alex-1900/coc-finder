import { BasicList, ListAction, ListContext, ListItem, Neovim, window, Uri, workspace } from 'coc.nvim';

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
      window.showMessage(`${item.label}, ${item.data.name}`);
      let fullpath = item.data.location;
      await workspace.jumpTo(Uri.file(fullpath).toString(), null, jumpCommand);
    });
  }

  public async loadItems(context: ListContext): Promise<ListItem[]> {
    return [
      {
        label: 'coc-finder list item 1',
        data: {
            location: 'C:\\Users\\admin\\ppData\\Local\\nvim\\autoload\\materia\\common\\options.vim'
        },
      },
      {
        label: 'coc-finder list item 2',
        data: {
          location: 'C:\\Users\\admin\\ppData\\Local\\nvim\\autoload\\materia\\common\\commands.vim'
        },
      },
    ];
  }
}
