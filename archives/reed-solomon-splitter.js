const ReedSolomon = require('@ronomon/reed-solomon');
const fs = require('fs');

function splitter(context, file_url, shards, parity_shards) {
  const shardSize = 65536;

  const fileContent = fs.readFileSync(file_url);

  const buffer = Buffer.from(fileContent);
  const bufferSize = shardSize * shards;

  const parity = Buffer.alloc(shardSize * parity_shards);
  const paritySize = shardSize * parity_shards;

  let sources = 0;
  for (let i = 0; i < shards; i++) sources |= (1 << i);

  let targets = 0;
  for (let i = shards; i < shards + parity_shards; i++) targets |= (1 << i);

  ReedSolomon.encode(
    context,
    sources,
    targets,

    buffer,
    0,
    bufferSize,

    parity,
    0,
    paritySize,
    function (error) {
      if (error) throw error;
      // Parity shards now contain parity data.
      console.log('buffer :', buffer.length)
      console.log('targets :', targets)
      console.log('Parity :', parity.length)
      // Sauvegarde des shards dans des fichiers séparés
      for (let i = shards; i < shards + parity_shards; i++) {
        const shard = parity.slice((i - shards) * shardSize, (i - shards + 1) * shardSize);
        //const shard = i < shards ? buffer.slice(i * shardSize, (i + 1) * shardSize) : parity.slice((i - shards) * shardSize, (i - shards + 1) * shardSize);
        const shardFilePath = `shard_${i}.dat`;
        //fs.writeFileSync(shardFilePath, shard);
        console.log(`Shard ${i} saved to ${shardFilePath} | length : ${shard.length}`);
      }
    }
  );
}

module.exports = splitter;