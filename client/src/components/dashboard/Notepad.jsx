
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { FileText, Plus, ExternalLink, Save, X } from "lucide-react";
import { useLocalStorage } from "../../hooks/useLocalStorage";

export default function Notepad() {
  const [notes, setNotes] = useLocalStorage("focusflow-notes", []);
  const [isCreating, setIsCreating] = useState(false);
  const [newNote, setNewNote] = useState({ title: "", content: "" });

  
  const recentNotes = notes.slice(0, 4);

  const handleCreateNote = () => {
    if (newNote.title.trim() || newNote.content.trim()) {
      const note = {
        id: Date.now().toString(),
        title: newNote.title.trim() || "Untitled Note",
        content: newNote.content,
        createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        updatedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        isFavorite: false,
        folderId: null,
      };
      
      setNotes([note, ...notes]);
      setNewNote({ title: "", content: "" });
      setIsCreating(false);
    }
  };

  const handleCancel = () => {
    setNewNote({ title: "", content: "" });
    setIsCreating(false);
  };

  return (
    <div>
      <Card className="h-[28rem]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Notes</h3>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.location.href = "/notes"}
                className="text-blue-600 hover:text-blue-800"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
              <Button 
                onClick={() => setIsCreating(true)}
                size="sm"
                disabled={isCreating}
              >
                <Plus className="h-4 w-4" />
                <span className="ml-1">New</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isCreating ? (
            <div className="space-y-3 h-80">
              <Input
                placeholder="Note title..."
                value={newNote.title}
                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                className="text-sm"
              />
              <Textarea
                placeholder="Start typing your note here..."
                value={newNote.content}
                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                className="flex-grow resize-none text-sm h-56"
              />
              <div className="flex justify-end space-x-2">
                <Button variant="outline" size="sm" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
                <Button size="sm" onClick={handleCreateNote}>
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
              </div>
            </div>
          ) : recentNotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-80 text-gray-500">
              <FileText className="h-12 w-12 mb-3" />
              <p className="text-sm">No notes yet</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={() => setIsCreating(true)}
              >
                Create your first note
              </Button>
            </div>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {recentNotes.map((note) => (
                <div
                  key={note.id}
                  className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => window.location.href = "/notes"}
                >
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {note.title}
                  </h4>
                  <p className="text-xs text-gray-600 truncate mb-2 mt-1">
                    {note.content.split('\n')[0]}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      Updated {note.updatedAt}
                    </span>
                  </div>
                </div>
              ))}
              {notes.length > 5 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-blue-600"
                  onClick={() => window.location.href = "/notes"}
                >
                  View all {notes.length} notes
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}