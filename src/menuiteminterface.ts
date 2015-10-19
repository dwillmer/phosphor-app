/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2015, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
'use strict';


/**
 * An interface describing attributes of a menu item.
 *
 * Menu items can be declared in an external JSON file, with the only
 * required fields being "location" and "command". For example, you can
 * define:
 * [
 *   {
 *    "location": ["New", "File"],
 *    "command": "app.file.new"
 *   },
 *  ...
 * ]
 * in order to describe the location in the menus for each item. The rest of the
 * fields are optional.
 *
 */
export
interface IMenuItem {
  /**
   * This is a menubar-specific array of strings to denote the location
   * in the menu hierarchy where this command should be placed.
   */
  location: string[];

  /**
   * The command that this menu item would like invoked when called.
   *
   */
  command: string;

  /**
   * An (optional) string denoting the shortcut for this specific command.
   * In the case of a command to be shown in a menu, this could
   * be something like 'Ctrl-Shift-T'
   */
  shortcut?: string[];

  /**
   * Menu constraints are lists of items which denote the position of
   * a given menu item in each 1-D list.
   *
   * This is slightly more complex than most people expect, as we need
   * to solve the menu order for any item with child items, so you can
   * define constraints for any level in the hierarchy.
   *
   * For example, if the menu location above was ["New", "Tab", "Code Panel"],
   * your constraints could be
   * {
   *  "Code Panel" : [Before("Console"), After("Word Document")],
   *  "Tab" : [After("Window")]
   * }
   * You should not *have* to implement a constraint for every level in the
   * location, but that is implementation-specific.
   *
   */
  constraints?: any;

  /**
   * Allows menu items to override the default text from the command to be
   * shown in the actual menu.
   */
  title_override?: any;
}
