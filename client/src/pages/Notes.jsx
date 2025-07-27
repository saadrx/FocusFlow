
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { Plus, Search, Folder, Star, Clock, Trash, PenTool, MoreVertical, Calendar, Paperclip, Image, Save, FolderPlus, 
  ArrowUp, Home, Check, X, Bold, Italic, Underline, Type, Palette, Link, Tag, File, FileText, FileSpreadsheet } from "lucide-react";

export default function Notes() {
  const [notes, setNotes] = useLocalStorage("focusflow-notes");
  const [folders, setFolders] = useLocalStorage("notes-folders", []);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [activeNoteId, setActiveNoteId] = useState("1");
  const [activeTab, setActiveTab] = useState("all");
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [textFormat, setTextFormat] = useState({
    fontSize: "14",
    fontFamily: "Arial",
    bold: false,
    italic: false,
    underline: false
  });
  const [attachedFiles, setAttachedFiles] = useLocalStorage("note-file-attachments", []);
  const [taggedEvents, setTaggedEvents] = useLocalStorage("note-event-tags", []);
  const [availableFiles] = useLocalStorage("uploaded-files", []);
  const [availableEvents] = useLocalStorage("focusflow-calendar-events", []);
  const [showFileAttacher, setShowFileAttacher] = useState(false);
  const [showEventTagger, setShowEventTagger] = useState(false);

  const createFolder = () => {
    if (newFolderName.trim()) {
      const newFolder = {
        id: Date.now() + Math.random(),
        name: newFolderName.trim(),
        createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        parentId: currentFolder?.id || null,
      };
      setFolders([...folders, newFolder]);
      setNewFolderName("");
      setShowCreateFolder(false);
    }
  };

  const deleteFolder = (folderId) => {
    const folderToDelete = folders.find((f) => f.id === folderId);
    if (folderToDelete) {
      setNotes(
        notes.map((note) =>
          note.folderId === folderId
            ? { ...note, folderId: folderToDelete.parentId }
            : note,
        ),
      );
      setFolders(folders.filter((f) => f.id !== folderId));
    }
  };

  const currentFolderNotes = notes.filter(
    (note) => note.folderId === (currentFolder?.id || null),
  );
  const currentSubFolders = folders.filter(
    (folder) => folder.parentId === (currentFolder?.id || null),
  );

  const filteredNotes = currentFolderNotes.filter(note => {
    if (!searchText.trim()) {
      // No search text - apply tab filters only
      if (activeTab === "all") return true;
      if (activeTab === "favorites") return note.isFavorite;
      if (activeTab === "recent") return true;
      return true;
    }

    const searchLower = searchText.toLowerCase();
    
    // Search in note title and content
    const matchesTitle = note.title.toLowerCase().includes(searchLower);
    const matchesContent = note.content.toLowerCase().includes(searchLower);
    
    // Search in attached files
    const noteAttachments = getNoteAttachments(note.id);
    const matchesAttachments = noteAttachments.some(attachment => 
      attachment.file && attachment.file.name.toLowerCase().includes(searchLower)
    );
    
    // Search in tagged events
    const noteEventTags = getNoteEventTags(note.id);
    const matchesEvents = noteEventTags.some(tag => 
      tag.event && tag.event.title && tag.event.title.toLowerCase().includes(searchLower)
    );
    
    const matchesSearch = matchesTitle || matchesContent || matchesAttachments || matchesEvents;
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "favorites") return matchesSearch && note.isFavorite;
    if (activeTab === "recent") return matchesSearch;
    
    return matchesSearch;
  });

  const filteredFolders = currentSubFolders.filter(
    (folder) =>
      folder.name && folder.name.toLowerCase().includes(searchText.toLowerCase()),
  );

  const activeNote = activeNoteId ? notes.find(note => note.id === activeNoteId) : null;

  const handleNewNote = () => {
    const newNote = {
      id: Date.now().toString(),
      title: "Untitled Note",
      content: "",
      createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      updatedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      isFavorite: false,
      folderId: currentFolder?.id || null,
    };
    
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
  };

  const handleUpdateNote = (id, data) => {
    setNotes(notes.map(note => 
      note.id === id 
        ? { 
            ...note, 
            ...data, 
            updatedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) 
          } 
        : note
    ));
  };

  const toggleFavorite = (id) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, isFavorite: !note.isFavorite } : note
    ));
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
    if (activeNoteId === id) {
      setActiveNoteId(notes.length > 1 ? notes.find(n => n.id !== id)?.id || null : null);
    }
  };

  const toggleFormat = (formatType) => {
    setTextFormat(prev => ({
      ...prev,
      [formatType]: !prev[formatType]
    }));
  };

  const handleFontChange = (property, value) => {
    setTextFormat(prev => ({
      ...prev,
      [property]: value
    }));
  };

  const getTextStyle = () => ({
    fontSize: `${textFormat.fontSize}px`,
    fontFamily: textFormat.fontFamily,
    fontWeight: textFormat.bold ? 'bold' : 'normal',
    fontStyle: textFormat.italic ? 'italic' : 'normal',
    textDecoration: textFormat.underline ? 'underline' : 'none'
  });

  const attachFileToNote = (fileId) => {
    const attachment = {
      id: Date.now().toString(),
      noteId: activeNoteId,
      fileId: fileId,
      attachedAt: new Date().toISOString()
    };
    setAttachedFiles([...attachedFiles, attachment]);
    setShowFileAttacher(false);
  };

  const tagEventToNote = (eventId) => {
    const tag = {
      id: Date.now().toString(),
      noteId: activeNoteId,
      eventId: eventId,
      taggedAt: new Date().toISOString()
    };
    setTaggedEvents([...taggedEvents, tag]);
    setShowEventTagger(false);
  };

  const removeFileAttachment = (attachmentId) => {
    setAttachedFiles(attachedFiles.filter(a => a.id !== attachmentId));
  };

  const removeEventTag = (tagId) => {
    setTaggedEvents(taggedEvents.filter(t => t.id !== tagId));
  };

  const getNoteAttachments = (noteId) => {
    return attachedFiles.filter(a => a.noteId === noteId).map(attachment => {
      const file = availableFiles.find(f => f.id === attachment.fileId);
      return { ...attachment, file };
    }).filter(a => a.file && a.file.name && a.file.name.trim() !== ''); // Only show attachments where the file exists and has a valid name
  };

  const getNoteEventTags = (noteId) => {
    const calendarEvents = JSON.parse(localStorage.getItem("focusflow-calendar-events") || "[]");
    return taggedEvents.filter(t => t.noteId === noteId).map(tag => {
      const event = calendarEvents.find(e => e.id === tag.eventId);
      return { ...tag, event };
    }).filter(t => t.event); // Only show tags where the event still exists
  };

  const formatEventDate = (event) => {
    if (!event) return "Invalid Date";
    
    // Handle different date formats
    let dateString = event.start || event.date;
    if (!dateString) return "Invalid Date";
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        // Try parsing as YYYY-MM-DD format
        const dateParts = dateString.split('-');
        if (dateParts.length === 3) {
          const parsedDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
          return parsedDate.toLocaleDateString();
        }
        return "Invalid Date";
      }
      return date.toLocaleDateString();
    } catch (error) {
      return "Invalid Date";
    }
  };

  const getFileIcon = (fileName) => {
    const ext = fileName?.split('.').pop()?.toLowerCase();
    if (['pdf', 'doc', 'docx', 'txt'].includes(ext)) return FileText;
    if (['xls', 'xlsx', 'csv'].includes(ext)) return FileSpreadsheet;
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return Image;
    return File;
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Notes</h1>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          <div className="flex flex-col md:flex-row h-[calc(100vh-12rem)] gap-6">
            {/* Sidebar */}
            <div className="w-full md:w-80 flex flex-col">
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
                      onClick={() => {
                        const parentFolder = currentFolder.parentId 
                          ? folders.find((f) => f.id === currentFolder.parentId) 
                          : null;
                        setCurrentFolder(parentFolder);
                      }}
                      className="h-8 ml-auto"
                    >
                      <ArrowUp className="h-3 w-3 mr-1" />
                      Up
                    </Button>
                  </>
                )}
              </div>

              {/* Search and New Note Button */}
              <div className="flex gap-2 mb-4">
                <div className="relative flex-grow">
                  <Input
                    type="text"
                    placeholder="Search notes and folders..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="pl-10 pr-4 py-2"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCreateFolder(true)}
                  className="flex items-center gap-2"
                >
                  <FolderPlus className="h-4 w-4" />
                </Button>
                <Button onClick={handleNewNote} className="bg-primary-500 hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700">
                  <Plus className="h-5 w-5" />
                  <span className="hidden sm:inline ml-1">New Note</span>
                </Button>
              </div>

              {/* Floating Action Button for Mobile */}
              <Button
                onClick={handleNewNote}
                className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 bg-primary-500 hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700 sm:hidden"
                size="icon"
              >
                <Plus className="h-6 w-6" />
              </Button>

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
              
              {/* Categories */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-grow flex flex-col">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="favorites">Favorites</TabsTrigger>
                  <TabsTrigger value="recent">Recent</TabsTrigger>
                </TabsList>
                
                {/* Notes and Folders List */}
                <div className="flex-grow overflow-y-auto border rounded-md">
                  {filteredFolders.length === 0 && filteredNotes.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                      {currentFolder ? "This folder is empty" : "No notes found"}
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                      {/* Folders */}
                      {filteredFolders.map((folder) => (
                        <div
                          key={folder.id}
                          className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 group border-b border-gray-100 dark:border-gray-700"
                          onClick={() => setCurrentFolder(folder)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center flex-grow">
                              <Folder className="h-4 w-4 text-yellow-600 mr-2 flex-shrink-0" />
                              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                {folder.name}
                              </h3>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0 text-destructive hover:text-destructive flex-shrink-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (confirm(`Are you sure you want to delete the folder "${folder.name}"? Notes inside will be moved to the parent folder.`)) {
                                  deleteFolder(folder.id);
                                }
                              }}
                            >
                              <Trash className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            Folder • Created {folder.createdAt}
                          </div>
                        </div>
                      ))}

                      {/* Notes */}
                      {filteredNotes.map((note) => (
                        <div 
                          key={note.id} 
                          className={`p-4 cursor-pointer group ${activeNoteId === note.id ? 'bg-primary-50 dark:bg-primary-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}
                          onClick={() => setActiveNoteId(note.id)}
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2 flex-grow">
                              {note.isWhiteboard && <Palette className="h-3 w-3 text-purple-500" />}
                              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{note.title}</h3>
                            </div>
                            <div className="flex items-center gap-1">
                              {note.isFavorite && <Star className="h-4 w-4 text-yellow-400" fill="currentColor" />}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0 text-destructive hover:text-destructive"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNote(note.id);
                                }}
                              >
                                <Trash className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 truncate">
                            {note.isWhiteboard ? "Whiteboard drawing" : note.content}
                          </p>
                          <div className="mt-2 flex justify-between items-center">
                            <span className="text-xs text-gray-500 dark:text-gray-400">{note.updatedAt}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Tabs>
            </div>
            
            {/* Note Editor */}
            {activeNote ? (
              <div className="flex-grow">
                <Card className="h-full flex flex-col">
                  <CardContent className="p-4 flex-grow flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                      <Input 
                        value={activeNote.title} 
                        onChange={(e) => handleUpdateNote(activeNote.id, { title: e.target.value })} 
                        className="text-xl font-semibold border-0 px-0 focus-visible:ring-0"
                        placeholder="Note Title"
                      />
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => toggleFavorite(activeNote.id)}
                          className={activeNote.isFavorite ? "text-yellow-400" : "text-gray-400"}
                        >
                          <Star className="h-5 w-5" fill={activeNote.isFavorite ? "currentColor" : "none"} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => deleteNote(activeNote.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash className="h-5 w-5" />
                        </Button>
                        
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                      Last updated on {activeNote.updatedAt}
                    </div>

                    {/* Formatting Toolbar */}
                    <div className="flex items-center gap-2 p-2 border-b mb-4">
                      <div className="flex items-center gap-1">
                        <Type className="h-4 w-4 text-gray-500" />
                        <select
                          value={textFormat.fontFamily}
                          onChange={(e) => handleFontChange('fontFamily', e.target.value)}
                          className="text-sm border rounded px-2 py-1"
                        >
                          <option value="Inter">Inter</option>
                          <option value="Arial">Arial</option>
                          <option value="Georgia">Georgia</option>
                          <option value="Times New Roman">Times New Roman</option>
                          <option value="Courier New">Courier New</option>
                          <option value="Helvetica">Helvetica</option>
                        </select>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <select
                          value={textFormat.fontSize}
                          onChange={(e) => handleFontChange('fontSize', e.target.value)}
                          className="text-sm border rounded px-2 py-1 w-16"
                        >
                          <option value="10">10px</option>
                          <option value="12">12px</option>
                          <option value="14">14px</option>
                          <option value="16">16px</option>
                          <option value="18">18px</option>
                          <option value="20">20px</option>
                          <option value="24">24px</option>
                          <option value="28">28px</option>
                          <option value="32">32px</option>
                        </select>
                      </div>

                      <div className="h-4 w-px bg-gray-300 mx-1"></div>

                      <div className="flex gap-1">
                        <Button
                          variant={textFormat.bold ? "default" : "ghost"}
                          size="sm"
                          onClick={() => toggleFormat('bold')}
                          className="h-8 w-8 p-0"
                        >
                          <Bold className="h-4 w-4" />
                        </Button>
                        <Button
                          variant={textFormat.italic ? "default" : "ghost"}
                          size="sm"
                          onClick={() => toggleFormat('italic')}
                          className="h-8 w-8 p-0"
                        >
                          <Italic className="h-4 w-4" />
                        </Button>
                        <Button
                          variant={textFormat.underline ? "default" : "ghost"}
                          size="sm"
                          onClick={() => toggleFormat('underline')}
                          className="h-8 w-8 p-0"
                        >
                          <Underline className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {activeNote.isWhiteboard && activeNote.whiteboardData ? (
                      <div className="mb-4">
                        <img 
                          src={activeNote.whiteboardData} 
                          alt="Whiteboard drawing"
                          className="max-w-full border rounded"
                        />
                      </div>
                    ) : null}

                    {/* File Attachments */}
                    {getNoteAttachments(activeNote.id).length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Attached Files</h4>
                        <div className="space-y-2">
                          {getNoteAttachments(activeNote.id).map((attachment) => {
                            const IconComponent = getFileIcon(attachment.file.name);
                            return (
                              <div key={attachment.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded border">
                                <div className="flex items-center space-x-2">
                                  <IconComponent className="h-4 w-4 text-blue-500" />
                                  <span className="text-sm">{attachment.file.name}</span>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeFileAttachment(attachment.id)}
                                  className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Event Tags */}
                    {getNoteEventTags(activeNote.id).length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tagged Events</h4>
                        <div className="space-y-2">
                          {getNoteEventTags(activeNote.id).map((tag) => (
                            <div key={tag.id} className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded border">
                              <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4 text-blue-500" />
                                <span className="text-sm">{tag.event.title}</span>
                                <span className="text-xs text-gray-500">
                                  {formatEventDate(tag.event)}
                                </span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeEventTag(tag.id)}
                                className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <Textarea 
                      value={activeNote.content} 
                      onChange={(e) => handleUpdateNote(activeNote.id, { content: e.target.value })} 
                      className="flex-grow resize-none border-0 focus-visible:ring-0 p-0"
                      placeholder="Start writing your note here..."
                      style={getTextStyle()}
                    />
                  </CardContent>
                  
                  <div className="border-t px-4 py-3 flex justify-between">
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setShowFileAttacher(true)}
                        title="Attach file"
                      >
                        <Paperclip className="h-5 w-5 text-gray-500" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setShowEventTagger(true)}
                        title="Tag event"
                      >
                        <Tag className="h-5 w-5 text-gray-500" />
                      </Button>
                    </div>
                    <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                  </div>

                  {/* File Attachment Modal */}
                  {showFileAttacher && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 max-h-96 overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-semibold">Attach File</h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowFileAttacher(false)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {availableFiles.filter(file => file.name && file.name.trim() !== '').length === 0 ? (
                            <p className="text-gray-500 text-center py-4">No files available</p>
                          ) : (
                            availableFiles
                              .filter(file => file.name && file.name.trim() !== '')
                              .map((file) => {
                                const IconComponent = getFileIcon(file.name);
                                return (
                                  <div
                                    key={file.id}
                                    className="flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
                                    onClick={() => attachFileToNote(file.id)}
                                  >
                                    <IconComponent className="h-4 w-4 text-blue-500" />
                                    <span className="text-sm flex-1 truncate">{file.name}</span>
                                  </div>
                                );
                              })
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Event Tagging Modal */}
                  {showEventTagger && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 max-h-96 overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-semibold">Tag Event</h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowEventTagger(false)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {availableEvents.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">No events available</p>
                          ) : (
                            availableEvents.map((event) => (
                              <div
                                key={event.id}
                                className="flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
                                onClick={() => tagEventToNote(event.id)}
                              >
                                <Calendar className="h-4 w-4 text-blue-500" />
                                <div className="flex-1">
                                  <span className="text-sm font-medium">{event.title}</span>
                                  <div className="text-xs text-gray-500">
                                    {formatEventDate(event)}
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              </div>
            ) : (
              <div className="flex-grow flex items-center justify-center bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="text-center">
                  <PenTool className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No note selected</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Select a note from the list or create a new one.</p>
                  <div className="mt-6">
                    <Button onClick={handleNewNote}>
                      <Plus className="h-4 w-4 mr-2" />
                      New Note
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
