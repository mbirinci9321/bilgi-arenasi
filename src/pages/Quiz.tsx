import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { Question } from '../types/quiz';
import { questions } from '../data/questions';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const QuizContainer = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  animation: ${fadeIn} 0.5s ease;
`;

const QuestionText = styled.h2`
  color: #333;
  margin-bottom: 2rem;
  text-align: center;
  animation: ${fadeIn} 0.5s ease;
`;

const OptionsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
`;

const OptionButton = styled.button<{ isSelected?: boolean; isCorrect?: boolean; isWrong?: boolean }>`
  padding: 1rem;
  border: 2px solid ${props => props.isSelected ? '#4CAF50' : '#ddd'};
  border-radius: 5px;
  background-color: ${props => {
    if (props.isCorrect) return '#4CAF50';
    if (props.isWrong) return '#ff4444';
    return 'white';
  }};
  color: ${props => (props.isSelected || props.isCorrect || props.isWrong) ? 'white' : '#333'};
  cursor: pointer;
  transition: all 0.3s;
  animation: ${props => props.isWrong ? shake : props.isCorrect ? pulse : 'none'} 0.5s;

  &:hover {
    border-color: #4CAF50;
    background-color: ${props => props.isSelected ? undefined : '#f0f0f0'};
    transform: translateY(-2px);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
    transform: none;
  }
`;

const Score = styled.div`
  margin-top: 2rem;
  font-size: 1.5rem;
  color: #333;
  text-align: center;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 10px;
  background-color: #ddd;
  border-radius: 5px;
  margin: 1rem 0;
  overflow: hidden;
`;

const Progress = styled.div<{ width: number }>`
  width: ${props => props.width}%;
  height: 100%;
  background-color: #4CAF50;
  transition: width 0.3s ease;
`;

const Timer = styled.div<{ timeLeft: number }>`
  font-size: 1.2rem;
  color: ${props => props.timeLeft <= 3 ? '#ff4444' : '#333'};
  text-align: center;
  margin-bottom: 1rem;
  animation: ${props => props.timeLeft <= 3 ? pulse : 'none'} 0.5s infinite;
`;

const BackButton = styled.button`
  position: absolute;
  top: 1rem;
  left: 1rem;
  padding: 0.5rem 1rem;
  background: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0,0,0,0.15);
  }
`;

const CategoryTitle = styled.h2`
  color: #666;
  text-align: center;
  margin-bottom: 1rem;
  font-size: 1.2rem;
`;

const ResultMessage = styled.div<{ isSuccess?: boolean }>`
  color: ${props => props.isSuccess ? '#4CAF50' : '#ff4444'};
  font-size: 1.8rem;
  margin-bottom: 1rem;
  text-align: center;
  animation: ${fadeIn} 0.5s ease;
`;

const LifelineContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const LifelineButton = styled.button<{ used?: boolean }>`
  padding: 0.5rem 1rem;
  border: 2px solid ${props => props.used ? '#ccc' : '#4CAF50'};
  border-radius: 5px;
  background-color: white;
  color: ${props => props.used ? '#ccc' : '#4CAF50'};
  cursor: ${props => props.used ? 'not-allowed' : 'pointer'};
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;

  &:hover:not(:disabled) {
    background-color: #4CAF50;
    color: white;
  }

  &:disabled {
    opacity: 0.5;
  }
`;

