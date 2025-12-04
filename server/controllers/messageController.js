const Group = require("../models/groupModel")
const GroupMessage = require("../models/messageModel")
const User = require("../models/userModel")

const sendMessage = async (req, res) => {
    try {
        const { groupId, content } = req.body
        const userId = req.user.id

        if (!groupId || !content) {
            return res.status(400).json({ success: false, message: 'Missing required fields' })
        }

        const group = await Group.findById(groupId)
        if (!group) {
            return res.status(404).json({ success: false, message: "Group not found" })
        }

        const isOwner = group.ownerId.toString() === userId
        const isMember = group.players.some(p => p.toString() === userId)

        if (!isOwner && !isMember) {
            return res.status(403).json({ success: false, message: "You are not allowed to send messages in this group" })
        }

        // await GroupMessage.create({
        //     groupId,
        //     senderId: userId,
        //     content
        // })

        return res.status(201).json({ success: true, message: 'Message sent successfully' })

    } catch (error) {
        console.error("Send Message Error:", error)
        return res.status(500).json({ success: false, message: 'Send message error: Server error' })
    }
}

const getMessages = async (req, res) => {
    try {
        const { groupId } = req.params
        const userId = req.user.id

        const group = await Group.findById(groupId)
        if (!group) {
            return res.status(404).json({ success: false, message: "Group not found" })
        }

        const isOwner = group.ownerId.toString() === userId
        const isMember = group.players.some(p => p.toString() === userId)

        if (!isOwner && !isMember) {
            return res.status(403).json({ success: false, message: "You are not allowed to view this chat" })
        }

        const messages = await GroupMessage.find({ groupId })
            .populate("senderId", "name")
            .sort({ createdAt: 1 })

        return res.status(200).json({ success: true, message: 'Messages retrieved successfully', data: messages })

    } catch (error) {
        console.error("Receive Message Error:", error)
        return res.status(500).json({ success: false, message: 'Receive message error: Server error' })
    }
}

module.exports = { sendMessage, getMessages }