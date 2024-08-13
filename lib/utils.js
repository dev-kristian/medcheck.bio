//lib/utils.js
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/firebase/firebaseConfig';

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const resizeImage = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > 2000) {
            height *= 2000 / width;
            width = 2000;
          }
        } else {
          if (height > 2000) {
            width *= 2000 / height;
            height = 2000;
          }
        }

        if (height > 768) {
          width *= 768 / height;
          height = 768;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          resolve(blob);
        }, file.type);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });
};

export const checkOrCreateUserProfile = async (user) => {
  try {
    const idToken = await user.getIdToken();
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`,
      },
      body: JSON.stringify({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      }),
    });
    const data = await response.json();

    if (response.ok) {
      if (data.profileCompleted) {
        return '/';
      } else {
        return '/welcome';
      }
    } else {
      console.error('Error checking or creating user profile:', data.error);
      return '/welcome';
    }
  } catch (error) {
    console.error('Error checking or creating user profile:', error);
    return '/welcome';
  }
};

export const handleGoogleSignIn = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return await checkOrCreateUserProfile(result.user);
  } catch (error) {
    console.error('Error signing in with Google', error);
    throw error;
  }
};