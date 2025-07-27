
import { useLocalStorage } from './useLocalStorage';

export const useStorageLimit = () => {
  const [uploadedFiles] = useLocalStorage("uploaded-files", []);
  const STORAGE_LIMIT_GB = 10;
  const STORAGE_LIMIT_BYTES = STORAGE_LIMIT_GB * 1024 * 1024 * 1024; // 10GB in bytes

  const getCurrentStorageUsage = () => {
    return uploadedFiles.reduce((total, file) => {
      return total + (file.size || 0);
    }, 0);
  };

  const getRemainingStorage = () => {
    return STORAGE_LIMIT_BYTES - getCurrentStorageUsage();
  };

  const getStorageUsagePercentage = () => {
    return (getCurrentStorageUsage() / STORAGE_LIMIT_BYTES) * 100;
  };

  const formatStorageSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const canUploadFile = (fileSize) => {
    return fileSize <= getRemainingStorage();
  };

  const getStorageWarningLevel = () => {
    const percentage = getStorageUsagePercentage();
    if (percentage >= 95) return 'critical';
    if (percentage >= 80) return 'warning';
    return 'normal';
  };

  return {
    STORAGE_LIMIT_GB,
    STORAGE_LIMIT_BYTES,
    getCurrentStorageUsage,
    getRemainingStorage,
    getStorageUsagePercentage,
    formatStorageSize,
    canUploadFile,
    getStorageWarningLevel
  };
};
