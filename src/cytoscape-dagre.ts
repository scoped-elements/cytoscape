// @ts-ignore
import dagre from 'cytoscape-dagre';
import cytoscape from 'cytoscape';
import { customElement, property } from 'lit/decorators.js';
import { CytoscapeBase } from './cytoscape-base.js';

cytoscape.use(dagre); // register extension

@customElement('cytoscape-dagre')
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
