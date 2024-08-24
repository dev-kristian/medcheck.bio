'use client'
import React from 'react';
import { useProfileContext } from '@/app/context/ProfileContext';
import ModernTabs from '@/components/ModernTabs';
import HeaderBox from '@/components/HeaderBox';
import ProfileTab from '@/components/medicalProfile/ProfileTab';
import ConditionsTab from '@/components/medicalProfile/ConditionsTab';

const MedicalProfile = () => {
  const { profileData, loading } = useProfileContext();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (!profileData) {
    return <div className="text-center text-xl text-gray-600 mt-10">No profile data available.</div>;
  }

  const tabs = [
    { label: 'Profile', content: <ProfileTab profileData={profileData} /> },
    { label: 'Potential Conditions', content: <ConditionsTab potentialConditions={profileData.potentialConditions} /> },
  ];

  return (
    <div className="page">
      <HeaderBox 
        type="title"
        title="Medical Profile"
        subtext="View and manage your health information"
      />
      <div className="mt-2">
        <ModernTabs tabs={tabs} />
      </div>
    </div>
  );
};

export default MedicalProfile;