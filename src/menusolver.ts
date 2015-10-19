/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2015, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
'use strict';

import {
  IMenuManager
} from './menumanagerinterface';

import {
  partialSolve
} from './menusolverfunctions';

import {
  MenuBar
} from 'phosphor-menus';

/**
 * A class to solve the relationships between menu items
 * and allow custom menu creation.
 *
 */
export
class MenuSolver {
  constructor(private _registry: IMenuManager) {}

  /**
   * We use topsort (topological sorting) to find the order of menu items
   * based on their names and constraints.
   * The constraints form dependencies (Before(y) means directed edge x -> y)
   * and therefore we can use topsort to find a suitable order. We won't use
   * a full DAG topsort; we only solve one level of the menu at a time because
   * the menu is just a simple tree, which we need the results for one branch
   * at a time.
   *
   */
  solve(): MenuBar { 
    /** 
     * The very top level of a menu is a MenuBar, which contains menu items.
     * Below this, everything is a menu item, either with 'text' and 'submenu'
     * (submenu contains a Menu() with a list of MenuItems) if it's not a leaf node, 
     * or 'text' and 'shortcut' if it is a leaf node.
     * We therefore hard code the top level here, and recursively search for the
     * rest inside partialSolve().
     */
     var allItems = this._registry.allMenuItems();
     var topLevel = partialSolve(allItems, []);
     var menubar = new MenuBar();
     menubar.items = topLevel;
     return menubar;
  }

}
