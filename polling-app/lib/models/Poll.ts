// app/lib/models/Poll.js
import mongoose, { Schema } from 'mongoose';

const PollSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    questions: [{
        question: {
            type: String,
            required: true
        },
        options: [{
            option: {
                type: String,
                required: true
            },
            vote_count: {
                type: Number,
                default: 0
            },
            voters: [{
                type: String // Store voter emails
            }]
        }]
    }]
});

export const PollModel = mongoose.models.Poll || mongoose.model('Poll', PollSchema);