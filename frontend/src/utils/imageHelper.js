export const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    // If it's already a full URL, return it
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }
    
    // For Django media files, prepend the base URL
    if (imagePath.startsWith('/media/')) {
        return `http://127.0.0.1:8000${imagePath}`;
    }
    
    // For files without /media/ prefix
    return `http://127.0.0.1:8000/media/${imagePath}`;
};