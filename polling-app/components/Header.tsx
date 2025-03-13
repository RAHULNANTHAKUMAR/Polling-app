import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { User2, LayoutDashboard, PlusCircle, LogOut } from "lucide-react"; // Importing icons

async function GlassyHeader() {
    const session = await getServerSession(authOptions);

    return (
        <header className="sticky top-0 z-50 bg-white/[.75] dark:bg-gray-900/[.75] backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="container mx-auto py-4 px-6 flex items-center justify-between">
                <Link href="/" className="text-xl font-semibold">Poll App</Link>

                <nav className="flex items-center space-x-4">
                    {session?.user ? (
                        <>
                            <Link href="/dashboard" className="hover:text-blue-500 transition-colors duration-200 flex items-center">
                                <LayoutDashboard className="mr-1 h-4 w-4" />
                                Dashboard
                            </Link>
                            <Link href="/create" className="hover:text-blue-500 transition-colors duration-200 flex items-center">
                                <PlusCircle className="mr-1 h-4 w-4" />
                                Create Poll
                            </Link>
                            <form action="/api/auth/signout" method="post">
                                <Button type="submit" variant="ghost" size="sm" className="flex items-center">
                                    <LogOut className="mr-1 h-4 w-4" />
                                    Logout
                                </Button>
                            </form>
                        </>
                    ) : (
                        <>
                            <Link href="/api/auth/signin" className="hover:text-blue-500 transition-colors duration-200 flex items-center">
                                <User2 className="mr-1 h-4 w-4" />
                                Login
                            </Link>
                            <Link href="/create" className="hover:text-blue-500 transition-colors duration-200">
                                Create your first poll
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}

export default GlassyHeader;