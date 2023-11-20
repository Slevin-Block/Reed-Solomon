import { splitter } from './reed-solomon/splitter';
import * as fs from 'fs';
import * as crypto from 'crypto';
import { rebuild } from './reed-solomon/reconstruct';
import { cleaner } from './reed-solomon/cleaner';



const data_shard_number = 30;
const shard_minimum = 10;
const parity_shard_number = data_shard_number - shard_minimum;
const path = './files'
const file_name = 'videoplayback.mp4'


cleaner(path);

const ext = file_name.substring(file_name.lastIndexOf('.') + 1);
split_process(`${path}/${file_name}`);


const file = fs.readFileSync(`${path}/${file_name}`);
const eight_correction = file.length % 8;
recovery_process(ext, shard_minimum);

const fileContent = fs.readFileSync(`${path}/restore.${ext}`);
const explore_number = 10;
compare_files([`${path}/${file_name}`, `${path}/restore.${ext}`], explore_number, fileContent.length - explore_number);

function split_process(file_name: string) {
  // SPLIT
  const fileContent = fs.readFileSync(file_name);
  const input = Buffer.from(fileContent);
  const shards = splitter(input, data_shard_number, parity_shard_number);
  for (let i = 0; i < data_shard_number; i++) {
    fs.writeFileSync(`${path}/shard_${i}.dat`, shards[i]);
  }
  console.log("Shards : ", shards.length);
  console.log("Parity : ", parity_shard_number);
  let shards_length = 0
  for (let index = 0; index < shards.length; index++) {
    console.log(`Shard ${index} : ${shards[index].length}`);
    shards_length += shards[index].length;
  }
  console.log("Total : ", shards_length);
  console.log('% : ', Math.ceil(shards_length / input.length * 100))
}

function recovery_process(ext: string, keeped_shard_number: number = data_shard_number) {
  // RECOVERY
  let recovery_array: Uint8Array[] = [];
  let shard_length: number = 0;

  for (let i = 0; i < data_shard_number; i++) {
    if (i < keeped_shard_number) {
      const fileContent = fs.readFileSync(`${path}/shard_${i}.dat`);
      shard_length = fileContent.length;
      recovery_array.push(Uint8Array.from(fileContent));
    } else {
      console.log(`erase shard ${i}`);
      recovery_array.push(Uint8Array.from(Buffer.allocUnsafe(shard_length)));

    }
  }

  const restoredBuffer = rebuild(recovery_array, parity_shard_number);
  const correction = (restoredBuffer.length % 8 + 8 - eight_correction);
  const new_buffer = restoredBuffer.slice(0, restoredBuffer.length - correction)
  fs.writeFileSync(`${path}/restore.${ext}`, new_buffer);
  console.log('Restore length : ', new_buffer.length);
}

function compare_files(file_list: string[], len: number, start: number = 0) {
  const files: Buffer[] = []

  for (let i = 0; i < file_list.length; i++) {
    const fileContent = fs.readFileSync(`${file_list[i]}`);
    files.push(fileContent);
    const hash = crypto.createHash('sha256');
    hash.update(fileContent);
    console.log(`File hash for ${file_list[i]} : \n${hash.digest('hex')}`)
  }

  console.log(`\n`);
  for (let k = start; k < start + len; k++) {
    const values = files.map(subArray => (k < subArray.length ? subArray[k] : 'u'));
    console.log(`${k} | ${values.join(' | ')}`);
  }
}