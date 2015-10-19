/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2015, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
'use strict';

import {
  ICommand, CommandManager
} from 'phosphor-command';

import {
  IKeySequence, IKeymapManagerOptions, KeymapManager
} from 'phosphor-keymap';

import {
  Message
} from 'phosphor-messaging';

import {
  ResizeMessage, Widget, attachWidget
} from 'phosphor-widget';

import {
  ISignal, Signal
} from 'phosphor-signaling';

import {
  // IMenuItem, 
  MenuSolver, MenuManager
} from '../../../lib/index';

import {
  Menu, MenuItem, MenuBar
} from 'phosphor-menus';

import {
  Tab, TabPanel
} from 'phosphor-tabs';

import './index.css';


var COMM = new CommandManager();
var panel = new TabPanel();

var KEYMAP = [
  {
    "id": "dock.new.codepanel",
    "input": "Ctrl-P"
  }
];


var MENU = [
  {
    "location": ["File", "New Notebook", "Python 3"],
    "command": "dock.new.codepanel",
    "short_desc": "Code Panel",
    "long_desc": "Adds a new Dock item with a Codemirror widget."
  },
  {
    "location": ["File", "New Notebook", "Julia"],
    "command": "notebook.new.julia"
  },
  {
    "location": ["File", "Open..."],
    "command": "notebook.open",
  },
  {
    "location": ["File", "Make a copy..."],
    "command": "notebook.copy"
  },
  {
    "location": ["File", "Rename..."],
    "command": "notebook.rename"
  },
  {
    "location": ["File", "Save and checkpoint"],
    "command": "notebook.checkpoint.save"
  },
  {
    "location": ["File", "Revert to Checkpoint"],
    "command": "notebook.checkpoint.revert.<timestamp>"
  },
  {
    "location": ["File", "Print Preview"],
    "command": "notebook.print.preview"
  },
  {
    "location": ["File", "Download as", "IPython notebook"],
    "command": "notebook.download.as_ipynb"
  },
  {
    "location": ["File", "Download as", "PDF"],
    "command": "notebook.download.as_pdf"
  },
  {
    "location": ["File", "Trusted Notebook"],
    "command": "notebook.trusted"
  },
  {
    "location": ["File", "Close and Halt"],
    "command": "notebook.close_and_halt"
  },
  // Edit
  //
  {
    "location": ["Edit", "Cut Cell"],
    "command": "global.edit.cut_cell"
  },
  {
    "location": ["Edit", "Copy Cell"],
    "command": "global.edit.copy_cell"
  },
  {
    "location": ["Edit", "Paste Cell Above"],
    "command": "global.edit.paste_cell_above"
  },
  {
    "location": ["Edit", "Paste Cell Below"],
    "command": "global.edit.paste_cell_below"
  },
  {
    "location": ["Edit", "Paste Cell & Replace"],
    "command": "global.edit.paste_cell_replace"
  },
  {
    "location": ["Edit", "Spit Cell"],
    "command": "global.edit.split_cell"
  },
  {
    "location": ["Edit", "Merge Cell Above"],
    "command": "global.edit.merge_cell_above"
  },
  {
    "location": ["Edit", "Merge Cell Below"],
    "command": "global.edit.merge_cell_below"
  },
  {
    "location": ["Edit", "Move Cell Up"],
    "command": "global.edit.move_cell_up"
  },
  {
    "location": ["Edit", "Move Cell Down"],
    "command": "global.edit.move_cell_down"
  },
  {
    "location": ["Edit", "Edit Notebook Metadata"],
    "command": "global.edit.edit_metadata"
  },
  // View
  //
  {
    "location": ["View", "Toggle Header"],
    "command": "global.view.toggle_header"
  },
  {
    "location": ["View", "Toggle Toolbar"],
    "command": "global.view.toggle_toolbar"
  },
  // Cell
  //
  {
    "location": ["Cell", "Run"],
    "command": "cell.run",
  },
  {
    "location": ["Cell", "Run and Select Below"],
    "command": "cell.run_select_below"
  },
  {
    "location": ["Cell", "Run and Insert below"],
    "command": "cell.run_insert_below"
  },
  {
    "location": ["Cell", "Run All"],
    "command": "cell.run_all"
  },
  {
    "location": ["Cell", "Run All Above"],
    "command": "cell.run_all_above"
  },
  {
    "location": ["Cell", "Run All Below"],
    "command": "cell.run_all_below"
  },
  {
    "location": ["Cell", "Cell Type", "Code"],
    "command": "cell.type.code"
  },
  {
    "location": ["Cell", "Cell Type", "Markdown"],
    "command": "cell.type.markdown"
  },
  {
    "location": ["Cell", "Cell Type", "Raw NBConvert"],
    "command": "cell.type.nbconvert"
  },

  // Kernel
  //
  {
    "location": ["Kernel", "Interrupt"],
    "command": "global.kernel.interrupt"
  },
  {
    "location": ["Kernel", "Restart"],
    "command": "global.kernel.restart"
  },
  {
    "location": ["Kernel", "Reconnect"],
    "command": "global.kernel.reconnect"
  },
  {
    "location": ["Kernel", "Change kernel", "Python 3"],
    "command": "global.kernel.change.python_3"
  },
  {
    "location": ["Kernel", "Change kernel", "Julia"],
    "command": "global.kernel.change.julia"
  },
  // Help
  //
  {
    "location": ["Help", "User Interface Tour"],
    "command": "global.help.ui_tour"
  },
];


