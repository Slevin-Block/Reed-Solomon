export declare const bufferToShards: (input: Buffer, shardsCount: number, parityShards: number) => Uint8Array[];
export declare const shardsToBuffer: (shards: Uint8Array[], parityShards: number, deadSharedIndexes: number[]) => Buffer;
