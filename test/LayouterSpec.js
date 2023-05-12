import fs from 'fs';
import { layoutProcess } from '../lib';

describe('Layouter', function() {

  it('should layout a process', async function() {
    const xml = fs.readFileSync('test/diagrams/simple.xml', 'utf8');

    const result = await layoutProcess(xml);

    fs.writeFileSync('test/diagrams/simple-generated.xml', result, 'utf8');
  });

});