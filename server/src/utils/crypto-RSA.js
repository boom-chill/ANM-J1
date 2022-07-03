import cryptico from 'cryptico'

export const decryptRSA = (privateKey, CipherText) => {
    const DecryptionRes = cryptico.decrypt(CipherText, privateKey)
    return DecryptionRes
}

export const encryptRSA = (publicKey, PlainText) => {
    const EncryptionRes = cryptico.encrypt(PlainText, publicKey)
    return EncryptionRes
}
