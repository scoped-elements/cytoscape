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
  @property({ attribute: true })
  fixed = false;

  @property()
  options: CytoscapeOptions = {};

  @property()
  set elements(allElements: Array<NodeDefinition | EdgeDefinition>) {
    if (this.cy) {
      this.cy.remove('node');
      this.cy.add(allElements);

      if (this.fixed) {
        this.cy.layout(this.layout()).run();
      }
    }
    this._elements = allElements;
  }

  cy!: Core;

  _elements: Array<NodeDefinition | EdgeDefinition> = [];

  @query('#graph')
  _graphElement!: HTMLElement;

  firstUpdated() {
    this.cy = cytoscape({
      container: this._graphElement,
      elements: this._elements,
      layout: this.layout(),
      autoungrabify: this.fixed,
      userPanningEnabled: !this.fixed,
      userZoomingEnabled: !this.fixed,
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

    this.cy.ready(() => {
      this.cy.fit();
      this.cy.center();
      this.cy.resize();
      this.cy.layout(this.layout()).run();
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
