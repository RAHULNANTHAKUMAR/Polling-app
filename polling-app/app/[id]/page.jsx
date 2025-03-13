"use client"
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Circle, Share2, Info } from "lucide-react"; // Added Share2 and Info icons
import { cn } from "@/lib/utils";

export default function PollPage() {
    const { id } = useParams();
    const [poll, setPoll] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedOptions, setSelectedOptions] = useState({});
    const router = useRouter();
    const [pollUrl, setPollUrl] = useState('');

    useEffect(() => {
        setPollUrl(`${window.location.origin}/${id}`); // Generate poll URL

        const fetchPoll = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/poll/${id}`);
                if (!response.ok) {
                    console.error('Failed to fetch poll:', response.statusText);
                    return;
                }
                const data = await response.json();
                setPoll(data.poll);
            } catch (error) {
                console.error('Error fetching poll:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPoll();
    }, [id]);

    const handleVote = async () => {
        if (!poll) return;

        for (let questionIndex = 0; questionIndex < poll.questions.length; questionIndex++) {
            if (selectedOptions[questionIndex] === undefined) {
                alert(`Please select an option for question ${questionIndex + 1}`);
                return;
            }
        }

        try {
            for (let questionIndex = 0; questionIndex < poll.questions.length; questionIndex++) {
                const optionIndex = selectedOptions[questionIndex];
                const response = await fetch('/api/vote', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ pollId: id, questionIndex, optionIndex }),
                });

                if (!response.ok) {
                    console.error('Vote failed:', response.statusText);
                    const errorData = await response.json();
                    alert(errorData.message || 'Voting failed. Please try again.');
                    return;
                }
            }

            alert('Votes cast successfully!');
            router.push(`/${id}/result`);

        } catch (error) {
            console.error('Error casting vote:', error);
            alert('Error casting vote. Please try again.');
        }
    };


    const handleOptionChange = (questionIndex, optionIndex) => {
        setSelectedOptions(prevOptions => ({
            ...prevOptions,
            [questionIndex]: optionIndex,
        }));
    };

    const handleShare = () => {
        navigator.clipboard.writeText(pollUrl);
        alert('Poll URL copied to clipboard!');
    };


    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading poll...</div>;
    }

    if (!poll) {
        return <div className="flex items-center justify-center min-h-screen">Poll not found.</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 dark:bg-gradient-to-br dark:from-blue-900 dark:to-purple-900 py-6 px-4 sm:px-6 lg:px-8"> {/* Gradient background */}
            <Card className="w-full max-w-md bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">{poll.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <form className="space-y-4">
                        {poll.questions.map((question, questionIndex) => (
                            <div key={questionIndex} className="space-y-2">
                                <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">{question.question}</h2>
                                <div className="space-y-2">
                                    {question.options.map((option, optionIndex) => (
                                        <div key={optionIndex}
                                            className={cn(
                                                "flex items-center p-3 rounded-md border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer",
                                                selectedOptions[questionIndex] === optionIndex
                                                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white" // Gradient on selected
                                                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300",
                                            )}
                                            onClick={() => handleOptionChange(questionIndex, optionIndex)}
                                        >
                                            {selectedOptions[questionIndex] === optionIndex ? (
                                                <CheckCircle className="mr-2 h-5 w-5" />
                                            ) : (
                                                <Circle className="mr-2 h-5 w-5" />
                                            )}
                                            <span>{option.option}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                        <Button type="button" onClick={handleVote} className="w-full">
                            Vote
                        </Button>
                    </form>
                    <Button variant="ghost" onClick={handleShare} className="mt-4 w-full justify-center">
                        <Share2 className="mr-2 h-4 w-4" />
                        Share Poll
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}