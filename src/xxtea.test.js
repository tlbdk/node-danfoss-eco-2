const crypto = require('./xxtea')

describe('Crypto test', () => {
  let expected = new Uint8Array([
    64,
    12,
    54,
    12,
    0,
    30,
    56,
    110,
    -107,
    0,
    56,
    110,
    -107,
    0,
    0,
    0
  ])
  let encrypted = new Uint8Array([
    43,
    -105,
    -34,
    -94,
    -62,
    58,
    -18,
    -30,
    -56,
    -98,
    65,
    114,
    65,
    72,
    88,
    -67
  ])
  let secret = new Uint8Array([
    -51,
    103,
    -3,
    122,
    58,
    8,
    22,
    76,
    119,
    116,
    58,
    -87,
    108,
    20,
    -48,
    61
  ])

  test('decrypt', () => {
    let decrypted = crypto.decrypt(encrypted.buffer, secret.buffer)
    let decryptedArray = new Uint8Array(decrypted)
    expect(decryptedArray).toEqual(expected)
  })
  test('encrypt', () => {
    let encryptedArray = crypto.encrypt(expected.buffer, secret.buffer)
    expect(encrypted.buffer).toEqual(encryptedArray)
  })
})
