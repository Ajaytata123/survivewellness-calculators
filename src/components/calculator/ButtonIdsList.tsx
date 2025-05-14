
import React from 'react';
import { calculators } from '@/data/calculatorData';
import { CalculatorCategory, getCategoryName } from '@/types/calculator';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const ButtonIdsList = () => {
  const categories: CalculatorCategory[] = ["body", "fitness", "nutrition", "wellness", "women"];
  
  const categoryIds: Record<CalculatorCategory, string> = {
    body: "calculator-category-body",
    fitness: "calculator-category-fitness",
    nutrition: "calculator-category-nutrition",
    wellness: "calculator-category-wellness",
    women: "calculator-category-women",
  };
  
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Button IDs and URLs for WordPress Integration</h2>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Category Button IDs</h3>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-2 px-4">Category</th>
                  <th className="text-left py-2 px-4">Desktop Button ID</th>
                  <th className="text-left py-2 px-4">Mobile Button ID</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category} className="border-b border-gray-200 dark:border-gray-700">
                    <td className="py-2 px-4">{getCategoryName(category)}</td>
                    <td className="py-2 px-4 font-mono text-sm">{categoryIds[category]}</td>
                    <td className="py-2 px-4 font-mono text-sm">mobile-category-{category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Individual Calculator Button IDs and URLs</h3>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-2 px-4">Calculator</th>
                  <th className="text-left py-2 px-4">Desktop Button ID</th>
                  <th className="text-left py-2 px-4">Mobile Button ID</th>
                  <th className="text-left py-2 px-4">URL</th>
                </tr>
              </thead>
              <tbody>
                {calculators.map((calculator) => (
                  <tr key={calculator.id} className="border-b border-gray-200 dark:border-gray-700">
                    <td className="py-2 px-4">{calculator.id === 'menstrual' ? 'Period Calculator' : calculator.name}</td>
                    <td className="py-2 px-4 font-mono text-sm">calc-{calculator.id}</td>
                    <td className="py-2 px-4 font-mono text-sm">mobile-calc-{calculator.id}</td>
                    <td className="py-2 px-4 font-mono text-sm">{calculator.url}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ButtonIdsList;
