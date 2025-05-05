
import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CalculatorInfo } from '@/types/calculator';

interface BreadcrumbProps {
  calculatorInfo?: CalculatorInfo;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ calculatorInfo }) => {
  if (!calculatorInfo) return null;
  
  const categoryName = getCategoryName(calculatorInfo.category);
  
  return (
    <div className="breadcrumb" aria-label="Breadcrumb">
      <Link to="/" className="breadcrumb-item flex items-center">
        <Home className="h-3.5 w-3.5 mr-1" />
        <span>Home</span>
      </Link>
      <span className="breadcrumb-separator">
        <ChevronRight className="h-3 w-3" />
      </span>
      <span className="breadcrumb-item">{categoryName}</span>
      <span className="breadcrumb-separator">
        <ChevronRight className="h-3 w-3" />
      </span>
      <span className="breadcrumb-active">{calculatorInfo.name}</span>
    </div>
  );
};

function getCategoryName(category: string): string {
  const categories: Record<string, string> = {
    'body': 'Body Composition',
    'fitness': 'Fitness & Exercise',
    'nutrition': 'Nutrition & Diet',
    'wellness': 'Wellness & Lifestyle',
    'women': "Women's Health"
  };
  
  return categories[category] || category;
}

export default Breadcrumb;
