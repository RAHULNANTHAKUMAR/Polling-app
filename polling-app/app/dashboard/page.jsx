// app/dashboard/page.tsx
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';
import { PollModel } from '@/lib/models/Poll';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Vote, Plus, BarChart, List } from 'lucide-react'; // Changed ListBullet to List
import { cn } from "@/lib/utils"

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

    return {
        username: user.name,
        createdPolls: user.created_polls,
        votedPolls: user.voted_polls,
    };
}

export default async function Dashboard() {
    const { username, createdPolls, votedPolls } = await getDashboardData();

    return (
        <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">

            <main className={cn("container mx-auto py-12 px-8 flex-grow", "max-w-screen-xl w-4/5")}>
                <div className="mb-8">
                    <h1 className="text-2xl font-semibold">Welcome back, {username}!</h1>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Created Polls */}
                    <section className="col-span-full md:col-span-2 lg:col-span-2"> {/* Adjusted column span */}
                        <Card className="bg-white dark:bg-gray-800 shadow-md overflow-hidden">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-2xl font-bold">Created Polls</CardTitle>
                                <Link href="/create">
                                    <Button variant="outline">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Create a Poll
                                    </Button>
                                </Link>
                            </CardHeader>
                            <CardContent>
                                {createdPolls.length > 0 ? (
                                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {createdPolls.map((poll) => (
                                            <li key={poll._id} className="py-4">
                                                <Link href={`/${poll._id}`} className="flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 px-2 py-1 rounded-md transition-colors duration-200">
                                                    <div className="flex items-center">
                                                        <List className="mr-2 h-5 w-5" /> {/* Changed ListBullet to List */}
                                                        <span>{poll.name}</span>
                                                    </div>
                                                    <Button size="sm">View Poll</Button>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500 dark:text-gray-400">No polls created yet.</p>
                                )}
                            </CardContent>
                        </Card>
                    </section>

                    {/* Voted Polls */}
                    <section className="col-span-full md:col-span-1 lg:col-span-1"> {/* Adjusted column span */}
                        <Card className="bg-white dark:bg-gray-800 shadow-md overflow-hidden">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-2xl font-bold">Voted Polls</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {votedPolls.length > 0 ? (
                                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {votedPolls.map((poll) => (
                                            <li key={poll._id} className="py-4">
                                                <Link href={`/${poll._id}/result`} className="flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 px-2 py-1 rounded-md transition-colors duration-200">
                                                    <div className="flex items-center">
                                                        <Vote className="mr-2 h-5 w-5" />
                                                        <span>{poll.name}</span>
                                                    </div>
                                                    <Button size="sm" variant="secondary">
                                                        <BarChart className="mr-2 h-4 w-4" />
                                                        Results
                                                    </Button>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500 dark:text-gray-400">No polls voted in yet.</p>
                                )}
                            </CardContent>
                        </Card>
                    </section>
                </div>
            </main>

            <footer className="py-4 px-8 bg-white dark:bg-gray-800 shadow-inner">
                <div className="container mx-auto text-center text-gray-500 dark:text-gray-400 max-w-screen-xl">
                    <p>© {new Date().getFullYear()} Poll App. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}