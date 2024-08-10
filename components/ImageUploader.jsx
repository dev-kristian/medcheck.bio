// components/ImageUploader.jsx
import React from 'react';
import { Upload, X } from 'lucide-react';
import { resizeImage } from "@/lib/utils";

const MAX_IMAGES = 5;

const ImageUploader = ({ images, setImages }) => {
  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    const remainingSlots = MAX_IMAGES - images.length;
    const filesToProcess = files.slice(0, remainingSlots);

    for (const file of filesToProcess) {
      if (file.type.startsWith('image/')) {
        const resizedBlob = await resizeImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setImages(prevImages => [...prevImages, {
            base64: reader.result.split(',')[1],
            preview: reader.result
          }]);
        };
        reader.readAsDataURL(resizedBlob);
      }
    }
  };

  const removeFile = (index) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div>
        <input
          type="file"
          id="file-upload"
          className="hidden"
          onChange={handleFileChange}
          accept="image/*"
          multiple
          disabled={images.length >= MAX_IMAGES}
        />
        <label 
          htmlFor="file-upload" 
          className={`file-upload-label ${images.length >= MAX_IMAGES ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <Upload className="h-6 w-6 mr-2" />
          {images.length > 0 ? `${images.length} image(s) uploaded (Max ${MAX_IMAGES})` : `Upload Images (Required, Max ${MAX_IMAGES})`}
        </label>
      </div>
      {images.length > 0 && (
        <div className="image-preview-container flex flex-row overflow-x-auto gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative flex-shrink-0">
              <img src={image.preview} alt={`Preview ${index + 1}`} className="image-preview w-15 h-15 object-cover" />
              <button 
                onClick={() => removeFile(index)} 
                className="remove-file-button absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;