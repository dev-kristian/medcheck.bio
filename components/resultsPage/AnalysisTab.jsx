import React from 'react';
import InterpretationCard from '@/components/resultsPage/InterpretationCard';
import SpecialtyConsultationCard from '@/components/resultsPage/SpecialtyConsultationCard';
import ClinicalSignificanceCard from '@/components/resultsPage/ClinicalSignificanceCard';

const AnalysisTab = ({ interpretations, clinicalSignificance, specialtyConsultations }) => {
  const renderInterpretations = (interpretations) => {
    return interpretations.map((item, index) => (
      <InterpretationCard key={index} interpretation={item} />
    ));
  };

  const renderClinicalSignificance = (clinicalSignificance) => {
    return clinicalSignificance.map((item, index) => (
      <ClinicalSignificanceCard key={index} significance={item} />
    ));
  };

  const renderSpecialtyConsultations = (specialtyConsultations) => {
    return specialtyConsultations.map((item, index) => (
      <SpecialtyConsultationCard key={index} consultation={item} />
    ));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="col-span-1 md:col-span-2">
        <h4 className="font-semibold mt-2 mb-2 text-lg">Interpretations</h4>
        {interpretations && renderInterpretations(interpretations)}
      </div>
      <div className="col-span-1">
        <h4 className="font-semibold mt-4 mb-2 text-lg">Clinical Significance</h4>
        {clinicalSignificance && renderClinicalSignificance(clinicalSignificance)}
      </div>
      <div className="col-span-1">
        <h4 className="font-semibold mt-4 mb-2 text-lg">Specialty Consultations</h4>
        {specialtyConsultations && renderSpecialtyConsultations(specialtyConsultations)}
      </div>
    </div>
  );
};

export default AnalysisTab;
