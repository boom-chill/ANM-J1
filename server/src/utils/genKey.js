import dotenv from 'dotenv'
import cryptico from 'cryptico'

dotenv.config()

export const genKey = (passphrase, BITS = 2048) => {
    let PASSPHRASE = process.env.PASSPHRASE

    if (passphrase) {
        PASSPHRASE = passphrase
    }

    const MattsRSAkey = cryptico.generateRSAKey(PASSPHRASE, BITS)
    const MattsPublicKeyString = cryptico.publicKeyString(MattsRSAkey)

    //console.log(MattsRSAkey)

    return {
        privateKey: MattsRSAkey,
        publicKey: MattsPublicKeyString,
    }
}
