import { css, html, LitElement, PropertyValues } from 'lit';
import { property, query } from 'lit/decorators.js';
import cytoscape, {
  Core,
  CytoscapeOptions,
  EdgeDefinition,
  LayoutOptions,
  NodeDefinition,
} from 'cytoscape';
import mergeWith from 'lodash-es/mergeWith';
import isString from 'lodash-es/isString';

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

  @property()
  selectedNodesIds: Array<string> = [];

  @property()
  selectedColor: string = 'yellow';

  cy!: Core;

  _elements: Array<NodeDefinition | EdgeDefinition> = [];

  @query('#graph')
  _graphElement!: HTMLElement;

  firstUpdated() {
    const options = mergeWith(
      {
        container: this._graphElement,
        elements: this._elements,
        layout: this.layout(),
        autoungrabify: this.fixed,
        style: `
        .selected {
          background-color: ${this.selectedColor};
        }`,
      },
      this.options,
      (objV, srcV) => {
        if (isString(objV)) return objV.concat(srcV);
      }
    );

    this.cy = cytoscape(options);
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
      setTimeout(() => {
        this.cy.fit();
        this.cy.center();
        this.cy.resize();
        this.cy.layout(this.layout()).run();
      });
    });
  }

  updated(changedValues: PropertyValues) {
    super.updated(changedValues);

    if (changedValues.has('selectedNodesIds')) {
      this.cy.filter('node').removeClass('selected');

      const nodeElements = this.cy.nodes();

      for (const nodeElement of nodeElements.toArray()) {
        const nodeId = nodeElement.id();
        if (this.selectedNodesIds.includes(nodeId)) {
          nodeElement.addClass('selected');
        }
      }
    }
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
