import { encode, reconstruct } from 'wasm-reed-solomon-erasure';
import * as fs from 'fs';

export const bufferToShards = (input: Buffer, shardsCount: number, parityShards: number): Uint8Array[] => {
  if (parityShards < 1) throw new Error('Number of parity shards must be greater than 0.')
  if (parityShards > shardsCount) throw new Error('Number of parity shards must be lower than data shards number.')
  const dataShards = shardsCount - parityShards;
  console.log("Input : ", input.length);
  const shardSize = Math.ceil(input.length / dataShards);
  const shardData: Uint8Array[] = [];

  for (let i = 0; i < dataShards; i++) {
    const array = new Uint8Array(shardSize);
    shardData.push(array);
  }

  for (let i = 0; i < input.length; i++) {
    const j = Math.floor(i / shardSize);
    const k = i % shardSize;
    shardData[j][k] = input[i];
  }


  return encode(shardData, parityShards);
};

export const shardsToBuffer = (shards: Uint8Array[], parityShards: number, deadSharedIndexes: number[]): Buffer => {

  const results = reconstruct(
    shards,
    parityShards,
    new Uint32Array(),
  );

  const flatten: number[] = [];
  const dataShards = shards.length - parityShards;
  for (let i = 0; i < dataShards; i++) {
    for (const result of results[i]) {
      flatten.push(result)
    };
  }
  return Buffer.from(flatten);
};