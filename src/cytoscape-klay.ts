import { customElement, property } from 'lit/decorators.js';
import cytoscape from 'cytoscape';
// @ts-ignore
import klay from 'cytoscape-klay';
import { CytoscapeBase } from './cytoscape-base.js';

cytoscape.use(klay);

@customElement('cytoscape-klay')
export class CytoscapeKlay extends CytoscapeBase {
  @property()
  klayOptions = {};

  layout() {
    return {
      name: 'klay',
      ...this.klayOptions,
    };
  }
}
