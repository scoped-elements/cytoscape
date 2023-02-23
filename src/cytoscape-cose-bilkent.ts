import { property } from 'lit/decorators.js';
import cytoscape from 'cytoscape';

// @ts-ignore
import coseBilkent from 'cytoscape-cose-bilkent';
import { CytoscapeBase } from './cytoscape-base.js';

cytoscape.use(coseBilkent);

export class CytoscapeCoseBilkent extends CytoscapeBase {
  @property()
  coseBilkentOptions = {};

  layout() {
    return {
      name: 'cose-bilkent',
      ...this.coseBilkentOptions,
    };
  }
}
