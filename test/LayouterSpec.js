import fs from 'fs';
import { layoutProcess } from '../lib';

describe('Layouter', function() {

  it('should layout a process', async function() {
    const xml = fs.readFileSync('test/diagrams/simple.xml', 'utf8');

    await layoutProcess(xml);
  });

});