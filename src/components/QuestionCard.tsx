import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
  question: {
    id: string;
    question: string;
    answer_a: string;
    answer_b: string;
    answer_c: string;
    answer_d: string;
    correct_answer: string;
    explanation: string;
  };
  onAnswer: (answer: string) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, onAnswer }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [hasAnswered, setHasAnswered] = useState(false);

  const handleSubmit = () => {
    if (!selectedAnswer) return;
    onAnswer(selectedAnswer);
    setHasAnswered(true);
  };

  const isCorrect = hasAnswered && selectedAnswer === question.correct_answer;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{question.question}</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedAnswer}
          onValueChange={setSelectedAnswer}
          className="space-y-4"
          disabled={hasAnswered}
        >
          {['answer_a', 'answer_b', 'answer_c', 'answer_d'].map((key) => (
            <div key={key} className="flex items-center space-x-2">
              <RadioGroupItem value={question[key]} id={key} />
              <Label
                htmlFor={key}
                className={cn(
                  "flex-grow p-2 rounded",
                  hasAnswered && question[key] === question.correct_answer && "bg-green-100",
                  hasAnswered && selectedAnswer === question[key] && selectedAnswer !== question.correct_answer && "bg-red-100"
                )}
              >
                {question[key]}
              </Label>
            </div>
          ))}
        </RadioGroup>
        
        {hasAnswered && (
          <div className={cn(
            "mt-4 p-4 rounded",
            isCorrect ? "bg-green-50" : "bg-red-50"
          )}>
            <p className="font-semibold mb-2">
              {isCorrect ? "Correct ! 👏" : "Incorrect 😕"}
            </p>
            <p>{question.explanation}</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSubmit} 
          disabled={!selectedAnswer || hasAnswered}
          className="w-full"
        >
          Valider
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuestionCard;