import BPMNModdle from 'bpmn-moddle';
import { isConnection } from './utils/elementUtils';
import { Grid } from './Grid';
import { DiFactory } from './di/DiFactory';
import { getDefaultSize } from './di/DiUtil';
import { connectElements, getBounds } from './utils/layoutUtil';

export class Layouter {
  constructor() {
    this.moddle = new BPMNModdle();
    this.diFactory = new DiFactory(this.moddle);
  }

  async layoutProcess(xml) {
    const { rootElement } = await this.moddle.fromXML(xml);

    this.diagram = rootElement;

    this.cleanDi();
    const layout = this.createGridLayout();
    this.generateDi(layout);

    return (await this.moddle.toXML(this.diagram, { format: true })).xml;
  }

  cleanDi() {
    this.diagram.diagrams = [];
  }

  createGridLayout() {

    const grid = new Grid();

    const process = this.getProcess();
    const flowElements = process.flowElements;

    const startingElements = flowElements.filter(el => {
      return !isConnection(el) && (!el.incoming || el.length === 0);
    });

    // Depth-first-search
    const stack = [ ...startingElements ];
    const visited = new Set();

    startingElements.forEach(el => {
      grid.add(el);
      visited.add(el);
    });

    while (stack.length > 0) {
      const lastElement = stack.pop();

      const outgoing = (lastElement.outgoing || [])
        .map(out => out.targetRef)
        .filter(el => el)
        .filter(el => !visited.has(el));

      outgoing.forEach((nextElement, index, arr) => {
        if (index === 0) {
          grid.addAfter(lastElement, nextElement);
        }
        else {
          grid.addBelow(arr[index - 1], nextElement);
        }
      });

      // add to stack in reverse order: first element should be first of the stack
      outgoing.reverse().forEach(el => {
        stack.push(el);
        visited.add(el);
      });
    }

    return grid;
  }

  generateDi(layoutGrid) {
    const diFactory = this.diFactory;

    // Step 0: Create Root element

    const diagram = this.diagram;
    const process = this.getProcess();


    var planeDi = diFactory.createDiPlane({
      id: 'BPMNPlane_1',
      bpmnElement: process
    });
    var diagramDi = diFactory.createDiDiagram({
      id: 'BPMNDiagram_1',
      plane: planeDi
    });

    diagram.diagrams.push(diagramDi);

    const planeElement = planeDi.get('planeElement');

    // Step 1: Create DI for all elements
    layoutGrid.elementsByPosition().forEach(({ element, row, col }) => {
      const bounds = getBounds(element, row, col);

      const shapeDi = diFactory.createDiShape(element, bounds, {
        id: element.id + '_di'
      });
      element.di = shapeDi;
      element.gridPosition = { row, col };

      planeElement.push(shapeDi);
    });

    // Step 2: Create DI for all connections
    layoutGrid.elementsByPosition().forEach(({ element, row, col }) => {
      const outgoing = element.outgoing || [];

      outgoing.forEach(out => {
        const target = out.targetRef;
        const waypoints = connectElements(element, target, layoutGrid);

        const connectionDi = diFactory.createDiEdge(out, waypoints, {
          id: out.id + '_di'
        });

        planeElement.push(connectionDi);

      });
    });
  }


  getProcess() {
    return this.diagram.get('rootElements').find(el => el.$type === 'bpmn:Process');
  }
}