var newCodePanelCommand = {
  id: "dock.new.codepanel",
  handler: () => {
    panel.addWidget(new CodeMirrorWidget('Code'));
  }
}


var newTesterPanelCommand = {
  id: "dock.new.testerpanel",
  handler: () => {
    panel.addWidget(new CommandTesterTab());
  }
}


COMM.registerCommand(newCodePanelCommand);
COMM.registerCommand(newTesterPanelCommand);


/**
 * CodeMirror widget - use from separate widgets directory, when avaiable
 */
class CodeMirrorWidget extends Widget {

  constructor(title: string, config?: CodeMirror.EditorConfiguration) {
    super();
    this.addClass('content');
    this.addClass(title.toLowerCase());
    this._cm = CodeMirror(this.node, config);
    var tab = new Tab(title);
    tab.closable = true;
    TabPanel.setTab(this, tab);
  }

  dispose(): void {
    this._cm = null;
    super.dispose();
  }

  get editor(): CodeMirror.Editor {
    return this._cm;
  }

  protected onAfterAttach(msg: Message): void {
    this._cm.refresh();
  }

  protected onResize(msg: ResizeMessage): void {
    this._cm.setSize(msg.width, msg.height);
  }

  private _cm: CodeMirror.Editor;
}


/**
 * Command tester
 */
class CommandTesterTab extends Widget {

  constructor() {
    super();
    var tab = new Tab('Tester');
    TabPanel.setTab(this, tab);
    var btn = document.createElement('input');
    btn.type = 'button';
    btn.name = 'newCodeButton';
    btn.value = "New Code Panel";
    btn.onclick = () => COMM.runCommand('dock.new.codepanel');
    this.node.appendChild(btn);
  }
}


function main(): void {

  var menuManager = new MenuManager(MENU);
  //COMM.registerCommandInvoker(menuManager);

  var keyManager = new KeymapManager('mozilla');
  // COMM.registerCommandInvoker(keyManager);

  // keyManager.registerShortcutAdder(menuManager);
  // menuManager.registerShortcuts();

  var tester = new CommandTesterTab();
  var initial = new CodeMirrorWidget('Code');
  panel.addWidget(initial);
  panel.addWidget(tester);

  var solver = new MenuSolver(menuManager);
  var menubar = solver.solve();
  menubar.id = 'menubar';
  panel.id = 'main';

  attachWidget(menubar, document.body);
  attachWidget(panel, document.body);

  window.onresize = () => panel.update();
}


window.onload = main;
