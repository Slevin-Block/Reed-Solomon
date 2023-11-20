"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rebuild = void 0;
const wasm_reed_solomon_erasure_1 = require("wasm-reed-solomon-erasure");
const rebuild = (shards, parityShards) => {
    const results = (0, wasm_reed_solomon_erasure_1.reconstruct)(shards, parityShards, new Uint32Array());
    const flatten = [];
    const dataShards = shards.length - parityShards;
    for (let i = 0; i < dataShards; i++) {
        for (const result of results[i]) {
            flatten.push(result);
        }
        ;
    }
    return Buffer.from(flatten);
};
exports.rebuild = rebuild;
//# sourceMappingURL=reconstruct.js.map