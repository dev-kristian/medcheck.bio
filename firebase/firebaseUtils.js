// src/firebase/firebaseUtils.js

import { db } from './firebaseConfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export async function createUserProfile(user) {
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    const { email, displayName } = user;
    const createdAt = new Date();

    try {
      await setDoc(userRef, {
        email,
        displayName,
        createdAt,
        profileCompleted: false
      });
    } catch (error) {
      console.error("Error creating user profile", error);
    }
  }

  return userRef;
}
