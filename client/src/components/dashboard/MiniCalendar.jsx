
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { format, parseISO, isSameDay } from "date-fns";

export default function MiniCalendar() {
  const handleCalendarClick = () => {
    window.location.href = '/calendar';
  };
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarEvents] = useLocalStorage("focusflow-calendar-events", []);

  const calendarConfig = {
    personal: { color: "bg-blue-500" },
    work: { color: "bg-green-500" },
    school: { color: "bg-purple-500" }
  };

  
  const getUpcomingEvents = () => {
    const today = new Date();
    return calendarEvents
      .filter(event => {
        const eventDate = parseISO(event.date);
        return eventDate >= today;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 3)
      .map(event => ({
        ...event,
        color: calendarConfig[event.calendar]?.color || "bg-gray-500"
      }));
  };

  const events = getUpcomingEvents();

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    return days;
  };

  const isToday = (day) => {
    if (!day) return false;
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === currentDate.getMonth() &&
      today.getFullYear() === currentDate.getFullYear()
    );
  };

  const hasEvent = (day) => {
    if (!day) return false;
    const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return calendarEvents.some(event => {
      const eventDate = parseISO(event.date);
      return isSameDay(eventDate, dayDate);
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div 
            className="flex items-center space-x-2 cursor-pointer hover:opacity-75 transition-opacity"
            onClick={handleCalendarClick}
          >
            <Calendar className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Calendar</h3>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <h4 className="font-medium">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h4>
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
            <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {getDaysInMonth().map((day, index) => (
            <div
              key={index}
              className={`
                h-8 flex items-center justify-center text-sm rounded
                ${day ? 'hover:bg-gray-100 cursor-pointer' : ''}
                ${isToday(day) ? 'bg-blue-600 text-white' : ''}
                ${hasEvent(day) && !isToday(day) ? 'bg-blue-100 text-blue-700' : ''}
              `}
            >
              {day}
            </div>
          ))}
        </div>
        
        <div className="mt-4 space-y-2">
          <h5 className="text-sm font-medium text-gray-700">Upcoming Events</h5>
          {events.length > 0 ? (
            events.map((event, index) => (
              <div key={event.id || index} className="flex items-center space-x-2 text-sm">
                <div className={`w-2 h-2 rounded-full ${event.color}`}></div>
                <div className="flex-1 min-w-0">
                  <span className="text-gray-600 truncate block">{event.title}</span>
                  <span className="text-xs text-gray-400">
                    {format(parseISO(event.date), 'MMM d')}
                    {event.time && ` at ${event.time}`}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-500">No upcoming events</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
