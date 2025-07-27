import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { File, FileText, Image, Table, FileSpreadsheet } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Button } from "@/components/ui/button";

export default function RecentFiles() {
  const [uploadedFiles] = useLocalStorage("uploaded-files", []);

  const STORAGE_LIMIT_GB = 10;
  const STORAGE_LIMIT_BYTES = STORAGE_LIMIT_GB * 1024 * 1024 * 1024;

  const getCurrentStorageUsage = () => {
    let totalSize = 0;
    uploadedFiles.forEach(file => {
      totalSize += file.size || 0;
    });
    return totalSize;
  };

  const getStorageUsagePercentage = () => {
    return (getCurrentStorageUsage() / STORAGE_LIMIT_BYTES) * 100;
  };

  const formatStorageSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStorageWarningLevel = () => {
    const percentage = getStorageUsagePercentage();
    if (percentage > 90) {
      return 'critical';
    } else if (percentage > 75) {
      return 'warning';
    } else {
      return 'normal';
    }
  };

  const recentFiles = uploadedFiles.slice(-4).reverse();

  const getFileType = (fileName) => {
    if (!fileName || typeof fileName !== 'string') return 'file';
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt'].includes(ext)) return 'document';
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'bmp', 'webp'].includes(ext)) return 'image';
    if (['xls', 'xlsx', 'csv', 'ods'].includes(ext)) return 'spreadsheet';
    if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'].includes(ext)) return 'video';
    if (['mp3', 'wav', 'flac', 'aac', 'ogg'].includes(ext)) return 'audio';
    return 'file';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type) => {
    switch (type) {
      case "document":
        return <FileText className="h-4 w-4 text-blue-600" />;
      case "image":
        return <Image className="h-4 w-4 text-green-600" />;
      case "spreadsheet":
        return <FileSpreadsheet className="h-4 w-4 text-orange-600" />;
      default:
        return <File className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <File className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Recent Files</h3>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.location.href = '/files'}
            className="text-xs"
          >
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentFiles.length === 0 ? (
            <div className="text-center py-4">
              <File className="h-8 w-8 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">No files uploaded yet</p>
              <p className="text-xs text-gray-400 mt-1">
                <Button 
                  variant="link" 
                  size="sm" 
                  onClick={() => window.location.href = '/files'}
                  className="text-xs p-0 h-auto"
                >
                  Upload your first file
                </Button>
              </p>
            </div>
          ) : (
            recentFiles.map((file, index) => (
              <div key={index} className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50 cursor-pointer">
                {getFileIcon(getFileType(file.name))}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size || 0)} • Just uploaded
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
