# @scoped-elements/cytoscape

This is the [cytoscape](https://js.cytoscape.org/) library packaged using the scoped custom elements registries pattern using [@open-wc/scoped-elements](https://www.npmjs.com/package/@open-wc/scoped-elements).

## Installation

```bash
npm i @scoped-elements/cytoscape
```

## Usage

### As an sub element in your own custom element

```js
import { CytoscapeDagre } from '@scoped-elements/cytoscape';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';

export class CustomElement extends ScopedElementsMixin(LitElement) {
  static get scopedElements() {
    return {
      'cytoscape-dagre': CytoscapeDagre,
    };
  }

  render() {
    return html`
      <cytoscape-dagre
        style="width: 100px; height: 100px;"
        .nodes=${[
          {
            // node a
            data: { id: 'a' },
          },
          {
            // node b
            data: { id: 'b' },
          },
        ]}
        .edges=${[
          {
            // edge ab
            data: { id: 'ab', source: 'a', target: 'b' },
          },
        ]}
        .options=${{
          autoungrabify: false,
        }}
      ></cytoscape-dagre>
    `;
  }
}
```

### As a globally defined custom element

```js
import { CytoscapeDagre } from '@scoped-elements/markdown-renderer';

customElements.define('cytoscape-dagre', CytoscapeDagre);
```

## Documentation for the elements

As this package is just a re-export, you can find the documentation for cytoscape [here](https://js.cytoscape.org/).
