import { reconstruct } from 'wasm-reed-solomon-erasure';

export const rebuild = (shards: Uint8Array[], parityShards: number): Buffer => {

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