import mongoose, { Types } from 'mongoose'

const BlogPostSchema = new mongoose.Schema({
    title: {type: String, required: true},
    slug: {type: String, required: true, unique: true},
    content: {
        json: { type: Object, required: true },  // editor.getJSON()
        html: { type: String, required: true },  // editor.getHTML()
    },
    coverImageUrl: {type: String, default: null},
    tags: [{type: String}],
    author: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    isDraft: {type: Boolean, default: false},
    // status: {
    //   type: String,
    //   enum: ['published', 'draft'],
    //   default: 'draft'
    // },
    views: {type: Number, default: 0},
    likes: {type: Number, default: 0},
    generatedByAi: {type: Boolean, default: false}
}, {timestamps: true})

const BlogPost = mongoose.model("BlogPost", BlogPostSchema);

export default BlogPost;