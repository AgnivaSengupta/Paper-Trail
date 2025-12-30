import mongoose from 'mongoose'

const CommentSchema = new mongoose.Schema({
    post: {type: mongoose.Schema.Types.ObjectId, ref: 'BlogPost', required: true},
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    content: {type: String, required: true, default: ""},
    parentComment: {type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null},
    
    ancestors: [{type: mongoose.Schema.Types.ObjectId, ref:'Comment'}],
    // hasReplied: {type: Boolean, default: false},
    isDeleted: {type: Boolean, default: false},
    postAuthor: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
}, {timestamps: true})

const Comment = mongoose.model('Comment', CommentSchema)
export default Comment;