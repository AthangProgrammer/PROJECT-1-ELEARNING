// Tiny helper to read/write JSON files (our "database" for this program)
const fs = require('fs');
const path = require('path');

const read = (name) => JSON.parse(fs.readFileSync(path.join(__dirname, name), 'utf8'));
const write = (name, data) =>
  fs.writeFileSync(path.join(__dirname, name), JSON.stringify(data, null, 2));

module.exports = { read, write };
