import { property } from 'lit/decorators.js';
import cytoscape from 'cytoscape';

// @ts-ignore
import cola from 'cytoscape-cola';
import { CytoscapeBase } from './cytoscape-base';

cytoscape.use(cola);

export class CytoscapeCola extends CytoscapeBase {
  @property()
  colaOptions = {};

  layout() {
    return {
      name: 'cola',
      ...this.colaOptions,
    };
  }
}
