// (auth)/medical-details/page.jsx

'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/firebase/firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from '@/hooks/useAuth';
import { WithAuth } from '@/components/WithAuth';

function MedicalDetails() {
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    async function checkProfileCompletion() {
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists() && userSnap.data().profileCompleted) {
          router.push('/');
        } else {
          setShowForm(true);
        }
      }
      setLoading(false);
    }

    checkProfileCompletion();
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);
    try {
      await updateDoc(userRef, {
        age,
        gender,
        medicalHistory,
        profileCompleted: true
      });
      router.push('/');
    } catch (error) {
      console.error("Error updating user profile", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!showForm) {
    return null;
  }

  return (
    <div>
      <h1>Complete Your Medical Profile</h1>
      <form onSubmit={handleSubmit}>
        {/* Form fields remain the same */}
        <div>
          <label htmlFor="age">Age</label>
          <input
            type="number"
            id="age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="gender">Gender</label>
          <select
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label htmlFor="medicalHistory">Medical History</label>
          <textarea
            id="medicalHistory"
            value={medicalHistory}
            onChange={(e) => setMedicalHistory(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default WithAuth(MedicalDetails);