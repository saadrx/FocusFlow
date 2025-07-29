
import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Plus, X, Save } from "lucide-react";
import { useApi } from "../hooks/useApi";

export default function QuickNote() {
  const [isOpen, setIsOpen] = useState(false);
  const [tempNote, setTempNote] = useState("");
  const { createItem: createNote } = useApi('/api/notes');

  const openNote = () => {
    setTempNote("");
    setIsOpen(true);
  };

  const saveNote = async () => {
    if (tempNote.trim()) {
      const newNote = {
        title: tempNote.split('\n')[0].substring(0, 50) || "Quick Note",
        content: tempNote,
        category: 'quick',
        is_favorite: false,
        folder_id: null,
      };

      await createNote(newNote);
      setTempNote("");
    }

    setIsOpen(false);
  };

  const closeNote = () => {
    setTempNote("");
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={openNote}
        className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg z-50"
        size="icon"
      >
        <Plus className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 shadow-lg z-50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Quick Note</CardTitle>
        <div className="flex gap-1">
          <Button onClick={saveNote} size="sm" variant="ghost">
            <Save className="h-4 w-4" />
          </Button>
          <Button onClick={closeNote} size="sm" variant="ghost">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <textarea
          value={tempNote}
          onChange={(e) => setTempNote(e.target.value)}
          placeholder="Type your quick note here..."
          className="w-full h-32 p-3 text-sm border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </CardContent>
    </Card>
  );
}
