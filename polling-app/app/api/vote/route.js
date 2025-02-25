// app/api/vote/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { PollModel } from '@/lib/models/Poll';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import User from '@/lib/models/User';

export async function POST(req) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);

        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { pollId, questionIndex, optionIndex } = await req.json();
        const userEmail = session.user.email;

        const poll = await PollModel.findById(pollId);
        if (!poll) {
            return NextResponse.json({ message: "Poll not found" }, { status: 404 });
        }

        const option = poll.questions[questionIndex].options[optionIndex];

        if (option.voters.includes(userEmail)) {
            return NextResponse.json({ message: "User has already voted in this poll" }, { status: 400 });
        }

        option.vote_count += 1;
        option.voters.push(userEmail);

        await poll.save();

        // Update User's voted_polls array (only if not already voted - you might want to handle this differently if user can vote on multiple options in same poll later)
        const user = await User.findOne({ email: userEmail });
        if (!user.voted_polls.includes(pollId)) { // Check if pollId is already in voted_polls to avoid duplicates
            await User.findOneAndUpdate(
                { email: userEmail },
                { $push: { voted_polls: pollId } }
            );
        }


        return NextResponse.json({ message: "Vote cast successfully", poll });

    } catch (error) {
        console.error("Error casting vote:", error);
        return NextResponse.json({ message: "Error casting vote", error: error.message }, { status: 500 });
    }
}