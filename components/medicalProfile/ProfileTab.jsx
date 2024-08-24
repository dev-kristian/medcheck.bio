import React from 'react';
import { User, Heart, Activity, AlertCircle, Thermometer, TrendingUp, Moon, Utensils, Cigarette, Dumbbell, Wine, Ruler, Weight, Cake, Drop } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const formatCamelCase = (str) => {
  return str.replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

const getBorderColor = (score) => {
  if (score >= 70) return 'border-green-500';
  if (score >= 40) return 'border-yellow-500';
  return 'border-red-500';
};

const HealthScoreCard = ({ healthScore }) => {
  const scoreColor = healthScore.score >= 70 ? "text-green-500" : healthScore.score >= 40 ? "text-yellow-500" : "text-red-500";
  const borderColor = getBorderColor(healthScore.score);

  return (
    <Card className={`shadow-lg rounded-3xl border-l-4 ${borderColor}`}>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-2">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Health Score</h2>
            <div className="flex items-center">
              <span className={`text-5xl font-bold ${scoreColor}`}>{healthScore.score}</span>
              <span className="text-lg font-medium text-gray-600 ml-2">/ 100</span>
            </div>
          </div>
          <div className="mt-2 md:mt-0">
            <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-gray-100 text-gray-800">
              {healthScore.category}
            </span>
          </div>
        </div>

        <p className="text-gray-600 mb-2">{healthScore.description}</p>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Areas for Improvement</h3>
            <ul className="space-y-2">
              {healthScore.recommendations_for_improvement.map((rec, index) => (
                <li key={index} className="flex items-start">
                  <TrendingUp className="w-5 h-5 text-teal-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Factors Influencing Score</h3>
            <div className="flex flex-wrap gap-2">
              {healthScore.factors_influencing_score.map((factor, index) => (
                <span key={index} className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-teal-100 text-teal-800">
                  {factor}
                </span>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const InfoCard = ({ title, children }) => (
    <Card className="h-full shadow-lg rounded-3xl">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="flex items-center text-xl font-semibold text-gray-800">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">{children}</CardContent>
    </Card>
  );
  
  const InfoItem = ({ label, value, icon: Icon, description }) => (
    <div className="flex items-start py-2 border-b border-gray-100 last:border-b-0">
      <Icon className="w-5 h-5 text-teal-500 mr-3 mt-0.5 flex-shrink-0" />
      <div className="flex-grow">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <span className="text-sm font-semibold text-gray-900">{value}</span>
        </div>
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
      </div>
    </div>
  );
  
  const MedicalItem = ({ label, items }) => (
    <div className="py-2 border-b border-gray-100 last:border-b-0">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      {items.length > 0 ? (
        <ul className="mt-1 space-y-1">
          {items.map((item, index) => (
            <li key={index} className="flex items-center text-sm text-gray-600">
              <AlertCircle className="w-4 h-4 text-teal-500 mr-2 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500 mt-1">None reported</p>
      )}
    </div>
  );
  
  const ProfileTab = ({ profileData }) => {
    const { healthScore, profile } = profileData;
  
    const getBMICategory = (bmi) => {
      if (bmi < 18.5) return "Underweight";
      if (bmi < 25) return "Normal weight";
      if (bmi < 30) return "Overweight";
      return "Obese";
    };
  
    const lifestyleDescriptions = {
      dailySleepPattern: "Adequate sleep is crucial for overall health and well-being.",
      dietaryHabits: "A balanced diet contributes to better health outcomes.",
      smokingHabits: "Smoking has significant negative impacts on health.",
      physicalActivity: "Regular exercise is essential for maintaining good health.",
      alcoholConsumption: "Moderate alcohol consumption is recommended for adults who drink."
    };
  
    return (
      <div className="space-y-2 font-sans">
        <HealthScoreCard healthScore={healthScore} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
           <InfoCard title="Personal Information">
             <InfoItem label="Age" value={`${profile.age.years_old} years`} icon={Cake} />
             <InfoItem label="Gender" value={profile.gender} icon={User} />
             <InfoItem label="Height" value={`${profile.height.cm} cm`} icon={Ruler} />
             <InfoItem label="Weight" value={`${profile.weight.kg} kg`} icon={Weight} />
             <InfoItem 
               label="BMI" 
               value={`${profile.bmi.toFixed(2)} (${getBMICategory(profile.bmi)})`} 
               icon={Heart}
               description="Body Mass Index is a measure of body fat based on height and weight."
             />
           </InfoCard>
           
           <InfoCard title="Lifestyle">
             <InfoItem 
               label="Sleep Pattern" 
               value={profile.dailySleepPattern} 
               icon={Moon}
               description={lifestyleDescriptions.dailySleepPattern}
             />
             <InfoItem 
               label="Dietary Habits" 
               value={profile.dietaryHabits} 
               icon={Utensils}
               description={lifestyleDescriptions.dietaryHabits}
             />
             <InfoItem 
               label="Smoking Habits" 
               value={profile.smokingHabits} 
               icon={Cigarette}
               description={lifestyleDescriptions.smokingHabits}
             />
             <InfoItem 
               label="Physical Activity" 
               value={profile.physicalActivity} 
               icon={Dumbbell}
               description={lifestyleDescriptions.physicalActivity}
             />
             <InfoItem 
               label="Alcohol Consumption" 
               value={profile.alcoholConsumption} 
               icon={Wine}
               description={lifestyleDescriptions.alcoholConsumption}
             />
           </InfoCard>
   
           <InfoCard title="Medical Information">
             <MedicalItem 
               label="Allergies" 
               items={profile.allergies.lactose ? ['Lactose'] : []}
             />
             <MedicalItem 
               label="Medical Conditions" 
               items={Object.entries(profile.medicalConditions)
                 .filter(([_, value]) => value)
                 .map(([condition, _]) => formatCamelCase(condition))}
             />
             <MedicalItem 
               label="Surgeries" 
               items={Object.entries(profile.surgeries)
                 .filter(([_, value]) => value)
                 .map(([surgery, _]) => formatCamelCase(surgery))}
             />
             <MedicalItem 
               label="Medications" 
               items={Object.entries(profile.medications)
                 .filter(([_, value]) => value)
                 .map(([medication, _]) => formatCamelCase(medication))}
             />
           </InfoCard>
         </div>
       </div>
     );
   };
   
   export default ProfileTab;

