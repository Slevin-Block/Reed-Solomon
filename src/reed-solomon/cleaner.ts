import * as fs from 'fs';
import * as path from 'path';

export function cleaner(directory: string) {

  const files = fs.readdirSync(directory);
  /* readdir(directory, (err, files) => {
    if (err) throw err; */
  for (const file of files) {
    if (file.startsWith('shard') || file.startsWith('restore')) {
      const filePath = path.join(directory, file);

      fs.unlinkSync(filePath);
      console.log(`${file} a été supprimé.`);
    }
  }
  console.log(``);
}