// app/api/poll/page/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { PollModel } from '@/lib/models/Poll';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import User from '@/lib/models/User';

export async function POST(req) {
    try {
        await dbConnect();
        const pollData = await req.json();
        const session = await getServerSession(authOptions);

        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const newPoll = new PollModel(pollData);
        const savedPoll = await newPoll.save();

        // Update User's created_polls array
        await User.findOneAndUpdate(
            { email: session.user.email },
            { $push: { created_polls: savedPoll._id } }
        );


        return NextResponse.json(savedPoll, { status: 201 });

    } catch (error) {
        console.error("Error creating poll:", error);
        return NextResponse.json({ message: "Error creating poll", error: error.message }, { status: 500 });
    }
}