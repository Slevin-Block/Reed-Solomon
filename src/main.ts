import { bufferToShards, shardsToBuffer } from './reed-solomon/splitter';
import * as fs from 'fs';
import * as path from 'path';

const data_shard_number = 10;
const parity_shard_number = 5;
const file_name = './Crypto101.pdf'

cleaner('./');

const ext = file_name.substring(file_name.lastIndexOf('.') + 1);
split_process(file_name);

recovery_process(ext);
const fileContent = fs.readFileSync(`./restore.${ext}`);
const explore_number = 10;
compare_files([file_name, `./restore.${ext}`], explore_number, fileContent.length - explore_number);


function split_process(file_name: string) {
  // SPLIT
  const fileContent = fs.readFileSync(file_name);
  const input = Buffer.from(fileContent);
  const shards = bufferToShards(input, data_shard_number, parity_shard_number);
  for (let i = 0; i < data_shard_number; i++) {
    const shardFilePath = `shard_${i}.dat`;
    fs.writeFileSync(shardFilePath, shards[i]);
  }
  console.log("Shards : ", shards.length);
  let shards_length = 0
  for (let index = 0; index < shards.length; index++) {
    console.log(`Shard ${index} : ${shards[index].length}`);
    shards_length += shards[index].length;
  }
  console.log("Total : ", shards_length);
  console.log('% : ', Math.ceil(shards_length / input.length * 100))
}


function recovery_process(ext: string) {
  // RECOVERY
  let recovery_array: Uint8Array[] = [];
  for (let i = 0; i < data_shard_number; i++) {
    const fileContent = fs.readFileSync(`./shard_${i}.dat`);
    recovery_array.push(Uint8Array.from(fileContent));
  }

  const restoredBuffer = shardsToBuffer(recovery_array, parity_shard_number, []);
  fs.writeFileSync(`restore.${ext}`, restoredBuffer);
  console.log('Restore length : ', restoredBuffer.length);
}

function compare_files(files_url: string[], len: number, start: number = 0) {
  const files: Buffer[] = []
  for (let i = 0; i < files_url.length; i++) {
    const fileContent = fs.readFileSync(files_url[i]);
    files.push(fileContent);
  }
  for (let k = start; k < start + len; k++) {
    const values = files.map(subArray => (k < subArray.length ? subArray[k] : 'u'));
    console.log(`${k} | ${values.join(' | ')}`);
  }
}

function cleaner(directory: string) {

  fs.readdir(directory, (err, files) => {
    if (err) throw err;

    files.forEach(file => {
      if (file.startsWith('shard') || file.startsWith('restore')) {
        const filePath = path.join(directory, file);

        fs.unlink(filePath, err => {
          if (err) throw err;

          console.log(`${file} a été supprimé.`);
        });
      }
    });
  });
}