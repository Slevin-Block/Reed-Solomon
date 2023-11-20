const ReedSolomon = require('@ronomon/reed-solomon');
const fs = require('fs');

console.log('Let\'s get started!')

// Specify the number of data shards (<= ReedSolomon.MAX_K):
const shards = 6;

// Specify the number of parity shards (<= ReedSolomon.MAX_M):
const parity_shards = 3; // Protect against the loss of any 3 data or parity shards.

// Create an encoding context:
const context = ReedSolomon.create(shards, parity_shards);

// Specify the size of each shard in bytes (must be a multiple of 8 bytes):
const shardSize = 65536;

// Assume you have randomly selected 3 shards (data or parity) for reconstruction:
const selectedShards = [0, 2, 5]; // Replace with your actual indices

// Read the selected shards from files and store them in an array:
const shardBuffers = [];
for (const shardIndex of selectedShards) {
  const shardFilePath = `shard_${shardIndex}.dat`;
  const shardContent = fs.readFileSync(shardFilePath);
  shardBuffers.push(Buffer.from(shardContent));
}

// Create a buffer for the reconstructed data:
const reconstructedBuffer = Buffer.alloc(shardSize * shards);

// Specify the offset into the reconstructed buffer at which reconstructed data shards begin:
const reconstructedBufferOffset = 0;

// Specify the size after this offset of all reconstructed data shards:
const reconstructedBufferSize = shardSize * shards;

// Specify the sources, present in buffer or parity (as bit flags):
let sources = 0;
for (const shardIndex of selectedShards) {
  sources |= (1 << shardIndex);
}

// Specify the targets, missing in buffer or parity, which should be encoded:
let targets = 0;
for (let i = 0; i < shards; i++) {
  if (!selectedShards.includes(i)) {
    targets |= (1 << i);
  }
}

// Encode the missing shards:
ReedSolomon.encode(
  context,
  sources,
  targets,
  shardBuffers,
  reconstructedBuffer,
  reconstructedBufferOffset,
  reconstructedBufferSize,
  function (error) {
    if (error) throw error;

    // The reconstructedBuffer now contains the reconstructed data.
    console.log('File successfully reconstructed.');

    // Write the reconstructed data to a file:
    fs.writeFileSync('reconstructed_file.mp4', reconstructedBuffer);
    console.log('Reconstructed file saved to "reconstructed_file.mp4"');
  }
);