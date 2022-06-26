import { userModel } from './../models/user.model.js'

export const postSearch = async (req, res) => {
    const keyword = req.body.keyword
    try {
        if (keyword === '' || !keyword) {
            // check epmty keywword
            res.json([])
            return
        }

        const keywordSplit = keyword.split(' ')
        // ----- SEARCH BY REGEX -----
        if (keywordSplit.length < 2) {
            // search by letter regEx

            const searchProducts = await userModel
                .find(
                    {
                        fullName: {
                            $regex: new RegExp(`${keyword}.*`),
                            $options: 'i',
                        },
                        display: true,
                    },
                    {
                        password: 0,
                        refreshToken: 0,
                        refreshToken: 0,
                        __v: 0,
                    }
                )
                .limit(10)
                .lean()

            res.json(searchProducts)
            return
        } else {
            // search by word and part search last word

            // add | after wword ex: Nguyen | Ngoc | Nam | Phuong
            let regEx = ''
            for (let i = 0; i < keywordSplit.length - 1; i++) {
                if (keywordSplit[i] != '') {
                    if (keywordSplit.length - 2 != i) {
                        regEx += keywordSplit[i] + '|'
                    } else {
                        regEx += keywordSplit[i]
                    }
                }
            }

            if (keywordSplit[keywordSplit.length - 1].length > 2) {
                //after 3 word then start part search for last word
                regEx = `(?:${regEx})\\b|(?:${
                    keywordSplit[keywordSplit.length - 1]
                })`
                //ex: (?:Nguyen | Ngoc | Nam | Phuong)\b|(?:phu)
            } else {
                regEx = `(?:${regEx}\\b)`
                //ex: (?:Nguyen | Ngoc | Nam | Phuong)\b
            }

            const searchProducts = await userModel
                .find(
                    {
                        fullName: { $regex: new RegExp(regEx), $options: 'gi' },
                        display: true,
                    },
                    {
                        password: 0,
                        refreshToken: 0,
                        chatRooms: 0,
                        accessToken: 0,
                        refreshToken: 0,
                        __v: 0,
                    }
                )
                .limit(10)
                .lean()

            res.json(searchProducts)
            return
        }
    } catch (error) {
        res.status(400).send('Không tìm thấy người dùng')
    }
}
