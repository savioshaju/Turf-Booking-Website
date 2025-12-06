const Group = require('../models/groupModel')
const GroupRequest = require('../models/groupRequestModel')
const Booking = require('../models/bookingModel')
const User = require('../models/userModel')
const cleanupTracker = require('../utils/cleanupTracker')
const Message = require('../models/messageModel')
const { maskUser } = require('../utils/mask')

function maskGroup(group) {
    if (!group) return group;

    if (group.ownerId) {
        group.ownerId = maskUser(group.ownerId);
    }

    if (group.players && Array.isArray(group.players)) {
        group.players = group.players.map(maskUser);
    }

    return group;
}

function maskGroupList(groups) {
    return groups.map(maskGroup);
}


const createGroup = async (req, res) => {
    try {
        const { bookingId, message, requiredPlayers } = req.body || {}
        const ownerId = req.user?.id

        if (!bookingId || !message || !requiredPlayers) {
            return res.status(400).json({ success: false, message: "Missing required fields" })
        }

        const booking = await Booking.findById(bookingId)
        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found" })
        }


        if (booking.userId.toString() !== ownerId) {
            return res.status(403).json({ success: false, message: "You cannot create group" })
        }

        const existingGroup = await Group.findOne({ bookingId })
        if (existingGroup) {
            return res.status(400).json({ success: false, message: "Group already exists for this booking" })
        }

        const newGroup = new Group({
            bookingId,
            ownerId,
            message,
            requiredPlayers,
            players: [],
            status: "open"
        })

        const savedGroup = await newGroup.save()

        res.status(201).json({ success: true, message: "Group created successfully", data: savedGroup })
    } catch (error) {
        console.error('Create Group Error:', error)
        res.status(500).json({ success: false, message: 'Create Group: Server error' })
    }
}

const getGroupByBooking = async (req, res) => {
    try {
        const { bookingId } = req.params

        if (!bookingId) {
            return res.status(400).json({ success: false, message: "Booking ID is required" })
        }

        const group = await Group.findOne({ bookingId })

        if (!group) {
            return res.status(404).json({ success: false, message: "No group found for this booking" })
        }

        res.status(200).json({ success: true, message: "Group fetched successfully", data: group })
    } catch (error) {
        console.error('Get Group By Booking Error:', error)
        res.status(500).json({ success: false, message: 'Get Group By Booking: Server error' })
    }
}

const sendJoinRequest = async (req, res) => {
    try {
        const { groupId } = req.body || {}
        const userId = req.user?.id

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token data.' })
        }


        if (!groupId) {
            return res.status(400).json({ success: false, message: "Group ID is required" })
        }

        const group = await Group.findById(groupId)
        if (!group) {
            return res.status(404).json({ success: false, message: "Group not found" })
        }

        if (group.ownerId.toString() === userId) {
            return res.status(400).json({ success: false, message: "Owner cannot request to join own group" })
        }

        const alreadyPlayer = group.players.includes(userId)
        if (alreadyPlayer) {
            return res.status(400).json({ success: false, message: "You are already in this group" })
        }

        const existingRequest = await GroupRequest.findOne({ groupId, requesterId: userId })
        if (existingRequest) {
            return res.status(400).json({ success: false, message: "Request already sent" })
        }

        const request = new GroupRequest({
            groupId,
            requesterId: userId,
            status: "pending"
        })

        const savedRequest = await request.save()

        res.status(201).json({ success: true, message: "Join request sent", data: savedRequest })
    } catch (error) {
        console.error('Send Join Request Error:', error)
        res.status(500).json({ success: false, message: 'Send Join Request: Server error' })
    }
}

const getJoinRequests = async (req, res) => {
    try {
        const { groupId } = req.params
        const userId = req.user?.id

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token data.' })
        }


        const group = await Group.findById(groupId)
        if (!group) {
            return res.status(404).json({ success: false, message: "Group not found" })
        }

        if (group.ownerId.toString() !== userId) {
            return res.status(403).json({ success: false, message: "Not allowed" })
        }

        const requests = await GroupRequest.find({ groupId })

        res.status(200).json({ success: true, message: "Join requests fetched", data: requests })
    } catch (error) {
        console.error('Get Join Requests Error:', error)
        res.status(500).json({ success: false, message: 'Get Join Requests: Server error' })
    }
}

const decideRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { status } = req.body || {};
        const userId = req.user?.id;

        if (!requestId || !status) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const request = await GroupRequest.findById(requestId).populate("requesterId");
        if (!request) {
            return res.status(404).json({ success: false, message: "Request not found" });
        }

        const group = await Group.findById(request.groupId).populate("players").populate("ownerId");
        if (!group) {
            return res.status(404).json({ success: false, message: "Group not found" });
        }

        if (group.ownerId._id.toString() !== userId) {
            return res.status(403).json({ success: false, message: "Not allowed" });
        }

        if (status === "approved") {

            if (group.requiredPlayers <= 0) {
                return res.status(400).json({ success: false, message: "Group is already full" });
            }

            const isAlreadyPlayer = group.players.some(
                (p) => p._id.toString() === request.requesterId._id.toString()
            );

            if (!isAlreadyPlayer) {
                group.players.push(request.requesterId._id);
                group.requiredPlayers -= 1;
            }

            if (group.requiredPlayers === 0) {
                group.status = "closed";
            }

            await group.save();
        }

        await GroupRequest.deleteOne({ _id: requestId });

        const updatedGroup = await Group.findById(group._id)
            .populate("players", "name email phone visibility")
            .populate("ownerId", "name email phone visibility")
            .populate({
                path: "bookingId",
                populate: { path: "turfId" }
            });

        return res.status(200).json({
            success: true, message: "User approved successfully", data: maskGroup(updatedGroup)
        });

    } catch (error) {
        console.error("Request Decision Error:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};


const leaveGroup = async (req, res) => {
    try {
        const { groupId } = req.params
        const userId = req.user?.id

        const group = await Group.findById(groupId)
        if (!group) {
            return res.status(404).json({ success: false, message: "Group not found" })
        }

        const isPlayer = group.players.includes(userId)
        const isOwner = group.ownerId.toString() === userId

        if (!isPlayer && !isOwner) {
            return res.status(403).json({ success: false, message: "Not allowed" })
        }

        if (isPlayer) {
            group.players = group.players.filter(id => id.toString() !== userId)
            group.requiredPlayers += 1
            group.status = "open"
            await group.save()
        }

        res.status(200).json({ success: true, message: "Left group successfully" })
    } catch (error) {
        console.error('Leave Group Error:', error)
        res.status(500).json({ success: false, message: 'Leave Group: Server error' })
    }
}

const getMyCreatedGroups = async (req, res) => {
    try {
        const userId = req.user?.id

        const groups = await Group.find({ ownerId: userId }).populate({
            path: "bookingId", populate: { path: "turfId", select: "name location" }
        })
            .populate("ownerId", "name email phone visibility")
            .populate("players", "name email phone visibility")


        res.status(200).json({ success: true, message: "Created groups fetched", data: maskGroupList(groups) })
    } catch (error) {
        console.error('Get My Created Groups Error:', error)
        res.status(500).json({ success: false, message: 'Get My Created Groups: Server error' })
    }
}

const getMyJoinedGroups = async (req, res) => {
    try {
        const userId = req.user?.id

        const groups = await Group.find({ players: userId }).populate({
            path: "bookingId", populate: { path: "turfId", select: "name location" }
        })
            .populate("ownerId", "name email phone visibility")
            .populate("players", "name email phone visibility")


        res.status(200).json({ success: true, message: "Joined groups fetched", data: maskGroupList(groups) })
    } catch (error) {
        console.error('Get My Joined Groups Error:', error)
        res.status(500).json({ success: false, message: 'Get My Joined Groups: Server error' })
    }
}

const autoDeleteExpiredGroups = async () => {
    try {
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        if (cleanupTracker.lastCleanupDate && cleanupTracker.lastCleanupDate.getTime() === today.getTime()) {
            return;
        }

        const expiredBookings = await Booking.find({ date: { $lt: today } }).select('_id');
        if (!expiredBookings || expiredBookings.length === 0) {
            cleanupTracker.lastCleanupDate = today;
            return;
        }

        const bookingIds = expiredBookings.map(b => b._id);
        const expiredGroups = await Group.find({ bookingId: { $in: bookingIds } }).select('_id');
        const groupIds = expiredGroups.map(g => g._id);

        if (groupIds.length > 0) {
            await Group.deleteMany({ _id: { $in: groupIds } });
            await GroupRequest.deleteMany({ groupId: { $in: groupIds } });
            await Message.deleteMany({ groupId: { $in: groupIds } });
        }

        cleanupTracker.lastCleanupDate = today;

    } catch (err) {
        console.error('Auto-cleanup error:', err);
    }
};


const getAllGroups = async (req, res) => {
    try {
        const userId = req.user?.id

        const appliedRequests = await GroupRequest.find({ requesterId: userId }).select("groupId")
        const appliedIds = appliedRequests.map(r => r.groupId.toString())

        const groups = await Group.find({ ownerId: { $ne: userId }, players: { $ne: userId }, _id: { $nin: appliedIds } }).populate({ path: "bookingId", populate: { path: "turfId" } }).populate("ownerId", "name email phone visibility")
            .populate("players", "name email phone visibility")

        res.status(200).json({ success: true, message: "Applied groups fetched", data: maskGroupList(groups) })

    } catch (error) {
        console.error('Get All Groups Error:', error)
        res.status(500).json({ success: false, message: 'Get All Groups: Server error' })
    }
}


const getMyAppliedGroups = async (req, res) => {
    try {
        const userId = req.user?.id

        const requests = await GroupRequest.find({ requesterId: userId }).select("groupId status")

        const groupIds = requests.map(r => r.groupId)

        const groups = await Group.find({ _id: { $in: groupIds } }).populate({
            path: "bookingId", populate: { path: "turfId", select: "name location" }
        })
            .populate("ownerId", "name email phone visibility")
            .populate("players", "name email phone visibility")

        res.status(200).json({ success: true, message: "Applied groups fetched", data: maskGroupList(groups) })
    } catch (error) {
        console.error('Get My Applied Groups Error:', error)
        res.status(500).json({ success: false, message: 'Get My Applied Groups: Server error' })
    }
}

const getGroupDetails = async (req, res) => {
    try {
        const { groupId } = req.params;
        const userId = req.user?.id;

        if (!groupId) {
            return res.status(400).json({ success: false, message: "Group ID is required" });
        }

        const group = await Group.findById(groupId)
            .populate("ownerId", "name email phone visibility")
            .populate({
                path: "players",
                model: "User",
                select: "name email phone visibility"
            })
            .populate({
                path: "bookingId",
                populate: { path: "turfId", select: "name location" }
            });

        if (!group) {
            return res.status(404).json({ success: false, message: "Group not found" });
        }

        const appliedReq = await GroupRequest.findOne({
            requesterId: userId,
            groupId
        }).select("status");

        const isOwner = group.ownerId?._id.toString() === userId;
        const isMember = group.players.some(p => p._id.toString() === userId);

        if (!isOwner && !isMember) {
            return res.status(403).json({ success: false, message: "You are not allowed to view this group" });
        }

        let requests = [];
        if (isOwner) {
            requests = await GroupRequest.find({ groupId })
                .populate("requesterId", "name email phone visibility")
        }

        const maskedOwner = maskUser(group.ownerId)
        const maskedPlayers = group.players.map(maskUser)


        requests = requests.map(r => {
            r.requesterId = maskUser(r.requesterId)
            return r
        });


        return res.status(200).json({
            success: true,
            message: "Group details fetched",
            data: {
                group: {
                    ...group.toObject(),
                    ownerId: maskedOwner,
                    players: maskedPlayers
                },
                isOwner,
                isMember,
                applied: !!appliedReq,
                appliedStatus: appliedReq?.status || null,
                isFull: group.requiredPlayers === 0,
                requests
            }
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Get group details error : Server error" });
    }
};

const removePlayer = async (req, res) => {
    try {
        const { groupId, playerId } = req.params
        const userId = req.user?.id

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token data.' })
        }


        if (!groupId || !playerId) {
            return res.status(400).json({ success: false, message: "Group ID and Player ID are required" });
        }

        const group = await Group.findById(groupId)

        if (!group) {
            return res.status(404).json({ success: false, message: "Group not found" })
        }

        const isOwner = group.ownerId?._id.toString() === userId
        const isMember = group.players.some(p => p._id.toString() === playerId)

        if (!isOwner) {
            return res.status(404).json({ success: false, message: "You don't have permission to remove players." })
        }
        if (playerId === group.ownerId.toString()) {
            return res.status(404).json({ success: false, message: "Group owner cannot be removed." })
        }
        if (!isMember) {
            return res.status(404).json({ success: false, message: "Player is not a member of this group." })
        }

        group.players = group.players.filter((p) => p.toString() !== playerId)
        group.requiredPlayers = group.requiredPlayers + 1

        await group.save()


        return res.status(200).json({ success: true, message: "Player removed successfully.", data: group })


    } catch (error) {
        return res.status(500).json({ success: false, message: "remove players error : Server error" });
    }
}

const getAllMyGroupData = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const appliedRequests = await GroupRequest.find({ requesterId: userId }).select("groupId status");
        const appliedGroupIds = appliedRequests.map(r => r.groupId.toString());

        const [
            createdGroups,
            joinedGroups,
            appliedGroups
        ] = await Promise.all([

            Group.find({ ownerId: userId })
                .populate({ path: "bookingId", populate: { path: "turfId", select: "name location" } })
                .populate("ownerId", "name email phone visibility")
                .populate("players", "name email phone visibility"),

            Group.find({ players: userId })
                .populate({ path: "bookingId", populate: { path: "turfId", select: "name location" } })
                .populate("ownerId", "name email phone visibility")
                .populate("players", "name email phone visibility"),

            Group.find({ _id: { $in: appliedGroupIds } })
                .populate({ path: "bookingId", populate: { path: "turfId", select: "name location" } })
                .populate("ownerId", "name email phone visibility")
                .populate("players", "name email phone visibility")
        ]);

        return res.status(200).json({
            success: true,
            message: "All groups fetched successfully",
            data: {
                created: maskGroupList(createdGroups),
                joined: maskGroupList(joinedGroups),
                applied: maskGroupList(appliedGroups)
            }
        });

    } catch (error) {
        console.error("getAllMyGroupData Error:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};




module.exports = { createGroup, getGroupDetails, getAllMyGroupData, getMyAppliedGroups, getAllGroups, getGroupByBooking, sendJoinRequest, getJoinRequests, decideRequest, leaveGroup, getMyCreatedGroups, getMyJoinedGroups, autoDeleteExpiredGroups, removePlayer }
