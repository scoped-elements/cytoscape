// @ts-ignore
import dagre from 'cytoscape-dagre';
import cytoscape from 'cytoscape';
import { property } from 'lit/decorators.js';
import { CytoscapeBase } from './cytoscape-base.js';

cytoscape.use(dagre); // register extension

export class CytoscapeDagre extends CytoscapeBase {
  @property()
  dagreOptions = {};

  layout() {
    return {
      name: 'dagre',
      ...this.dagreOptions,
    };
  }
}
