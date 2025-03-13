"use client"

import type React from "react"
import { useRouter } from 'next/navigation'; // Import useRouter

import { useState } from "react"
import { PlusCircle, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface Question {
    text: string
    options: string[]
}

export default function PollCreation() {
    const [pollTitle, setPollTitle] = useState("")
    const [questions, setQuestions] = useState<Question[]>([{ text: "", options: [""] }])
    const router = useRouter(); // Initialize useRouter

    const addQuestion = () => {
        setQuestions([...questions, { text: "", options: [""] }])
    }

    const addOption = (questionIndex: number) => {
        const newQuestions = [...questions]
        newQuestions[questionIndex].options.push("")
        setQuestions(newQuestions)
    }

    const updateQuestionText = (questionIndex: number, text: string) => {
        const newQuestions = [...questions]
        newQuestions[questionIndex].text = text
        setQuestions(newQuestions)
    }

    const updateOptionText = (questionIndex: number, optionIndex: number, text: string) => {
        const newQuestions = [...questions]
        newQuestions[questionIndex].options[optionIndex] = text
        setQuestions(newQuestions)
    }

    const removeOption = (questionIndex: number, optionIndex: number) => {
        const newQuestions = [...questions]
        newQuestions[questionIndex].options.splice(optionIndex, 1)
        setQuestions(newQuestions)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const pollData = {
            name: pollTitle,
            questions: questions.map(q => ({
                question: q.text,
                options: q.options.map(opt => ({
                    option: opt,
                    vote_count: 0,
                    voters: []
                }))
            }))
        };

        try {
            const response = await fetch('/api/poll', { // Corrected endpoint path
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(pollData),
            });

            if (!response.ok) {
                // Handle error responses from the backend
                console.error('Failed to submit poll:', response.statusText);
                return;
            }

            const data = await response.json();
            if (data && data._id) {
                router.push(`/${data._id}`); // Redirect using next/navigation
            } else {
                console.error('Invalid response from backend:', data);
            }

        } catch (error) {
            // Handle network errors or exceptions
            console.error('Error submitting poll:', error);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 py-6 px-4 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">Create a New Poll</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="pollTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Poll Title</Label>
                            <Input
                                id="pollTitle"
                                value={pollTitle}
                                onChange={(e) => setPollTitle(e.target.value)}
                                placeholder="Enter poll title"
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                        </div>

                        {questions.map((question, qIndex) => (
                            <div key={qIndex} className="space-y-2">
                                <Label htmlFor={`question-${qIndex}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Question {qIndex + 1}</Label>
                                <Input
                                    id={`question-${qIndex}`}
                                    value={question.text}
                                    onChange={(e) => updateQuestionText(qIndex, e.target.value)}
                                    placeholder="Enter question"
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                />

                                <div className="space-y-2">
                                    {question.options.map((option, oIndex) => (
                                        <div key={oIndex} className="flex items-center space-x-2">
                                            <Input
                                                value={option}
                                                onChange={(e) => updateOptionText(qIndex, oIndex, e.target.value)}
                                                placeholder={`Option ${oIndex + 1}`}
                                                required
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                onClick={() => removeOption(qIndex, oIndex)}
                                                disabled={question.options.length <= 1}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>

                                <Button type="button" variant="secondary" size="sm" onClick={() => addOption(qIndex)}>
                                    Add Option
                                </Button>
                            </div>
                        ))}

                        <Button type="button" variant="outline" onClick={addQuestion} className="w-full justify-center">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add New Question
                        </Button>

                        <Button type="submit" className="w-full justify-center">
                            Submit Poll
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}