import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import QuestionCard from './QuestionCard';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { ArrowRight } from 'lucide-react';

interface Question {
  id: string;
  question: string;
  correct_answer: string;
  answer_a: string;
  answer_b: string;
  answer_c: string;
  answer_d: string;
  explanation: string;
  category: string;
}

const QuestionsSection = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*');

      if (error) throw error;

      setQuestions(data || []);
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les questions. Veuillez réessayer plus tard.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async (answer: string) => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = answer === currentQuestion.correct_answer;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Vous devez être connecté pour enregistrer vos réponses.",
        });
        return;
      }

      // Save user's answer
      const { error: answerError } = await supabase
        .from('user_answers')
        .insert({
          question_id: currentQuestion.id,
          selected_answer: answer,
          is_correct: isCorrect,
          user_id: user.id
        });

      if (answerError) throw answerError;

      // Update user progress
      const { error: progressError } = await supabase
        .from('user_progress')
        .upsert({
          category: currentQuestion.category,
          correct_answers: isCorrect ? 1 : 0,
          total_answers: 1,
          user_id: user.id
        }, {
          onConflict: 'user_id,category'
        });

      if (progressError) throw progressError;

      // Show feedback toast
      toast({
        title: isCorrect ? "Bonne réponse !" : "Mauvaise réponse",
        description: isCorrect ? "Continuez comme ça !" : currentQuestion.explanation,
        variant: isCorrect ? "default" : "destructive",
      });

    } catch (error) {
      console.error('Error saving answer:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'enregistrer votre réponse. Veuillez réessayer.",
      });
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  if (loading) {
    return <div className="text-center">Chargement des questions...</div>;
  }

  if (!questions.length) {
    return <div className="text-center">Aucune question disponible pour le moment.</div>;
  }

  return (
    <div className="space-y-6">
      <QuestionCard
        question={questions[currentQuestionIndex]}
        onAnswer={handleAnswer}
      />
      {currentQuestionIndex < questions.length - 1 && (
        <div className="text-center">
          <Button onClick={nextQuestion} className="gap-2">
            Question suivante
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default QuestionsSection;