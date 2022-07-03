import aesjs from 'aes-js'

//const iv = [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36]
const iv = '6162636465666768696a6b6c6d6e6f70'
// const ivd = 'ec8902010adc3d63'

export const encryptAES = (key, text) => {
    // Convert to bytes
    const ivBytes = aesjs.utils.hex.toBytes(iv)
    const keyBytes = aesjs.utils.hex.toBytes(key)

    const aesCbc = new aesjs.ModeOfOperation.cbc(keyBytes, ivBytes)

    //console.log(text.padStart(text.length + (16 - (text.length % 16)), ' '))

    const textBytes = aesjs.utils.utf8.toBytes(
        text.padStart(text.length + (16 - (text.length % 16)), ' ')
    )
    const encryptedBytes = aesCbc.encrypt(textBytes)
    const encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes)

    // console.log('encryptedHex', typeof encryptedHex)
    return encryptedHex // hex
}

export const decryptAES = (key, encryptedHex) => {
    const ivBytes = aesjs.utils.hex.toBytes(iv)
    const keyBytes = aesjs.utils.hex.toBytes(key)
    const aesCbc = new aesjs.ModeOfOperation.cbc(keyBytes, ivBytes)

    // Convert hex to bytes
    const encryptedBytes = aesjs.utils.hex.toBytes(encryptedHex)
    const decryptedBytes = aesCbc.decrypt(encryptedBytes)
    const decryptedText = aesjs.utils.utf8
        .fromBytes(decryptedBytes)
        .replace(/\s+/g, '')

    //console.log('decryptedText', decryptedText)
    return decryptedText // string
}
