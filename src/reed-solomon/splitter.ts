import { encode } from 'wasm-reed-solomon-erasure';

export const splitter = (input: Buffer, shardsCount: number, parityShards: number): Uint8Array[] => {
  if (parityShards < 1) throw new Error('Number of parity shards must be greater than 0.')
  if (parityShards >= shardsCount) throw new Error('Number of parity shards must be lower than data shards number.')
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