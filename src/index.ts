/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2015, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
'use strict';

export * from './menuiteminterface';
export * from './menusolver';
export * from './menusolverfunctions';

import {
  IMenuItem
} from './menuiteminterface';

export
interface IMenuManager {
  allMenuItems(): IMenuItem[];
}

export
class MenuManager implements IMenuManager {
  constructor(input: IMenuItem[]) {
    this._items = input;
  }

  allMenuItems(): IMenuItem[] {
    return this._items;
  }

  private _items: IMenuItem[];
}
