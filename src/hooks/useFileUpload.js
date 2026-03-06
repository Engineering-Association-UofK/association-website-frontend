import { useState } from 'react'
import { uploadService } from '../api/upload.service';

export const useFileUpload = () => {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState(null);
    
    const upload = async (fileOrImage) => {
        setUploadError(null);

        // Case 1: Empty
        if (!fileOrImage) return null;

        // Case 2: Already an image object
        if (typeof fileOrImage === 'object' && !(fileOrImage instanceof File)) {
            const url = fileOrImage?.url;
            const publicId = fileOrImage?.publicId;
            if (typeof url === 'string' && typeof publicId === 'string') {
                return { url, publicId };
            }
            return null;
        }

        // Case 3: It is a File (User picked a new image)
        if (fileOrImage instanceof File) {
        setIsUploading(true);
        try {
            const { secureUrl, publicId } = await uploadService.uploadImage(fileOrImage);
            setIsUploading(false);
            return { url: secureUrl, publicId };
        } catch (err) {
            console.error("Upload failed", err);
            setUploadError("Failed to upload image.");
            setIsUploading(false);
            throw err; // Re-throw so the form knows to stop
        }
        }

        return null;
    };

    return { upload, isUploading, uploadError };
}