const Group = require('../models/groupModel')
const GroupRequest = require('../models/groupRequestModel')
const Booking = require('../models/bookingModel')
const User = require('../models/userModel')
const cleanupTracker = require('../utils/cleanupTracker')

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
        console.log(ownerId)
        console.log(booking.userId)

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
            .populate("players", "name email phone")
            .populate("ownerId", "name email phone")
            .populate({
                path: "bookingId",
                populate: { path: "turfId" }
            });

        return res.status(200).json({
            success: true, message: "User approved successfully", data: updatedGroup
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
            .populate("ownerId players")

        res.status(200).json({ success: true, message: "Created groups fetched", data: groups })
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
            .populate("ownerId players")

        res.status(200).json({ success: true, message: "Joined groups fetched", data: groups })
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
    }

    cleanupTracker.lastCleanupDate = today;

    console.log(`Auto-cleanup executed → Bookings: ${bookingIds.length}, Groups: ${groupIds.length}`);
  } catch (err) {
    console.error('Auto-cleanup error:', err);
  }
};


const getAllGroups = async (req, res) => {
    try {
        const userId = req.user?.id

        const appliedRequests = await GroupRequest.find({ requesterId: userId }).select("groupId")
        const appliedIds = appliedRequests.map(r => r.groupId.toString())

        const groups = await Group.find({ ownerId: { $ne: userId }, players: { $ne: userId }, _id: { $nin: appliedIds } }).populate({ path: "bookingId", populate: { path: "turfId" } }).populate("ownerId players")

        res.status(200).json({ success: true, message: "Applied groups fetched", data: groups })

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
            .populate("ownerId players")

        res.status(200).json({ success: true, message: "Applied groups fetched", data: groups })
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
            .populate("ownerId", "name email phone")
            .populate("players", "name email phone")
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

        let requests = [];
        if (isOwner) {
            requests = await GroupRequest.find({ groupId })
                .populate("requesterId", "name email phone");
        }

        return res.status(200).json({
            success: true,
            message: "Group details fetched",
            data: {
                group,
                isOwner,
                isMember,
                applied: !!appliedReq,
                appliedStatus: appliedReq?.status || null,
                isFull: group.requiredPlayers === 0,
                requests
            }
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error" });
    }
};



module.exports = { createGroup, getGroupDetails, getMyAppliedGroups, getAllGroups, getGroupByBooking, sendJoinRequest, getJoinRequests, decideRequest, leaveGroup, getMyCreatedGroups, getMyJoinedGroups, autoDeleteExpiredGroups }
