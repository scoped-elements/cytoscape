import { css, html, LitElement } from 'lit';
import { property, query } from 'lit/decorators.js';
import cytoscape, {
  Core,
  CytoscapeOptions,
  EdgeDefinition,
  LayoutOptions,
  NodeDefinition,
} from 'cytoscape';

export abstract class CytoscapeBase extends LitElement {
  _nodes: NodeDefinition[] = [];

  _edges: EdgeDefinition[] = [];

  @property()
  set nodes(allNodes: NodeDefinition[]) {
    if (this.cy) {
      const nodesToAdd = allNodes.filter(n => !this._nodes.includes(n));
      this.cy.add(nodesToAdd);
    }

    this._nodes = allNodes;
  }

  @property()
  set edges(allEdges: EdgeDefinition[]) {
    if (this.cy) {
      const edgesToAdd = allEdges.filter(e => !this._edges.includes(e));
      this.cy.add(edgesToAdd);
    }

    this._edges = allEdges;
  }

  @property()
  options: CytoscapeOptions = {};

  cy!: Core;

  @query('#graph')
  _graphElement!: HTMLElement;

  firstUpdated() {
    this.cy = cytoscape({
      container: this._graphElement,
      elements: {
        nodes: this._nodes,
        edges: this._edges,
      },
      layout: this.layout(),
      ...this.options,
    });
    new ResizeObserver(() => {
      setTimeout(() => {
        this.cy.resize();
        this.requestUpdate();
      });
    }).observe(this);

    this.cy.on('tap', 'node', event => {
      this.dispatchEvent(
        new CustomEvent('node-selected', {
          bubbles: true,
          composed: true,
          detail: event.target,
        })
      );
    });
  }

  render() {
    return html`<div id="graph" style="flex: 1;"></div>`;
  }

  abstract layout(): LayoutOptions;

  static styles = [
    css`
      :host {
        display: flex;
      }
    `,
  ];
}
