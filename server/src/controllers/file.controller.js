import { decryptAES } from '../utils/crypto-AES.js'
import { decryptRSA } from '../utils/crypto-RSA.js'
import { userModel } from './../models/user.model.js'
import Cryptify from 'cryptify'
import fs, { writeFileSync } from 'fs'
import { genKey } from './../utils/genKey.js'
import cryptico from 'cryptico'
import { RSAParse } from './../utils/parseRSA.js'

export const downloadFile = async (req, res) => {
    try {
        const { name, path, email } = req.query

        if (!path)
            return res.status(500).json({ message: 'Không tìm thấy file' })

        const user = await userModel
            .findOne({
                email: email,
            })
            .lean()

        const pathFile = path.split('.')[0]
        // /const extensionFile = path.split('.')[1]
        const receiveData = fs.readFileSync(`./${pathFile}.bin`, 'utf8')

        const encryptedSessionKey = receiveData.split(
            'KhueTrungNam'.toString('utf8')
        )[0]
        const encryptedData = receiveData.split(
            'KhueTrungNam'.toString('utf8')
        )[1]

        const privateKey = decryptAES(user.password, user.encryptedPrivateKey)
        const parsedPrivateKey = RSAParse(privateKey)

        const sessionKey = decryptRSA(parsedPrivateKey, encryptedSessionKey)
        console.log(`***${sessionKey.plaintext}***`)

        const instance = new Cryptify(`./${path}`, sessionKey.plaintext)
        await instance
            .decrypt()
            .then((files) => {
                res.download(`${path}`, `${name}`)
            })
            .then(() => instance.encrypt())
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Không tìm thấy file' })
    }
}
