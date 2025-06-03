const express = require('express')
const userAuth = require('../middle-ware/auth')
const ConnectionRequest = require('../models/connectionRequest')
const requestRouter = express.Router();
const User = require('../models/user')
requestRouter.use(express.json()) 

requestRouter.post('/request/send/:status/:toUserId', userAuth, async (req, res) => {
  try {
    const fromUserId = req.user[0]._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;
    if (fromUserId === toUserId) {
      return res.status(400).json({
        error: 'You cannot send a connection request to yourself.'
      });
    } 
    const allowedStatus = ['interested', 'ignored'].includes(status);
    if (!allowedStatus) {
      return res.status(400).json({
        error: 'Invalid status. Allowed values are "interested" or "ignored".'
      });
    }

    const connectionAlreadyExists = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, receiverId: toUserId },
        { fromUserId: toUserId, receiverId: fromUserId }
      ]
    });
 
    if (connectionAlreadyExists) {
      return res.status(400).send('Connection Request Already Exists');
    }

    const requestedUser = await User.findById(toUserId);
    if (!requestedUser) {
      return res.status(404).send('User not found');
    }

    const connectionRequest = {
      fromUserId,
      receiverId: toUserId,
      status
    };

    const connectionRequestDocument = new ConnectionRequest(connectionRequest);
    await connectionRequestDocument.save();

    res.send('Connection Request Sent Successfully');
  } catch (err) {
    res.status(400).send('Something Went Wrong: ' + err.message);
  }
});

module.exports = requestRouter 