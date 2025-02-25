"use client"

import type React from "react"
import { useRouter } from 'next/navigation'; // Import useRouter

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PlusCircle, X } from "lucide-react"

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
      const response = await fetch('/api/poll/page', { // Corrected endpoint path
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
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create a New Poll</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="pollTitle">Poll Title</Label>
          <Input
            id="pollTitle"
            value={pollTitle}
            onChange={(e) => setPollTitle(e.target.value)}
            placeholder="Enter poll title"
            required
          />
        </div>

        {questions.map((question, qIndex) => (
          <div key={qIndex} className="border p-4 rounded-md space-y-4">
            <Label htmlFor={`question-${qIndex}`}>Question {qIndex + 1}</Label>
            <Input
              id={`question-${qIndex}`}
              value={question.text}
              onChange={(e) => updateQuestionText(qIndex, e.target.value)}
              placeholder="Enter question"
              required
            />

            <div className="space-y-2">
              {question.options.map((option, oIndex) => (
                <div key={oIndex} className="flex items-center space-x-2">
                  <Input
                    value={option}
                    onChange={(e) => updateOptionText(qIndex, oIndex, e.target.value)}
                    placeholder={`Option ${oIndex + 1}`}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeOption(qIndex, oIndex)}
                    disabled={question.options.length <= 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <Button type="button" variant="outline" onClick={() => addOption(qIndex)}>
              Add Option
            </Button>
          </div>
        ))}

        <Button type="button" onClick={addQuestion} className="w-full">
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Question
        </Button>

        <Button type="submit" className="w-full">
          Submit Poll
        </Button>
      </form>
    </div>
  )
}