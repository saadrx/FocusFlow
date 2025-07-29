import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Image, Video, Music, File, Upload, Eye } from "lucide-react";
import { useApi } from "@/hooks/useApi";
import { useState, useEffect } from 'react';

export default function RecentFiles() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: apiFiles, apiLoading, apiError } = useApi('/api/files');

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setLoading(true);
        if (apiFiles) {
          setFiles(apiFiles);
        }
      } catch (err) {
        setError('Error loading files');
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [apiFiles]);

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return Image;
    if (type.startsWith('video/')) return Video;
    if (type.startsWith('audio/')) return Music;
    if (type.includes('text') || type.includes('document') || type.includes('pdf')) return FileText;
    return File;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const recentFiles = files ? files.slice(0, 5) : [];

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <h3 className="text-lg font-semibold">Recent Files</h3>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500">Loading files...</div>
        </CardContent>
      </Card>
    );
  }

  if (error || apiError) {
    return (
      <Card className="h-full">
        <CardHeader>
          <h3 className="text-lg font-semibold">Recent Files</h3>
        </CardHeader>
        <CardContent>
          <div className="text-center text-red-500">Error loading files</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="text-lg font-semibold">Recent Files</h3>
        <Button size="sm" variant="outline">
          <Upload className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {recentFiles.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            <Upload className="mx-auto h-8 w-8 mb-2" />
            <p className="text-sm">No files uploaded yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentFiles.map((file) => {
              const IconComponent = getFileIcon(file.type || file.mime_type);
              return (
                <div key={file.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md group">
                  <IconComponent className="h-6 w-6 text-blue-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span>{formatFileSize(file.size || file.file_size)}</span>
                      <span>•</span>
                      <span>{formatDate(file.created_at)}</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}