import { useState } from 'react'
import { uploadService } from '../api/upload.service';

export const useFileUpload = () => {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState(null);
    
    const upload = async (fileOrUrl) => {
        setUploadError(null);

        // Case 1: Empty
        if (!fileOrUrl) return "";

        // Case 2: Already a URL (User didn't change the image)
        if (typeof fileOrUrl === 'string') {
        return fileOrUrl;
        }

        // Case 3: It is a File (User picked a new image)
        if (fileOrUrl instanceof File) {
        setIsUploading(true);
        try {
            const url = await uploadService.uploadImage(fileOrUrl);
            setIsUploading(false);
            return url;
        } catch (err) {
            console.error("Upload failed", err);
            setUploadError("Failed to upload image.");
            setIsUploading(false);
            throw err; // Re-throw so the form knows to stop
        }
        }

        return "";
    };

    return { upload, isUploading, uploadError };
}