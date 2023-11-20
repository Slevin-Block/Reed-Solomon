const ReedSolomon = require('@ronomon/reed-solomon');
function init() {
  // Specify the number of data shards (<= ReedSolomon.MAX_K):
  const shards = 6;
  // Specify the number of parity shards (<= ReedSolomon.MAX_M):
  const parity_shards = 3; // Protect against the loss of any 3 data or parity shards.

  // Create an encoding context (can be cached and re-used concurrently):
  return ReedSolomon.create(shards, parity_shards);
}

module.exports = init;