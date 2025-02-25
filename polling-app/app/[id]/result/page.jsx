"use client"
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function PollResultsPage() {
    const { id } = useParams();
    const [poll, setPoll] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPollResults = async () => {
            setLoading(true);
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
            } finally {
                setLoading(false);
            }
        };

        fetchPollResults();
    }, [id]);

    if (loading) {
        return <div>Loading poll results...</div>;
    }

    if (!poll) {
        return <div>Poll results not found.</div>;
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">{poll.name} - Results</h1>
            {poll.questions.map((question, questionIndex) => (
                <div key={questionIndex} className="border p-4 rounded-md space-y-4">
                    <h2 className="font-semibold">{question.question}</h2>
                    <ul className="space-y-2">
                        {question.options.map((option, optionIndex) => (
                            <li key={optionIndex} className="flex justify-between">
                                <span>{option.option}</span>
                                <span>Votes: {option.vote_count}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
}