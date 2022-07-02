import dotenv from 'dotenv'
import cryptico from 'cryptico'

dotenv.config()

export const getPublicKey = async (req, res) => {
    try {
        const PASSPHRASE = process.env.PASSPHRASE
        const BITS = process.env.BITS
    } catch (error) {
        console.log(`Error in decode access token: ${error}`)
        return null
    }
}
