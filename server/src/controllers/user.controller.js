import { userModel } from '../models/user.model.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { mapChatRoomsUser } from '../utils/mapChatRoomsUser.js'
import saltedSha256 from 'salted-sha256'
const expAccessTime = `${3 * 3600}s` // 3h
const expRefreshTime = `${30 * 24 * 3600}s` // 30day

const SALT = process.env.SALT

dotenv.config()

export const patchUser = async (req, res) => {
    try {
        const data = req.body
        const { email, DOB, address, phone, fullName } = data

        const updatedUser = await userModel
            .findOneAndUpdate(
                { email },
                { email, DOB, address, phone, fullName },
                {
                    fields: { password: 0, _v: 0 },
                    new: true,
                }
            )
            .lean()

        return res.status(200).json({
            ...updatedUser,
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: err })
    }
}

export const changePassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body
        console.log(email)

        const hashedPassword = saltedSha256(newPassword, SALT)

        await userModel.findOneAndUpdate(
            {
                email: email,
            },
            {
                password: hashedPassword,
            }
        )

        res.status(200).json('sc')
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: err })
    }
}

export const getUser = async (req, res) => {
    try {
        const { email } = req.params

        const detailedUser = await getUserUtils(email)

        if (!detailedUser) {
            return res
                .status(404)
                .json({ message: 'Người dùng không tồn tại', error: true })
        }

        res.status(200).json(detailedUser)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: err })
    }
}

export const getUserUtils = async (email) => {
    const existUser = await userModel.findOne({ email: email }).lean()

    if (!existUser) {
        return null
    }

    const accessToken = jwt.sign(
        {
            email: existUser.email,
            _id: existUser._id,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: expAccessTime,
        }
    )

    return {
        fullName: existUser.fullName,
        DOB: existUser.DOB,
        phone: existUser.phone,
        address: existUser.address,
        chatRooms: existUser.chatRooms || [],
        accessToken,
        refreshToken: existUser.refreshToken,
        publicKey: existUser.publicKey,
    }
}
