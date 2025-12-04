const express = require("express");

const { createGroup, getGroupByBooking,getGroupDetails, sendJoinRequest, getJoinRequests, decideRequest, leaveGroup, getMyCreatedGroups, getMyJoinedGroups, getMyAppliedGroups, getAllGroups, autoDeleteExpiredGroups,removePlayer } = require("../controllers/groupController")

const authUser = require('../middlewares/authUser.js')


const router = express.Router();

// create new group
router.post("/create", authUser, createGroup)
// get group for a booking
router.get("/by-booking/:bookingId", authUser, getGroupByBooking)
// send join request
router.post("/request", authUser, sendJoinRequest)
// get join requests for a group 
router.get("/requests/:groupId", authUser, getJoinRequests)
// approve or reject join request
router.patch("/request/decide/:requestId", authUser, decideRequest)
// leave a group
router.delete("/leave/:groupId", authUser, leaveGroup)


// groups created by user
router.get("/my-groups/created", authUser, getMyCreatedGroups)
// groups the user has joined
router.get("/my-groups/joined", authUser, getMyJoinedGroups)
// groups the user applied to join
router.get("/my-groups/applied", authUser, getMyAppliedGroups)
//get group by id
router.get("/details/:groupId", authUser, getGroupDetails);

// fetch all groups 
router.get("/all", authUser, getAllGroups)


// auto delete expired groups
router.delete("/auto-clean", autoDeleteExpiredGroups)

//remove group members
router.delete("/remove-player/:groupId/:playerId",authUser,removePlayer)


module.exports = router;
