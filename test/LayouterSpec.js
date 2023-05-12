import fs from 'fs';
import { layoutProcess } from '../lib';

describe('Layout', function() {

  const filenames = fs.readdirSync('test/diagrams');

  filenames.forEach(filename => {

    it('should layout' + filename, async function() {
      const xml = fs.readFileSync('test/diagrams/' + filename, 'utf8');

      const result = await layoutProcess(xml);

      fs.writeFileSync('test/generated/' + filename, result, 'utf8');
    });
  });

});