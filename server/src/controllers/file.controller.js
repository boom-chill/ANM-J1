import { decryptAES } from '../utils/crypto-AES.js'
import { decryptRSA } from '../utils/crypto-RSA.js'
import { userModel } from './../models/user.model.js'
import Cryptify from 'cryptify'
import fs, { writeFileSync } from 'fs'

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

        const receiveData = fs.readFileSync(`./${path}`)
        const buffer = Buffer.from(receiveData, 'base64')

        console.log("receiveData", buffer.toString())

        const encryptedSessionKey = receiveData.split("KhueTrungNam")[0]
        const encryptedData = receiveData.split("KhueTrungNam")[1]

        console.log("encrpytedSessionKey", encryptedSessionKey.toString())
        console.log("encryptedData", encryptedData)

        const privateKey = JSON.parse(decryptAES(user.password, user.encryptedPrivateKey))
        console.log(privateKey)

        const sessionKey = decryptRSA(privateKey, encryptedSessionKey)

        fs.writeFileSync(
            `public/tem/${email}`,
            binaryData,
            'binary',
            (err) => {
                console.log(err)
            }
            )

        const instance = new Cryptify(`public/tem/${email}`, sessionKey)
        instance
            .decrypt
            .then(files => {

                // res.download(`./${path}`, `${name}`)
                console.log(files)
            })
        // return res.download(`./${path}`, `${name}`)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Không tìm thấy file' })
    }
}