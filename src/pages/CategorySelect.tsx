import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

interface Category {
  id: string;
  name: string;
  icon: string;
  totalQuestions: number;
  highScore: number;
  color: string;
}

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const PageContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
  font-size: 2.5rem;
`;

const CategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  padding: 1rem;
`;

const CategoryCard = styled.div<{ bgColor: string }>`
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  animation: ${fadeIn} 0.5s ease;
  border-left: 5px solid ${props => props.bgColor};

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
  }
`;

const CategoryIcon = styled.div<{ bgColor: string }>`
  width: 60px;
  height: 60px;
  background-color: ${props => props.bgColor + '20'};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  font-size: 2rem;
`;

const CategoryName = styled.h2`
  color: #333;
  margin: 0.5rem 0;
  font-size: 1.5rem;
`;

const CategoryStats = styled.div`
  color: #666;
  font-size: 0.9rem;
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
`;

const CategorySelect: React.FC = () => {
  const navigate = useNavigate();

  const categories: Category[] = [
    {
      id: 'general',
      name: 'Genel Kültür',
      icon: '🎯',
      totalQuestions: 50,
      highScore: 0,
      color: '#4CAF50'
    },
    {
      id: 'science',
      name: 'Bilim & Teknoloji',
      icon: '🔬',
      totalQuestions: 40,
      highScore: 0,
      color: '#2196F3'
    },
    {
      id: 'history',
      name: 'Tarih',
      icon: '⌛',
      totalQuestions: 45,
      highScore: 0,
      color: '#FFC107'
    },
    {
      id: 'geography',
      name: 'Coğrafya',
      icon: '🌍',
      totalQuestions: 35,
      highScore: 0,
      color: '#9C27B0'
    },
    {
      id: 'sports',
      name: 'Spor',
      icon: '⚽',
      totalQuestions: 30,
      highScore: 0,
      color: '#F44336'
    },
    {
      id: 'arts',
      name: 'Sanat & Edebiyat',
      icon: '🎨',
      totalQuestions: 40,
      highScore: 0,
      color: '#FF9800'
    }
  ];

  const handleCategorySelect = (categoryId: string) => {
    navigate(`/quiz/${categoryId}`);
  };

  return (
    <PageContainer>
      <Title>Kategori Seçin</Title>
      <CategoriesGrid>
        {categories.map(category => (
          <CategoryCard
            key={category.id}
            bgColor={category.color}
            onClick={() => handleCategorySelect(category.id)}
          >
            <CategoryIcon bgColor={category.color}>
              {category.icon}
            </CategoryIcon>
            <CategoryName>{category.name}</CategoryName>
            <CategoryStats>
              <span>Toplam Soru: {category.totalQuestions}</span>
              <span>En Yüksek Puan: {category.highScore}</span>
            </CategoryStats>
          </CategoryCard>
        ))}
      </CategoriesGrid>
    </PageContainer>
  );
};

export default CategorySelect; 