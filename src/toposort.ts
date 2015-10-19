/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2015, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
'use strict';

import {
  Queue
} from 'phosphor-queue';

/**
 * Flattens a shallow-nested array-of-arrays into a single array
 * with all elements.
 *
 * #### Examples
 * ```typescript
 * var data = [[1],[2],[3,4]];
 * shallowFlatten(data); // [1,2,3,4]
 * ```
 * or with strings:
 * ```typescript
 * var data = [['a'],['b'],['c','d']];
 * shallowFlatten(data); // ['a','b','c','d']
 * ```
 *
 * #### Notes
 * This runs in `O(n)` time.
 *
 * This is called `shallowFlatten` because it will not flatten arrays
 * to arbitrary levels of nesting, this only works 2 levels deep. This 
 * is sufficient for topsort as we're only dealing with edge lists.
 */
export 
function shallowFlatten(nested: any): any {
  return [].concat.apply([], nested);
}

/**
 * When combined with filter, returns the unique items in a flattened array.
 *
 * #### Examples
 * ```typescript
 * var data = [1,2,3,1];
 * testData.filter(unique); // [1,2,3]
 * ```
 *
 * #### Notes
 * This runs in `O(n)` time.
 */
export
function unique<T>(val: T, i: number, self: any): boolean {
  return self.indexOf(val) === i;
}

/**
 * Topological sort for the given set of edges. 
 *
 * This will return a linear ordering of the vertices,
 * if there are no cycles.
 *
 * #### Examples
 * ```typescript
 * var edges = [
 *   ['a','b'],
 *   ['b','c'],
 *   ['c','d']
 * ];
 * toposort<string>(edges); // ['a','b','c','d']
 * ```
 *
 * #### Notes
 * Topsort is a very simple method of providing a linear
 * ordering of DAG vertices, and is actually self-evident 
 * from the description of a graph.
 * The simplest topsort just repeatedly takes the vertices
 * with in-degree zero and removes them and their edges from
 * the graph, appending them to the linear ordering.
 *
 * This is *not* guaranteed to be stable. If the system is 
 * not fully constrained you could see variations.
 */
export 
function toposort<T>(edges: T[][]): T[] {
  var ordered: T[] = [];
  var zeroInQueue = new Queue<T>();

  var flattened = shallowFlatten(edges);
  var vertices = flattened.filter(unique);
  var inVertices = edges.map(x => x[1]);

  // set all initial counts to zero
  var initialCounts = vertices.reduce( 
    (prev: any, curr) => {prev[curr] = 0; return prev;}, {}
  );

  // get the in-degree for each vertex
  var inCount = inVertices.reduce((prev: any, curr) => {
    prev[curr] += 1; return prev;
  }, initialCounts);

  while(vertices.length > 0) {

    // Find all the vertices with in-degree zero and push them
    // onto the queue.
    for (var prop in inCount) {
      if(inCount.hasOwnProperty(prop) && inCount[prop] === 0) {
        var index = vertices.index(prop);
        if (index > -1) { vertices.splice(index, 1); }
        zeroInQueue.push(inCount[prop]);
      }
    }

    // TODO : Deal with zero in-degree (cycle) case.
    // if the queue is empty here, then the graph has
    // a cycle.

    // take all items off the queue, remove their details 
    // from the graph edges list and recalculate the
    // in-degree.
    while(!zeroInQueue.empty) {
      var item = zeroInQueue.pop();
      ordered.push(item);
      var itemEdges = edges.filter((edge) => edge[0] === item);
      itemEdges.map((edge: any) => inCount[edge[1]]--);
    }
  }
  return ordered;
}
