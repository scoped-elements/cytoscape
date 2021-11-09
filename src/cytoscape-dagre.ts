// @ts-ignore
import dagre from 'cytoscape-dagre';
import cytoscape from 'cytoscape';
import { CytoscapeBase } from './cytoscape-base';

cytoscape.use(dagre); // register extension

export class CytoscapeDagre extends CytoscapeBase {
  layout() {
    return {
      name: 'dagre',
    };
  }
}
