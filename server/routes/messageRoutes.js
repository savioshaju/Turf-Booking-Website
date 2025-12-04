const express = require("express");
const router = express.Router();
const {sendMessage, getMessages} = require("../controllers/messageController");
const authUser = require('../middlewares/authUser.js')


// send message to the group
router.post("/send",authUser,sendMessage);
// retrive all the messages
router.get("/:groupId",authUser,getMessages);

module.exports = router;
