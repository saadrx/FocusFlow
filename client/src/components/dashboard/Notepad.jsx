
import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Plus, Save, Trash } from "lucide-react";
import { useApi } from "@/hooks/useApi";

export default function Notepad() {
  const { data: notes, loading, error, createItem: createNote, updateItem: updateNote, deleteItem: deleteNote } = useApi('/api/notes');
  const [newNote, setNewNote] = useState({ title: "", content: "" });
  const [activeNoteId, setActiveNoteId] = useState(null);

  const handleSaveNote = async () => {
    if (newNote.title.trim() || newNote.content.trim()) {
      try {
        const noteData = {
          title: newNote.title.trim() || "Untitled",
          content: newNote.content.trim(),
          category: "general"
        };

        if (activeNoteId) {
          await updateNote(activeNoteId, noteData);
        } else {
          const createdNote = await createNote(noteData);
          setActiveNoteId(createdNote.id);
        }

        setNewNote({ title: "", content: "" });
        setActiveNoteId(null);
      } catch (error) {
        console.error('Error saving note:', error);
      }
    }
  };

  const handleEditNote = (note) => {
    setNewNote({ title: note.title, content: note.content });
    setActiveNoteId(note.id);
  };

  const handleDeleteNote = async (noteId) => {
    if (confirm('Are you sure you want to delete this note?')) {
      try {
        await deleteNote(noteId);
        if (activeNoteId === noteId) {
          setNewNote({ title: "", content: "" });
          setActiveNoteId(null);
        }
      } catch (error) {
        console.error('Error deleting note:', error);
      }
    }
  };

  const recentNotes = notes ? notes.slice(0, 3) : [];

  if (loading) return <Card><CardContent className="p-4">Loading notes...</CardContent></Card>;
  if (error) return <Card><CardContent className="p-4">Error loading notes</CardContent></Card>;

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="text-lg font-semibold">Quick Notes</h3>
        <Button size="sm" onClick={handleSaveNote}>
          <Save className="h-4 w-4 mr-1" />
          Save
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Input
            placeholder="Note title..."
            value={newNote.title}
            onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
            className="text-sm"
          />
          <Textarea
            placeholder="Start writing your note here..."
            value={newNote.content}
            onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
            className="min-h-[120px] text-sm resize-none"
          />
        </div>

        {recentNotes.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">Recent Notes</h4>
            <div className="space-y-2">
              {recentNotes.map((note) => (
                <div
                  key={note.id}
                  className="p-2 bg-gray-50 dark:bg-gray-800 rounded-md group hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0 cursor-pointer" onClick={() => handleEditNote(note)}>
                      <h5 className="text-sm font-medium truncate">{note.title}</h5>
                      <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                        {note.content}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
                      onClick={() => handleDeleteNote(note.id)}
                    >
                      <Trash className="h-3 w-3 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
