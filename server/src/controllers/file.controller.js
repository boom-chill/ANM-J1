import { userModel } from './../models/user.model.js'

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

        console.log('user', user.encryptedPrivateKey)
        return res.download(`./${path}`, `${name}`)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Không tìm thấy file' })
    }
}
