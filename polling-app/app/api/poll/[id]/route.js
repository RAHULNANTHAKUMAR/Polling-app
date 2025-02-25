// app/api/poll/[id]/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { PollModel } from '@/lib/models/Poll';

export async function GET(req, { params }) {
    try {
        await dbConnect();
        const { id } = params;

        const poll = await PollModel.findById(id);

        if (!poll) {
            return NextResponse.json({ message: "Poll not found" }, { status: 404 });
        }

        return NextResponse.json({ poll });

    } catch (error) {
        console.error("Error fetching poll:", error);
        return NextResponse.json({ message: "Error fetching poll", error: error.message }, { status: 500 });
    }
}