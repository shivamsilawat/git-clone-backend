const mongoose = require("mongoose");
const { Schema } = mongoose;

const IssueSchema = new Schema({
  
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    status: {
        type: String,
        enum: ["open", "closed"],
        default: "open"
    },
    assignee: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    repository: {
        type: Schema.Types.ObjectId,
        ref: "Repository",
        required: true
    }
});

const Issue = mongoose.model("Issue", IssueSchema);
module.exports = Issue;