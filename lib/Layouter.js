import BPMNModdle from 'bpmn-moddle';
import { isConnection } from './utils/elementUtils';
import { Grid } from './Grid';

export class Layouter {
  constructor() {
    this.moddle = new BPMNModdle();
  }

  async layoutProcess(xml) {
    this.diagram = await this.moddle.fromXML(xml, 'bpmn:Definitions');

    // Clean existing DI
    this.cleanDi();
    this.createGridLayout();

  }

  cleanDi() {
    const { rootElement } = this.diagram;
    rootElement.diagrams = [];
  }

  createGridLayout() {

    const grid = new Grid();

    const { rootElement } = this.diagram;
    const flowElements = rootElement.rootElements[0].flowElements;

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
      console.log(lastElement);

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

  }
}