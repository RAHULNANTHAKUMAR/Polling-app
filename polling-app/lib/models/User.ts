// app/lib/models/User.js
import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    created_polls: [{
        type: Schema.Types.ObjectId,
        ref: 'Poll',
    }],
    voted_polls: [{
        type: Schema.Types.ObjectId,
        ref: 'Poll',
    }],
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;