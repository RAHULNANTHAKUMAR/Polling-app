"use client"
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function PollPage() {
    const { id } = useParams();
    const [poll, setPoll] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedOptions, setSelectedOptions] = useState({});
    const router = useRouter();

    useEffect(() => {
        const fetchPoll = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/poll/${id}`);
                if (!response.ok) {
                    // Handle error, maybe redirect to an error page
                    console.error('Failed to fetch poll:', response.statusText);
                    return;
                }
                const data = await response.json();
                setPoll(data.poll);
            } catch (error) {
                console.error('Error fetching poll:', error);
                // Handle error, maybe redirect to an error page
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
                    return; // Stop voting process if one vote fails
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


    if (loading) {
        return <div>Loading poll...</div>;
    }

    if (!poll) {
        return <div>Poll not found.</div>;
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">{poll.name}</h1>
            <form className="space-y-6">
                {poll.questions.map((question, questionIndex) => (
                    <div key={questionIndex} className="border p-4 rounded-md space-y-4">
                        <h2 className="font-semibold">{question.question}</h2>
                        <div className="space-y-2">
                            {question.options.map((option, optionIndex) => (
                                <div key={optionIndex} className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        id={`question-${questionIndex}-option-${optionIndex}`}
                                        name={`question-${questionIndex}`}
                                        value={optionIndex}
                                        onChange={() => handleOptionChange(questionIndex, optionIndex)}
                                    />
                                    <label htmlFor={`question-${questionIndex}-option-${optionIndex}`}>{option.option}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
                <Button type="button" onClick={handleVote} className="w-full">
                    Vote
                </Button>
            </form>
        </div>
    );
}