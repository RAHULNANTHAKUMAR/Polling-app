"use client"
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, PieChart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button"; // Import Button
import { cn } from "@/lib/utils";
import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart as RechartsPieChart, Pie, Cell, Legend } from 'recharts';

interface PollOption {
    option: string;
    vote_count: number;
}

interface PollQuestion {
    question: string;
    options: PollOption[];
}

interface Poll {
    name: string;
    questions: PollQuestion[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#A826D9']; // More distinct colors

export default function PollResultsPage() {
    const { id } = useParams();
    const [poll, setPoll] = useState<Poll | null>(null);
    const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');
    const [pollUrl, setPollUrl] = useState(''); // State for poll URL

    useEffect(() => {
        setPollUrl(`${window.location.origin}/${id}/result`); // Generate poll URL

        const fetchPollResults = async () => {
            try {
                const response = await fetch(`/api/poll/${id}`);
                if (!response.ok) {
                    console.error('Failed to fetch poll results:', response.statusText);
                    return;
                }
                const data = await response.json();
                setPoll(data.poll);
            } catch (error) {
                console.error('Error fetching poll results:', error);
            }
        };

        fetchPollResults();
    }, [id]);


    const getChartData = (options: PollOption[]) => {
        return options.map((option, index) => ({
            name: option.option,
            votes: option.vote_count,
            color: COLORS[index % COLORS.length], // Assign color to each slice
        }));
    };

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(pollUrl);
            alert('Poll results URL copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy:', err);
            alert('Failed to copy poll results URL. Please try again.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 py-6 px-4 sm:px-6 lg:px-8">
            <Card className="w-full max-w-xl bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">{poll?.name} - Results</CardTitle>
                    <div className="flex justify-center mt-2">
                        <button
                            onClick={() => setChartType('bar')}
                            className={cn(
                                "p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200",
                                chartType === 'bar' ? "bg-gray-200 dark:bg-gray-700" : ""
                            )}
                        >
                            <BarChart className="h-5 w-5" />
                        </button>
                        <button
                            onClick={() => setChartType('pie')}
                            className={cn(
                                "p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200",
                                chartType === 'pie' ? "bg-gray-200 dark:bg-gray-700" : ""
                            )}
                        >
                            <PieChart className="h-5 w-5" />
                        </button>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    {poll?.questions.map((question, questionIndex) => {
                        const chartData = getChartData(question.options);

                        return (
                            <div key={questionIndex} className="mb-6">
                                <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">{question.question}</h2>

                                {chartType === 'bar' && (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <RechartsBarChart data={chartData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="votes" fill="#8884d8" />
                                        </RechartsBarChart>
                                    </ResponsiveContainer>
                                )}

                                {chartType === 'pie' && (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <RechartsPieChart>
                                            <Pie
                                                data={chartData}
                                                dataKey="votes"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={80}
                                                fill="#8884d8"
                                                label
                                            >
                                                {
                                                    chartData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))
                                                }
                                            </Pie>
                                            <Tooltip />
                                            <Legend />
                                        </RechartsPieChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        );
                    })}
                    <Button variant="ghost" onClick={handleShare} className="mt-4 w-full justify-center">
                        <Share2 className="mr-2 h-4 w-4" />
                        Share Results
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}