# @marstamm/bpmn-auto-layout

A rewrite of [bpmn-auto-layout](https://github.com/bpmn-io/bpmn-auto-layout).
Layouts BPMN diagrams using a grid.

## Usage

```javascript
import { layoutProcess } from "@marstamm/bpmn-auto-layout"

const diagram = "<bpmn:defintions ...></bpmn:defintions>"

const layoutedDiagram = await layoutProcess(diagram);
```

## Unsupported Concepts and elements

These are the current limitations: 
- Pools
- Subprocesses
- Boundary Events
- Data/Message Flows and Objects, Data Stores

## Development

```bash
npm install
npm run test
```

This will install all dependencies and run the tests.
To add a test case, add a bpmn file to the `test/fixtures` folder. It will automatically be picked up and
generate a layouted diagram in `test/generated`.


## License

MIT