const Quiz: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isOptionsDisabled, setIsOptionsDisabled] = useState(false);
  const [timeLeft, setTimeLeft] = useState(8);
  const [gameOver, setGameOver] = useState(false);
  const [usedLifelines, setUsedLifelines] = useState({
    fiftyFifty: false,
    timeExtension: false,
    pass: false
  });
  const [visibleOptions, setVisibleOptions] = useState<string[]>([]);

  // Ses efektleri
  const playSound = (type: 'correct' | 'wrong') => {
    const audio = new Audio(`/${type}.mp3`);
    audio.play().catch(error => console.log('Ses çalma hatası:', error));
  };

  const handleTimeout = useCallback(() => {
    setShowAnswer(true);
    setIsOptionsDisabled(true);
    setGameOver(true);
    
    setTimeout(() => {
      handleNextQuestion();
    }, 1500);
  }, []);

  // Süre sayacı
  useEffect(() => {
    if (!showAnswer && quizQuestions.length > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    }
  }, [currentQuestionIndex, showAnswer, quizQuestions.length, handleTimeout]);

  useEffect(() => {
    const filteredQuestions = questions
      .filter(q => q.category === categoryId)
      .sort(() => Math.random() - 0.5);
    setQuizQuestions(filteredQuestions);
    setGameOver(false);
    setScore(0);
    setCurrentQuestionIndex(0);
    setUsedLifelines({
      fiftyFifty: false,
      timeExtension: false,
      pass: false
    });
  }, [categoryId]);

  useEffect(() => {
    if (quizQuestions.length > 0 && currentQuestionIndex < quizQuestions.length) {
      setVisibleOptions(quizQuestions[currentQuestionIndex].options);
    }
  }, [currentQuestionIndex, quizQuestions]);

  const useFiftyFifty = () => {
    if (usedLifelines.fiftyFifty || showAnswer) return;
    
    const currentQuestion = quizQuestions[currentQuestionIndex];
    const wrongOptions = currentQuestion.options.filter(option => option !== currentQuestion.correctAnswer);
    const randomWrongOption = wrongOptions[Math.floor(Math.random() * wrongOptions.length)];
    
    setVisibleOptions([currentQuestion.correctAnswer, randomWrongOption]);
    setUsedLifelines(prev => ({ ...prev, fiftyFifty: true }));
  };

  const useTimeExtension = () => {
    if (usedLifelines.timeExtension || showAnswer) return;
    
    setTimeLeft(prev => prev + 10);
    setUsedLifelines(prev => ({ ...prev, timeExtension: true }));
  };

  const usePass = () => {
    if (usedLifelines.pass || showAnswer) return;
    
    setUsedLifelines(prev => ({ ...prev, pass: true }));
    handleNextQuestion();
  };

  const handleAnswerSelect = async (answer: string) => {
    if (isOptionsDisabled) return;
    
    setSelectedAnswer(answer);
    setShowAnswer(true);
    setIsOptionsDisabled(true);
    
    const isCorrect = answer === quizQuestions[currentQuestionIndex].correctAnswer;
    if (isCorrect) {
      setScore(prevScore => prevScore + 1);
      playSound('correct');
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      handleNextQuestion();
    } else {
      playSound('wrong');
      setGameOver(true);
    }
  };

  const handleNextQuestion = () => {
    if (gameOver) {
      return;
    }

    setSelectedAnswer(null);
    setShowAnswer(false);
    setIsOptionsDisabled(false);
    setTimeLeft(8);
    setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    setVisibleOptions(quizQuestions[currentQuestionIndex + 1]?.options || []);
  };

  const getCategoryName = (id: string): string => {
    const categories: { [key: string]: string } = {
      'general': 'Genel Kültür',
      'science': 'Bilim & Teknoloji',
      'history': 'Tarih',
      'geography': 'Coğrafya',
      'sports': 'Spor',
      'arts': 'Sanat & Edebiyat'
    };
    return categories[id] || 'Bilinmeyen Kategori';
  };

  if (quizQuestions.length === 0) {
    return (
      <QuizContainer>
        <QuestionText>Yükleniyor...</QuestionText>
      </QuizContainer>
    );
  }

  if (gameOver || currentQuestionIndex >= quizQuestions.length) {
    const isSuccess = !gameOver && currentQuestionIndex >= quizQuestions.length;
    return (
      <QuizContainer>
   
        <QuestionText>Oyun Bitti!</QuestionText>
        <ResultMessage isSuccess={isSuccess}>
          {isSuccess ? '🎉 Tebrikler! Tüm soruları doğru yanıtladınız!' : '❌ Maalesef, yanlış cevap!'}
        </ResultMessage>
        <Score>
          Toplam Puan: {score} / {quizQuestions.length}
          <br />
          Başarı Oranı: {Math.round((score / quizQuestions.length) * 100)}%
        </Score>
      </QuizContainer>
    );
  }

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex) / quizQuestions.length) * 100;

  return (
    <QuizContainer>

      <CategoryTitle>{getCategoryName(categoryId || '')}</CategoryTitle>
      <ProgressBar>
        <Progress width={progress} />
      </ProgressBar>
      <Timer timeLeft={timeLeft}>Kalan Süre: {timeLeft} saniye</Timer>
      <Score>Soru {currentQuestionIndex + 1} / {quizQuestions.length}</Score>
      <QuestionText>{currentQuestion.question}</QuestionText>
      
      <LifelineContainer>
        <LifelineButton
          onClick={useFiftyFifty}
          used={usedLifelines.fiftyFifty}
          disabled={usedLifelines.fiftyFifty || showAnswer}
        >
          🎯 50:50
        </LifelineButton>
        <LifelineButton
          onClick={useTimeExtension}
          used={usedLifelines.timeExtension}
          disabled={usedLifelines.timeExtension || showAnswer}
        >
          ⏱️ +10 Saniye
        </LifelineButton>
        <LifelineButton
          onClick={usePass}
          used={usedLifelines.pass}
          disabled={usedLifelines.pass || showAnswer}
        >
          ➡️ Pas
        </LifelineButton>
      </LifelineContainer>

      <OptionsContainer>
        {visibleOptions.map((option, index) => (
          <OptionButton
            key={index}
            onClick={() => handleAnswerSelect(option)}
            isSelected={selectedAnswer === option}
            isCorrect={showAnswer && option === currentQuestion.correctAnswer}
            isWrong={showAnswer && selectedAnswer === option && option !== currentQuestion.correctAnswer}
            disabled={isOptionsDisabled}
          >
            {option}
          </OptionButton>
        ))}
      </OptionsContainer>
      <Score>Puan: {score}</Score>
    </QuizContainer>
  );
};

export default Quiz; 