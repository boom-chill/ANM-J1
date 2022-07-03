import aesjs from 'aes-js'

const iv = [21, 22, 11, 24, 10, 26, 87, 28, 24, 42, 16, 32, 33, 36, 35, 36]

export const encryptAES = (key, text) => {
    const aesEcb = new aesjs.ModeOfOperation.ecb(key, iv)

    // Convert text to bytes
    const textBytes = aesjs.utils.utf8.toBytes(text)
    const encryptedBytes = aesEcb.encrypt(textBytes)
    const encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes)

    return encryptedHex // hex
}

export const decryptAES = (key, encryptedHex) => {
    const aesCbc = new aesjs.ModeOfOperation.cbc(key, iv)

    // Convert hex to bytes
    const encryptedBytes = aesjs.utils.hex.toBytes(encryptedHex)
    const decryptedBytes = aesCbc.decrypt(encryptedBytes)
    const decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes)

    return decryptedText // string
}
