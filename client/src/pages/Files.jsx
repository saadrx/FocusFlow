import React, { useRef, useState } from "react";
import {
  ArrowLeft,
  Home,
  Trash2,
  Upload,
  Search,
  Star,
  Share2,
  Download,
  MoreVertical,
  FileText,
  Image,
  File,
  FileSpreadsheet,
  Folder,
  FolderPlus,
  ArrowUp,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useStorageLimit } from "../hooks/useStorageLimit";

export default function Files() {
  const [files, setFiles] = useLocalStorage("uploaded-files", []);
  const [folders, setFolders] = useLocalStorage("file-folders", []);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [search, setSearch] = useState("");
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const fileInputRef = useRef();

  const {
    getCurrentStorageUsage,
    getRemainingStorage,
    getStorageUsagePercentage,
    formatStorageSize,
    canUploadFile,
    getStorageWarningLevel,
    STORAGE_LIMIT_GB
  } = useStorageLimit();

  const getFileType = (fileName) => {
    if (!fileName || typeof fileName !== "string") return "file";
    const ext = fileName.split(".").pop()?.toLowerCase();
    if (["pdf", "doc", "docx", "txt", "rtf", "odt"].includes(ext))
      return "document";
    if (["jpg", "jpeg", "png", "gif", "svg", "bmp", "webp"].includes(ext))
      return "image";
    if (["xls", "xlsx", "csv", "ods"].includes(ext)) return "spreadsheet";
    if (["mp4", "avi", "mov", "wmv", "flv", "webm"].includes(ext))
      return "video";
    if (["mp3", "wav", "flac", "aac", "ogg"].includes(ext)) return "audio";
    return "file";
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleFileUpload = (e) => {
    const newFiles = Array.from(e.target.files).map((file) => {

      if (!canUploadFile(file.size)) {
        alert(`Upload failed: Not enough storage space. You need ${formatStorageSize(file.size)} but only have ${formatStorageSize(getRemainingStorage())} remaining of your ${STORAGE_LIMIT_GB}GB limit.`);
        return null;
      }
      return {
        id: Date.now() + Math.random(),
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        uploadedAt: new Date().toISOString(),
        folderId: currentFolder?.id || null,
        file: file, // Keep reference to original file for download
      }
    }).filter(file => file !== null);

    setFiles([...files, ...newFiles]);

        // Show warning if approaching limit
        const warningLevel = getStorageWarningLevel();
        if (warningLevel === 'warning') {
          alert(`Warning: You're using ${getStorageUsagePercentage().toFixed(1)}% of your ${STORAGE_LIMIT_GB}GB storage limit.`);
        } else if (warningLevel === 'critical') {
          alert(`Critical: You're using ${getStorageUsagePercentage().toFixed(1)}% of your ${STORAGE_LIMIT_GB}GB storage limit. Consider deleting some files.`);
        }

  };

  const handleDelete = (fileId) => {
    setFiles(files.filter((file) => file.id !== fileId));
  };

  const createFolder = () => {
    if (newFolderName.trim()) {
      const newFolder = {
        id: Date.now() + Math.random(),
        name: newFolderName.trim(),
        createdAt: new Date().toISOString(),
        parentId: currentFolder?.id || null,
      };
      setFolders([...folders, newFolder]);
      setNewFolderName("");
      setShowCreateFolder(false);
    }
  };

  const deleteFolder = (folderId) => {
    // Delete folder and move files to parent folder
    const folderToDelete = folders.find((f) => f.id === folderId);
    if (folderToDelete) {
      setFiles(
        files.map((file) =>
          file.folderId === folderId
            ? { ...file, folderId: folderToDelete.parentId }
            : file,
        ),
      );
      setFolders(folders.filter((f) => f.id !== folderId));
    }
  };

  const currentFolderFiles = files.filter(
    (file) => file.folderId === (currentFolder?.id || null),
  );
  const currentSubFolders = folders.filter(
    (folder) => folder.parentId === (currentFolder?.id || null),
  );

  const filteredFiles = currentFolderFiles.filter(
    (file) =>
      file.name && file.name.toLowerCase().includes(search.toLowerCase()),
  );

  const filteredFolders = currentSubFolders.filter(
    (folder) =>
      folder.name && folder.name.toLowerCase().includes(search.toLowerCase()),
  );

  const getFileIcon = (type) => {
    switch (type) {
      case "document":
        return (
          <div className="flex-shrink-0 h-12 w-12 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center">
            <FileText className="h-6 w-6" />
          </div>
        );
      case "image":
        return (
          <div className="flex-shrink-0 h-12 w-12 bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 rounded-lg flex items-center justify-center">
            <Image className="h-6 w-6" />
          </div>
        );
      case "spreadsheet":
        return (
          <div className="flex-shrink-0 h-12 w-12 bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400 rounded-lg flex items-center justify-center">
            <FileSpreadsheet className="h-6 w-6" />
          </div>
        );
      case "video":
        return (
          <div className="flex-shrink-0 h-12 w-12 bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 rounded-lg flex items-center justify-center">
            <File className="h-6 w-6" />
          </div>
        );
      case "audio":
        return (
          <div className="flex-shrink-0 h-12 w-12 bg-pink-100 dark:bg-pink-900/50 text-pink-600 dark:text-pink-400 rounded-lg flex items-center justify-center">
            <File className="h-6 w-6" />
          </div>
        );
      default:
        return (
          <div className="flex-shrink-0 h-12 w-12 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg flex items-center justify-center">
            <File className="h-6 w-6" />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6">
        {/* Navigation */}
        <nav className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.history.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => (window.location.href = "/")}
          >
            <Home className="h-4 w-4" />
            Home
          </Button>
        </nav>

        {/* Main Content */}
        <Card className="backdrop-blur-sm bg-card/95 border shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Folder className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">
                File & Document Manager
              </h1>
              <div className="flex items-center gap-2 mt-1">
                    <div className={`w-32 h-2 rounded-full ${getStorageWarningLevel() === 'critical' ? 'bg-red-200' : getStorageWarningLevel() === 'warning' ? 'bg-yellow-200' : 'bg-gray-200'}`}>
                      <div 
                        className={`h-2 rounded-full transition-all ${getStorageWarningLevel() === 'critical' ? 'bg-red-500' : getStorageWarningLevel() === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'}`}
                        style={{ width: `${Math.min(getStorageUsagePercentage(), 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatStorageSize(getCurrentStorageUsage())} / {STORAGE_LIMIT_GB}GB
                    </span>
                  </div>
            </div>

            {/* Upload Area */}
            <div
              className="border-2 border-dashed border-border hover:border-primary/50 rounded-lg p-8 text-center cursor-pointer transition-colors duration-200 hover:bg-muted/50"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex flex-col items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="text-lg font-medium text-foreground">
                    Drop files here or click to upload
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Supports PDF, DOC, DOCX, TXT, JPG, PNG, and more
                  </p>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.svg,.xls,.xlsx,.csv,.mp4,.avi,.mov,.mp3,.wav"
              />
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 mb-4 p-3 bg-muted/20 rounded-lg">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentFolder(null)}
                className="h-8 text-xs"
              >
                <Home className="h-3 w-3 mr-1" />
                Home
              </Button>
              {currentFolder && (
                <>
                  <span className="text-muted-foreground">/</span>
                  <span className="text-sm font-medium">
                    {currentFolder.name}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setCurrentFolder(
                        folders.find((f) => f.id === currentFolder.parentId) ||
                          null,
                      )
                    }
                    className="h-8 ml-auto"
                  >
                    <ArrowUp className="h-3 w-3 mr-1" />
                    Up
                  </Button>
                </>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3 mb-6">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search files and folders..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Create Folder Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCreateFolder(true)}
                className="flex items-center gap-2"
              >
                <FolderPlus className="h-4 w-4" />
                New Folder
              </Button>
            </div>

            {/* Create Folder Input */}
            {showCreateFolder && (
              <div className="flex items-center gap-2 mb-4 p-3 bg-muted/30 rounded-lg border">
                <Folder className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Folder name"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && createFolder()}
                  className="flex-1"
                  autoFocus
                />
                <Button size="sm" onClick={createFolder}>
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setShowCreateFolder(false);
                    setNewFolderName("");
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Files and Folders List */}
            <div className="space-y-3">
              {filteredFolders.length === 0 && filteredFiles.length === 0 ? (
                <div className="text-center py-12">
                  <div className="p-4 bg-muted/50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <File className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground mb-2">
                    {currentFolder
                      ? "This folder is empty"
                      : "No files uploaded yet"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {currentFolder
                      ? "Upload files or create folders here"
                      : "Upload your first file using the area above"}
                  </p>
                </div>
              ) : (
                <>
                  {/* Folders */}
                  {filteredFolders.map((folder) => (
                    <div
                      key={folder.id}
                      className="flex items-center p-4 bg-muted/20 hover:bg-muted/40 rounded-lg border transition-colors duration-200 group cursor-pointer"
                      onClick={() => setCurrentFolder(folder)}
                    >
                      <div className="flex-shrink-0 h-12 w-12 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-400 rounded-lg flex items-center justify-center">
                        <Folder className="h-6 w-6" />
                      </div>

                      <div className="ml-4 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-medium text-foreground truncate">
                            {folder.name}
                          </h3>
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <span>
                            Folder • Created{" "}
                            {new Date(folder.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteFolder(folder.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {/* Files */}
                  {filteredFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center p-4 bg-muted/30 hover:bg-muted/50 rounded-lg border transition-colors duration-200 group"
                    >
                      {getFileIcon(getFileType(file.name))}

                      <div className="ml-4 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-medium text-foreground truncate">
                            {file.name}
                          </h3>
                          <Star className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:text-yellow-500" />
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground mt-1 gap-2">
                          <span>{formatFileSize(file.size)}</span>
                          <span>•</span>
                          <span>
                            Uploaded{" "}
                            {file.uploadedAt
                              ? new Date(file.uploadedAt).toLocaleDateString()
                              : "Recently"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(file.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>

            {/* Statistics */}
            {(filteredFiles.length > 0 || filteredFolders.length > 0) && (
              <div className="mt-6 p-4 bg-muted/30 rounded-lg border">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <span className="text-muted-foreground">
                      {filteredFolders.length} folder
                      {filteredFolders.length !== 1 ? "s" : ""}
                    </span>
                    <span className="text-muted-foreground">
                      {filteredFiles.length} file
                      {filteredFiles.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <span className="text-muted-foreground">
                    Total size:{" "}
                    {formatFileSize(
                      filteredFiles.reduce(
                        (total, file) => total + (file.size || 0),
                        0,
                      ),
                    )}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
