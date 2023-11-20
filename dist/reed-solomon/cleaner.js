"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleaner = void 0;
const fs = require("fs");
const path = require("path");
function cleaner(directory) {
    const files = fs.readdirSync(directory);
    /* readdir(directory, (err, files) => {
      if (err) throw err; */
    for (const file of files) {
        if (file.startsWith('shard') || file.startsWith('restore')) {
            const filePath = path.join(directory, file);
            fs.unlinkSync(filePath);
            console.log(`${file} a été supprimé.`);
        }
    }
    console.log(``);
}
exports.cleaner = cleaner;
//# sourceMappingURL=cleaner.js.map