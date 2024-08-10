//lib/utils.js
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

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
