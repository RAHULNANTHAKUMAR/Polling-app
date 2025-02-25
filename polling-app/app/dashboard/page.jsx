// app/dashboard/page.tsx
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';
import { PollModel } from '@/lib/models/Poll';
import Link from 'next/link';
import { redirect } from 'next/navigation';

async function getDashboardData() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect('/api/auth/signin'); // Redirect to signin if no session
    }

    await dbConnect();
    const user = await User.findOne({ email: session.user?.email }).populate('created_polls').populate('voted_polls');

    if (!user) {
        return { username: session.user?.name || 'User', createdPolls: [], votedPolls: [] };
    }

    // Fetch full poll data for voted polls - already populated in user.voted_polls
    // Fetch full poll data for created polls - already populated in user.created_polls

    return {
        username: user.name,
        createdPolls: user.created_polls,
        votedPolls: user.voted_polls,
    };
}

export default async function Dashboard() {
    const { username, createdPolls, votedPolls } = await getDashboardData();

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
            <p className="mb-4">Welcome, <span className="font-semibold">{username}</span>!</p>

            <div>
                <h2 className="text-xl font-semibold mb-4">Created Polls</h2>
                {createdPolls.length > 0 ? (
                    <ul className="space-y-2">
                        {createdPolls.map((poll) => (
                            <li key={poll._id}>
                                <Link href={`/${poll._id}`} className="text-blue-500 hover:underline">
                                    {poll.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No polls created yet.</p>
                )}
            </div>

            <div>
                <Link href="/create" className="text-blue-500 hover:underline">
                    <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Create a Poll</button>
                </Link>
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Voted Polls</h2>
                {votedPolls.length > 0 ? (
                    <ul className="space-y-2">
                        {votedPolls.map((poll) => (
                            <li key={poll._id}>
                                <Link href={`/${poll._id}/result`} className="text-blue-500 hover:underline">
                                    {poll.name} - Results
                                </Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No polls voted in yet.</p>
                )}
            </div>
        </div>
    );
}