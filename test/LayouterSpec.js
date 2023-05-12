import fs from 'fs';
import { layoutProcess } from '../lib';

describe('Layout', function() {

  const filenames = fs.readdirSync('test/diagrams');

  filenames.forEach(filename => {

    const iit = getIt(filename);

    iit('should layout ' + filename, async function() {
      const xml = fs.readFileSync('test/diagrams/' + filename, 'utf8');

      const result = await layoutProcess(xml);

      fs.writeFileSync('test/generated/' + filename, result, 'utf8');
    });
  });

});


function getIt(name) {
  if (name.startsWith('ONLY')) {
    return it.only;
  }

  if (name.startsWith('SKIP')) {
    return it.skip;
  }

  return it;
}