export class Grid {
  constructor() {
    this.grid = [];
    this.cols = 0;
    this.rows = 0;
  }

  add(element) {
    this._addStart(element);
  }

  _addStart(element) {
    this.grid.push([ element ]);
  }

  addAfter(element, newElement) {
    if (!element) {
      this._addStart(newElement);
    }

    const [ row, col ] = this.find(element);
    this.grid[row].splice(col + 1, 0, newElement);
  }

  addBelow(element, newElement) {
    if (!element) {
      this._addStart(newElement);
    }

    const [ row, col ] = this.find(element);

    // We are at the bottom of the current grid - add empty row below
    if (!this.grid[row + 1]) {
      this.grid[row + 1] = [];
    }

    // The element below is already occupied - insert new row
    if (this.grid[row + 1][col]) {
      this.grid.splice(row + 1, 0, []);
    }

    if (this.grid[row + 1][col]) {
      throw new Error('Grid is occupied and we could not find a place - this should not happen');
    }

    this.grid[row + 1][col] = newElement;
  }

  find(element) {
    let row, col;
    row = this.grid.findIndex((row) => {
      col = row.findIndex((el) => {
        return el === element;
      });

      return col !== -1;
    });

    return [ row, col ];
  }
}

