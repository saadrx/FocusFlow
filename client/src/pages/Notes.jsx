
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { Plus, Search, Folder, Star, Clock, Trash, PenTool, MoreVertical, Calendar, Paperclip, Image, Save, FolderPlus, 
  ArrowUp, Home, Check, X, Bold, Italic, Underline, Type, Palette } from "lucide-react";

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
    fontFamily: "Inter",
    bold: false,
    italic: false,
    underline: false
  });

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
    const matchesSearch = note.title.toLowerCase().includes(searchText.toLowerCase()) || 
                        note.content.toLowerCase().includes(searchText.toLowerCase());
    
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
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-5 w-5 text-gray-400" />
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
                      <Button variant="ghost" size="sm">
                        <Image className="h-5 w-5 text-gray-500" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Paperclip className="h-5 w-5 text-gray-500" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Calendar className="h-5 w-5 text-gray-500" />
                      </Button>
                    </div>
                    <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                  </div>
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
