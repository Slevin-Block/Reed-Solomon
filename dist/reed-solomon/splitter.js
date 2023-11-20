"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitter = void 0;
const wasm_reed_solomon_erasure_1 = require("wasm-reed-solomon-erasure");
const splitter = (input, shardsCount, parityShards) => {
    if (parityShards < 1)
        throw new Error('Number of parity shards must be greater than 0.');
    if (parityShards >= shardsCount)
        throw new Error('Number of parity shards must be lower than data shards number.');
    const dataShards = shardsCount - parityShards;
    console.log("Input : ", input.length);
    const shardSize = Math.ceil(input.length / dataShards);
    const shardData = [];
    for (let i = 0; i < dataShards; i++) {
        const array = new Uint8Array(shardSize);
        shardData.push(array);
    }
    for (let i = 0; i < input.length; i++) {
        const j = Math.floor(i / shardSize);
        const k = i % shardSize;
        shardData[j][k] = input[i];
    }
    return (0, wasm_reed_solomon_erasure_1.encode)(shardData, parityShards);
};
exports.splitter = splitter;
//# sourceMappingURL=splitter.js.map