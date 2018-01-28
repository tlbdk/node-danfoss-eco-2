// https://en.wikipedia.org/wiki/XXTEA

const DELTA = -1640531527

/**
 *
 * @param {number} sum
 * @param {number} y
 * @param {number} z
 * @param {number} p
 * @param {number} e
 * @param {number} k
 */
function MX(sum, y, z, p, e, k) {
  return (
    (((z >>> 5) ^ (y << 2)) + ((y >>> 3) ^ (z << 4))) ^
    ((sum ^ y) + (k[(p & 3) ^ e] ^ z))
  )
}

/**
 *
 * @param {Uint32Array} vi
 * @param {Uint32Array} k
 * @returns {Uint32Array}
 */
function encryptUint32Array(vi, k) {
  let v = vi.slice()
  let n = v.length - 1
  if (n >= 1) {
    let q = 52 / (n + 1) + 6
    let z = v[n]
    let sum = 0
    let q2 = q
    while (true) {
      q = q2 - 1
      if (q2 <= 0) {
        break
      }
      sum += DELTA
      let e = (sum >>> 2) & 3
      let p = 0
      while (p < n) {
        z = v[p] + MX(sum, v[p + 1], z, p, e, k)
        v[p] = z
        p++
      }
      z = v[n] + MX(sum, v[0], z, p, e, k)
      v[n] = z
      q2 = q
    }
  }
  return v
}

/**
 *
 * @param {Uint32Array} vi
 * @param {Uint32Array} k
 * @returns {Uint32Array}
 */
function decryptUint32Array(vi, k) {
  let v = vi.slice()
  let n = v.length - 1
  if (n >= 1) {
    let q = 52 / (n + 1) + 6
    let y = v[0]
    for (let sum = q * DELTA; sum != 0; sum -= DELTA) {
      let e = (sum >>> 2) & 3
      let p = n
      while (p > 0) {
        y = v[p] - MX(sum, y, v[p - 1], p, e, k)
        v[p] = y
        p--
      }
      y = v[0] - MX(sum, y, v[n], p, e, k)
      v[0] = y
    }
  }
  return v
}

/**
 *
 * @param {ArrayBuffer|SharedArrayBuffer} data
 * @param {ArrayBuffer|SharedArrayBuffer} key
 * @returns {ArrayBuffer|SharedArrayBuffer}
 */
function encrypt(data, key) {
  let dataInts = bufferToInts(data, false)
  let keyInts = bufferToInts(key, true)
  let encryptInts = encryptUint32Array(dataInts, keyInts)
  return intsToBuffer(encryptInts, false)
}

/**
 *
 * @param {ArrayBuffer|SharedArrayBuffer} key
 */
function encryptSelf(key) {
  let keyInts = bufferToInts(key, true)
  let encryptInts = encryptUint32Array(keyInts, keyInts)
  return intsToBuffer(encryptInts, false)
}

/**
 *
 * @param {ArrayBuffer|SharedArrayBuffer} data
 * @param {ArrayBuffer|SharedArrayBuffer} key
 */
function decrypt(data, key) {
  let dataInts = bufferToInts(data, false)
  let keyInts = bufferToInts(key, true)
  let decryptInts = decryptUint32Array(dataInts, keyInts)
  return intsToBuffer(decryptInts, false)
}

/**
 *
 * @param {Uint32Array} ints
 * @returns {ArrayBuffer}
 */
function intsToBuffer(ints, littleEndian = true) {
  let bytes = new ArrayBuffer(ints.length * 4)
  let buf = new DataView(bytes)
  for (let i = 0; i < ints.length; i++) {
    buf.setUint32(i * 4, ints[i], littleEndian)
  }
  return bytes
}

/**
 *
 * @param {ArrayBuffer|SharedArrayBuffer} bytes
 * @param {boolean} littleEndian
 */
function bufferToInts(bytes, littleEndian = true) {
  if (bytes.byteLength % 4 != 0) {
    throw new Error('Length of byte-array must be divisible by 4!')
  }
  let count = bytes.byteLength / 4
  let ints = new Uint32Array(count)

  let buf = new DataView(bytes)
  for (let i = 0; i < count; i++) {
    ints[i] = buf.getUint32(i * count, littleEndian)
  }

  return ints
}

module.exports = {
  encrypt,
  decrypt,
  encryptSelf
}
