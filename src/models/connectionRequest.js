const mongoose = require('mongoose');
const connectionRequestSchema = mongoose.Schema({
    fromUserId : {
        type : mongoose.Schema.Types.ObjectId,
        required: true,
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected' , 'interested' , 'ignored'],
        message : `{VALUE} is not a valid status`,
        required: true,
    },
} , { timestamps: true });

const ConnectionRequest = mongoose.model('ConnectionRequest', connectionRequestSchema);

module.exports = ConnectionRequest;