
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Plus, X, Save, Calendar as CalendarIcon, Clock, MapPin } from "lucide-react";
import { addMonths, subMonths, format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from "date-fns";
import { useLocalStorage } from "../hooks/useLocalStorage";

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useLocalStorage("focusflow-calendar-events", []);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [activeCalendars, setActiveCalendars] = useState({
    personal: true,
    work: true,
    school: true
  });
  
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    duration: "60",
    location: "",
    calendar: "personal"
  });

  const calendarConfig = {
    personal: { color: "bg-blue-500", textColor: "text-blue-800", bgColor: "bg-blue-100" },
    work: { color: "bg-green-500", textColor: "text-green-800", bgColor: "bg-green-100" },
    school: { color: "bg-purple-500", textColor: "text-purple-800", bgColor: "bg-purple-100" }
  };

  const handlePrevious = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNext = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleDateClick = (day) => {
    const clickedDate = format(day, 'yyyy-MM-dd');
    setSelectedDate(clickedDate);
    setNewEvent({ ...newEvent, date: clickedDate });
    setShowCreateEvent(true);
  };

  const handleCreateEvent = () => {
    if (newEvent.title.trim() && newEvent.date) {
      const event = {
        id: Date.now().toString(),
        title: newEvent.title,
        description: newEvent.description,
        date: newEvent.date,
        time: newEvent.time,
        duration: parseInt(newEvent.duration),
        location: newEvent.location,
        calendar: newEvent.calendar,
        createdAt: new Date().toISOString()
      };
      
      setEvents([...events, event]);
      setNewEvent({
        title: "",
        description: "",
        date: "",
        time: "",
        duration: "60",
        location: "",
        calendar: "personal"
      });
      setShowCreateEvent(false);
    }
  };

  const handleDeleteEvent = (eventId) => {
    setEvents(events.filter(event => event.id !== eventId));
    setShowEventDetails(false);
  };

  const handleShowEventDetails = (event) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
  };

  const toggleCalendar = (calendarType) => {
    setActiveCalendars({
      ...activeCalendars,
      [calendarType]: !activeCalendars[calendarType]
    });
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEventsForDay = (day) => {
    const dayString = format(day, 'yyyy-MM-dd');
    return events.filter(event => 
      event.date === dayString && activeCalendars[event.calendar]
    );
  };

  return (
    <div className="flex-1 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-6">
        <div className="space-y-6">
          {/* Calendar Header */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {format(currentDate, 'MMMM yyyy')}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={handlePrevious}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleToday}>
                    Today
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleNext}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button size="sm" onClick={() => setShowCreateEvent(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Event
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Calendar Controls */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Show calendars:</span>
                {Object.entries(calendarConfig).map(([type, config]) => (
                  <label key={type} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={activeCalendars[type]}
                      onChange={() => toggleCalendar(type)}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 rounded ${config.color} ${activeCalendars[type] ? 'opacity-100' : 'opacity-30'}`}></div>
                    <span className="text-sm capitalize">{type}</span>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Calendar Grid */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-7 gap-1 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {daysInMonth.map((day) => {
                  const dayEvents = getEventsForDay(day);
                  return (
                    <div
                      key={day.toString()}
                      className={`p-2 h-32 border border-gray-200 dark:border-gray-700 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 ${
                        isToday(day) ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300' : ''
                      } ${!isSameMonth(day, currentDate) ? 'text-gray-400' : ''}`}
                      onClick={() => handleDateClick(day)}
                    >
                      <div className="text-sm font-medium">{format(day, 'd')}</div>
                      <div className="mt-1 space-y-1 overflow-y-auto max-h-20">
                        {dayEvents.map(event => {
                          const config = calendarConfig[event.calendar];
                          return (
                            <div
                              key={event.id}
                              className={`text-xs p-1 rounded ${config.bgColor} ${config.textColor} group relative`}
                              title={`${event.time ? event.time + ' - ' : ''}${event.title}${event.location ? ' at ' + event.location : ''}`}
                            >
                              <div className="flex items-center justify-between">
                                <div 
                                  className="truncate flex-1 cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleShowEventDetails(event);
                                  }}
                                >
                                  {event.time && <span className="font-medium">{event.time} </span>}
                                  {event.title}
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (window.confirm('Are you sure you want to delete this event?')) {
                                      handleDeleteEvent(event.id);
                                    }
                                  }}
                                  className="opacity-0 group-hover:opacity-100 ml-1 text-red-600 hover:text-red-800 flex-shrink-0"
                                  title="Delete event"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Create Event Modal */}
          {showCreateEvent && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <Card className="w-full max-w-md mx-4">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <CalendarIcon className="h-5 w-5" />
                      <span>Create Event</span>
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowCreateEvent(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Title *</label>
                    <Input
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                      placeholder="Event title"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Calendar</label>
                    <Select value={newEvent.calendar} onValueChange={(value) => setNewEvent({ ...newEvent, calendar: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="personal">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-blue-500 rounded"></div>
                            <span>Personal</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="work">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-green-500 rounded"></div>
                            <span>Work</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="school">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-purple-500 rounded"></div>
                            <span>School</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Date *</label>
                      <Input
                        type="date"
                        value={newEvent.date}
                        onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Time</label>
                      <Input
                        type="time"
                        value={newEvent.time}
                        onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Duration (minutes)</label>
                    <Select value={newEvent.duration} onValueChange={(value) => setNewEvent({ ...newEvent, duration: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="90">1.5 hours</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                        <SelectItem value="240">4 hours</SelectItem>
                        <SelectItem value="480">8 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Location</label>
                    <Input
                      value={newEvent.location}
                      onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                      placeholder="Event location"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                      placeholder="Event description"
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowCreateEvent(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleCreateEvent}>
                      <Save className="h-4 w-4 mr-2" />
                      Create Event
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Event Details Modal */}
          {showEventDetails && selectedEvent && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <Card className="w-full max-w-md mx-4">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <CalendarIcon className="h-5 w-5" />
                      <span>Event Details</span>
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowEventDetails(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Title</label>
                    <p className="text-lg font-medium">{selectedEvent.title}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Calendar</label>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className={`w-3 h-3 ${calendarConfig[selectedEvent.calendar].color} rounded`}></div>
                      <span className="capitalize">{selectedEvent.calendar}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Date</label>
                      <p>{format(new Date(selectedEvent.date), 'MMMM d, yyyy')}</p>
                    </div>
                    {selectedEvent.time && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Time</label>
                        <p>{selectedEvent.time}</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Duration</label>
                    <p>{selectedEvent.duration} minutes</p>
                  </div>

                  {selectedEvent.location && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Location</label>
                      <p className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{selectedEvent.location}</span>
                      </p>
                    </div>
                  )}

                  {selectedEvent.description && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Description</label>
                      <p className="text-gray-700 dark:text-gray-300">{selectedEvent.description}</p>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-4 border-t">
                    <Button
                      variant="destructive"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this event?')) {
                          handleDeleteEvent(selectedEvent.id);
                        }
                      }}
                    >
                      Delete Event
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowEventDetails(false)}
                    >
                      Close
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
