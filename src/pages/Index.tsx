
import WellnessCalculatorHub from "@/components/WellnessCalculatorHub";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      <WellnessCalculatorHub />
      
      <div className="max-w-4xl mx-auto p-8 mt-8 bg-white rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold mb-4 text-wellness-purple">Medical Disclaimer</h2>
        <p className="text-gray-600 mb-6">
          In our site, we have included these calculators based on established formulas for your reference. 
          Always consult health care professionals for advice.
        </p>
      </div>
    </div>
  );
};

export default Index;
