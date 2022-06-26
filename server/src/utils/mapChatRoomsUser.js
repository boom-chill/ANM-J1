import { getMessages } from '../controllers/messageManage.controller.js'
import ChatRoomModel from '../models/chatRoom.model.js'
import { userModel } from './../models/user.model.js'

const MESSAGE_ON_BUCKET = process.env.MESSAGE_ON_BUCKET

export const mapChatRoomsUser = async (chatRooms) => {
    if (chatRooms?.length <= 0 || !chatRooms) return []
    const detailedRooms = {}
    for (let chatRoom of chatRooms) {
        const detailedRoom = await ChatRoomModel.findOne({
            _id: chatRoom.chatRoomId,
        })

        const totalMessage = detailedRoom.totalMessage

        let seq = 0

        seq = Number(Math.floor(totalMessage / MESSAGE_ON_BUCKET))
        if (totalMessage % MESSAGE_ON_BUCKET == 0 && totalMessage > 0) {
            seq = seq - 1
        }

        Object.assign(detailedRooms, {
            [detailedRoom._id]: {
                users: detailedRoom.users,
                name: detailedRoom.name,
                type: detailedRoom.type,
                to: chatRoom?.to
                    ? await userModel
                          .findOne(
                              { _id: chatRoom.to },
                              {
                                  password: 0,
                                  refreshToken: 0,
                                  DOB: 0,
                                  phone: 0,
                                  address: 0,
                                  chatRooms: 0,
                              }
                          )
                          .lean()
                    : null,
                messages: [],
                seq: seq,
            },
        })
    }
    return detailedRooms
}
