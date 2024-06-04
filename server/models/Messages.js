const mongoose = require("mongoose");
const messageSchema = new mongoose.Schema({

    from_user_id: {
        type: String,
    },
    to_user_id: {
        type: String,
    },
    message: {
        type: String,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model("Message", messageSchema);