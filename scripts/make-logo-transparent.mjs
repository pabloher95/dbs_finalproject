import { readFileSync, writeFileSync } from "node:fs";
import { inflateSync, deflateSync } from "node:zlib";

const src = "public/logo.png";

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i += 1) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j += 1) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const out = Buffer.alloc(12 + data.length);
  out.writeUInt32BE(data.length, 0);
  out.write(type, 4, 4, "ascii");
  data.copy(out, 8);
  out.writeUInt32BE(crc32(Buffer.concat([Buffer.from(type, "ascii"), data])), 8 + data.length);
  return out;
}

function paeth(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  if (pb <= pc) return b;
  return c;
}

const input = readFileSync(src);
if (!input.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) {
  throw new Error("Not a PNG");
}

let offset = 8;
let width = 0;
let height = 0;
let bitDepth = 0;
let colorType = 0;
let compression = 0;
let filter = 0;
let interlace = 0;
const idat = [];

while (offset < input.length) {
  const length = input.readUInt32BE(offset);
  const type = input.toString("ascii", offset + 4, offset + 8);
  const data = input.subarray(offset + 8, offset + 8 + length);
  if (type === "IHDR") {
    width = data.readUInt32BE(0);
    height = data.readUInt32BE(4);
    bitDepth = data.readUInt8(8);
    colorType = data.readUInt8(9);
    compression = data.readUInt8(10);
    filter = data.readUInt8(11);
    interlace = data.readUInt8(12);
  } else if (type === "IDAT") {
    idat.push(data);
  }
  offset += 12 + length;
}

if (bitDepth !== 8 || colorType !== 2 || compression !== 0 || filter !== 0 || interlace !== 0) {
  throw new Error(`Unsupported PNG format: bitDepth=${bitDepth} colorType=${colorType} compression=${compression} filter=${filter} interlace=${interlace}`);
}

const raw = inflateSync(Buffer.concat(idat));
const rowLength = width * 3;
const out = Buffer.alloc(height * (1 + width * 4));
let inOffset = 0;
let outOffset = 0;
let prev = Buffer.alloc(rowLength);

for (let y = 0; y < height; y += 1) {
  const filterType = raw[inOffset];
  inOffset += 1;
  const row = Buffer.alloc(rowLength);

  for (let x = 0; x < rowLength; x += 1) {
    const current = raw[inOffset + x];
    const left = x >= 3 ? row[x - 3] : 0;
    const up = prev[x];
    const upLeft = x >= 3 ? prev[x - 3] : 0;
    let value;

    switch (filterType) {
      case 0:
        value = current;
        break;
      case 1:
        value = (current + left) & 0xff;
        break;
      case 2:
        value = (current + up) & 0xff;
        break;
      case 3:
        value = (current + Math.floor((left + up) / 2)) & 0xff;
        break;
      case 4:
        value = (current + paeth(left, up, upLeft)) & 0xff;
        break;
      default:
        throw new Error(`Unsupported filter type: ${filterType}`);
    }

    row[x] = value;
  }

  inOffset += rowLength;
  out[outOffset] = 0;
  outOffset += 1;

  for (let x = 0; x < width; x += 1) {
    const r = row[x * 3];
    const g = row[x * 3 + 1];
    const b = row[x * 3 + 2];
    const brightness = Math.max(r, g, b);
    const alpha = 255 - brightness;
    out[outOffset] = 0;
    out[outOffset + 1] = 0;
    out[outOffset + 2] = 0;
    out[outOffset + 3] = alpha;
    outOffset += 4;
  }

  prev = row;
}

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(width, 0);
ihdr.writeUInt32BE(height, 4);
ihdr.writeUInt8(8, 8);
ihdr.writeUInt8(6, 9);
ihdr.writeUInt8(0, 10);
ihdr.writeUInt8(0, 11);
ihdr.writeUInt8(0, 12);

const pngParts = [
  Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
  chunk("IHDR", ihdr),
  chunk("IDAT", deflateSync(out, { level: 9 })),
  chunk("IEND", Buffer.alloc(0))
];

writeFileSync(src, Buffer.concat(pngParts));
