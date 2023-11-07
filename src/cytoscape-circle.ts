import { customElement, property } from 'lit/decorators.js';
import { CytoscapeBase } from './cytoscape-base.js';

@customElement('cytoscape-circle')
export class CytoscapeCircle extends CytoscapeBase {
  @property()
  circleOptions = {};

  layout() {
    return {
      name: 'circle',
      ...this.circleOptions,
    };
  }
}
