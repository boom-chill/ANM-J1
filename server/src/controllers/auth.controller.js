import { userModel } from '../models/user.model.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'

const expAccessTime = `${3 * 3600}s` // 3h
const expRefreshTime = `${30 * 24 * 3600}s` // 30day

dotenv.config()

const decodeToken = async (token, secretKey) => {
    try {
        return await jwt.verify(token, secretKey, {
            ignoreExpiration: true,
        })
    } catch (error) {
        console.log(`Error in decode access token: ${error}`)
        return null
    }
}

export const postRefreshToken = (req, res) => {
    let accessTokenFromHeader = req.headers.authorization

    if (!accessTokenFromHeader) {
        return res.status(400).send('Không tìm thấy accessToken')
    }
    accessTokenFromHeader = accessTokenFromHeader.split(' ')[1]

    const refreshToken = req.body.refreshToken
    if (!refreshToken) {
        return res.status(400).send('Không tìm thấy refreshToken.')
    }

    decodeToken(accessTokenFromHeader, process.env.ACCESS_TOKEN_SECRET).then(
        async (decodedRes) => {
            const user = await userModel.findOne({
                email: decodedRes.email,
            })

            if (refreshToken != user.refreshToken) {
                return res.status(400).send('RefreshToken không hợp lệ')
            }

            const accessToken = jwt.sign(
                {
                    email: user.email,
                    office: user.office,
                },
                process.env.ACCESS_TOKEN_SECRET,
                {
                    expiresIn: expAccessTime,
                }
            )

            if (!accessToken) {
                return res
                    .status(400)
                    .send('Tạo accessToken không thành công, vui lòng thử lại')
            }

            res.status(200).json({
                accessToken,
                refreshToken,
            })
        }
    )
}

export const postLogin = async (req, res) => {
    try {
        const { email, password } = req.body

        const existUser = await userModel.findOne({ email: email }).lean()

        if (!existUser) {
            return res
                .status(404)
                .json({ message: 'Tên đăng nhập không tồn tại', error: true })
        }

        //check password
        const isPasswordCorrect = await bcrypt.compare(
            password,
            existUser.password
        )

        if (isPasswordCorrect) {
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

            res.status(200).json({
                fullName: existUser.fullName,
                DOB: existUser.DOB,
                phone: existUser.phone,
                address: existUser.address,
                chatRooms: existUser.chatRooms || [],
                accessToken,
                refreshToken: existUser.refreshToken,
            })
        } else {
            res.status(401).json({ message: 'Mật khẩu không đúng' })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error })
    }
}

export const postRegister = async (req, res) => {
    console.log('hehe')
    try {
        const { email, password } = req.body
        const data = req.body

        console.log('postRegister', data)

        const existUser = await userModel.findOne({ email: email })

        if (existUser) {
            return res.status(500).json({ message: 'Tên đăng nhập đã tồn tại' })
        }

        //create password
        const hashedPassword = bcrypt.hashSync(
            password,
            Number(process.env.SALT_ROUNDS)
        )

        const refreshToken = jwt.sign(
            {
                email: email,
            },
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn: expRefreshTime,
            }
        )

        await userModel.updateOne(
            {
                email: email,
            },
            {
                refreshToken: refreshToken,
            }
        )

        const user = userModel({
            ...data,
            chatRooms: [],
            password: hashedPassword,
            refreshToken: refreshToken,
            DOB: new Date(data.DOB),
        })

        await user.save()

        return res.status(200).json({ message: 'Đăng kí thành công' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error })
    }
}
