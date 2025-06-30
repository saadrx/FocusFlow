import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Plus, X, Save } from "lucide-react";
import { useLocalStorage } from "../hooks/useLocalStorage";

export default function QuickNote() {
  const [isOpen, setIsOpen] = useState(false);
  const [note, setNote] = useLocalStorage("focusflow-quick-note", "");
  const [tempNote, setTempNote] = useState("");
  const [notes, setNotes] = useLocalStorage("focusflow-notes", []);

  const openNote = () => {
    setTempNote(note);
    setIsOpen(true);
  };

  const saveNote = () => {
    // Save to quick note storage
    setNote(tempNote);
    
   
    if (tempNote.trim()) {
      const newNote = {
        id: Date.now().toString(),
        title: tempNote.split('\n')[0].substring(0, 50) || "Quick Note",
        content: tempNote,
        createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        updatedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        isFavorite: false,
        folderId: null,
      };
      
      setNotes([newNote, ...notes]);
      
      // Clear the quick note after saving to main notes
      setNote("");
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
