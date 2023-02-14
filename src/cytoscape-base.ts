import { css, html, LitElement, PropertyValues } from 'lit';
import { property, query } from 'lit/decorators.js';
import cytoscape, {
  Core,
  CytoscapeOptions,
  EdgeDefinition,
  LayoutOptions,
  NodeDefinition,
} from 'cytoscape';
import merge from 'lodash-es/merge';

export abstract class CytoscapeBase extends LitElement {
  @property()
  options: CytoscapeOptions = {};

  @property()
  set elements(allElements: Array<NodeDefinition | EdgeDefinition>) {
    if (this.cy) {
      const collection = this.cy.elements();

      const toRemove = collection.filter(
        ele => !allElements.find(newEl => newEl.data.id === ele.data().id)
      );
      const toAdd = allElements.filter(
        el => collection.getElementById(el.data.id as string).length === 0
      );

      this.cy.remove(toRemove);
      this.cy.add(toAdd);

      if (toAdd.length > 0 || toRemove.length > 0) {
        this.cy.layout(this.layout()).run();
        setTimeout(() => {
          this.cy.fit();
          this.cy.resize();
          this.requestUpdate();
        }, 500);
      }
      if (!this._elements || this._elements.length === 0) {
        this.cy.fit();
        this.cy.center();
        this.cy.resize();
        this.cy.layout(this.layout()).run();
      }
    }
    this._elements = allElements;
  }

  @property()
  selectedNodesIds: Array<string> = [];

  cy!: Core;

  _elements: Array<NodeDefinition | EdgeDefinition> | undefined;

  @query('#graph')
  _graphElement!: HTMLElement;

  firstUpdated() {
    const interval = setInterval(() => {
      if (window.getComputedStyle(this._graphElement).length > 0) {
        clearInterval(interval);
        this.setupCytoscape();
      }
    }, 10);
  }

  setupCytoscape() {
    const options = merge(
      {
        container: this._graphElement,
        elements: this._elements ? this._elements : [],
        layout: this.layout(),
      },
      this.options
    );

    this.cy = cytoscape(options);
    new ResizeObserver(() => {
      setTimeout(() => {
        this.cy.fit();
        this.cy.resize();

        this.requestUpdate();
      });
    }).observe(this);

    window.addEventListener('scroll', () => {
      this.cy.resize();
    });

    this.cy.on('tap', 'node', event => {
      this.selectedNodesIds.push(event.target.id());
      this.dispatchEvent(
        new CustomEvent('node-selected', {
          bubbles: true,
          composed: true,
          detail: event.target,
        })
      );
    });

    let rendered = false;
    this.cy.on('render', () => {
      if (this.cy.width() !== 0) {
        if (!rendered) {
          rendered = true;
          // This is needed to render the nodes after the graph itself
          // has resized properly so it computes the positions appriopriately
          setTimeout(() => {
            this.cy.fit();
            this.cy.center();

            this.cy.resize();
            this.cy.layout(this.layout()).run();
          });

          setTimeout(() => {
            this.cy.fit();
            this.cy.resize();
            this.requestUpdate();
          }, 500);
        }
      }
    });

    // this.cy.ready(() => {
    //   setTimeout(() => {
    //     this.cy.fit();
    //     this.cy.center();
    //     this.cy.resize();
    //     this.cy.layout(this.layout()).run();
    //   }, 10);
    // });
  }

  updated(changedValues: PropertyValues) {
    super.updated(changedValues);

    if (this.cy && changedValues.has('selectedNodesIds')) {
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
