import React, { useState, useEffect } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  subDays, 
  parseISO,
  addHours
} from 'date-fns';

const CalendarComponent = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    type: 'meeting',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '09:00',
    duration: '1',
    attendees: [],
    description: '',
    location: '',
    recurring: false,
    recurringType: 'none'
  });
  const [viewMode, setViewMode] = useState('month');
  const [newAttendee, setNewAttendee] = useState('');

  // Sample data for attendees
  const sampleAttendees = [
    { id: 'user1', name: 'John Doe', email: 'john@example.com', avatar: 'https://i.pravatar.cc/150?img=1' },
    { id: 'user2', name: 'Jane Smith', email: 'jane@example.com', avatar: 'https://i.pravatar.cc/150?img=2' },
    { id: 'user3', name: 'Mike Johnson', email: 'mike@example.com', avatar: 'https://i.pravatar.cc/150?img=3' },
    { id: 'user4', name: 'Sarah Williams', email: 'sarah@example.com', avatar: 'https://i.pravatar.cc/150?img=4' },
  ];

  // Generate sample events on first render
  useEffect(() => {
    const sampleEvents = [
      {
        id: 1,
        title: 'Product Strategy Meeting',
        type: 'meeting',
        date: format(new Date(), 'yyyy-MM-dd'),
        time: '10:00',
        duration: '1.5',
        attendees: ['user1', 'user2', 'user3'],
        description: 'Discuss product roadmap for next quarter',
        location: 'Conference Room A',
        recurring: false
      },
      {
        id: 2,
        title: 'UI Prototype Review',
        type: 'design',
        date: format(new Date(), 'yyyy-MM-dd'),
        time: '15:00',
        duration: '1',
        assignee: 'user4',
        description: 'Review new UI components with design team',
        location: 'Design Studio'
      },
      {
        id: 3,
        title: 'Client Demo',
        type: 'client',
        date: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
        time: '14:00',
        duration: '1',
        attendees: ['user1', 'user3'],
        client: 'Acme Corp',
        location: 'Zoom Meeting'
      },
    ];
    setEvents(sampleEvents);
  }, []);

  // Navigation functions
  const navigateTo = (direction) => {
    switch (viewMode) {
      case 'day':
        setSelectedDate(direction === 'next' ? addDays(selectedDate, 1) : subDays(selectedDate, 1));
        break;
      case 'week':
        setSelectedDate(direction === 'next' ? addDays(selectedDate, 7) : subDays(selectedDate, 7));
        break;
      case 'month':
        setCurrentDate(direction === 'next' ? addMonths(currentDate, 1) : subMonths(currentDate, 1));
        break;
      default:
        break;
    }
  };

  // Get events for a specific date
  const getEventsForDate = (date) => {
    return events.filter(event => isSameDay(parseISO(event.date), date));
  };

  // Handle date selection
  const handleDateClick = (day) => {
    setSelectedDate(day);
    if (viewMode !== 'day') {
      setViewMode('day');
    }
  };

  // Handle adding/editing event
  const handleSaveEvent = () => {
    const eventDate = editingEvent ? parseISO(newEvent.date) : selectedDate;
    const eventObj = {
      id: editingEvent ? editingEvent.id : events.length + 1,
      ...newEvent,
      date: format(eventDate, 'yyyy-MM-dd'),
      attendees: newEvent.attendees
    };

    if (editingEvent) {
      setEvents(events.map(e => e.id === editingEvent.id ? eventObj : e));
    } else {
      setEvents([...events, eventObj]);
    }

    setShowEventModal(false);
    setEditingEvent(null);
    resetEventForm();
  };

  // Handle editing an event
  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setNewEvent({
      title: event.title,
      type: event.type,
      date: event.date,
      time: event.time,
      duration: event.duration,
      attendees: event.attendees || [],
      description: event.description || '',
      location: event.location || '',
      recurring: event.recurring || false,
      recurringType: event.recurringType || 'none'
    });
    setShowEventModal(true);
  };

  // Reset event form
  const resetEventForm = () => {
    setNewEvent({
      title: '',
      type: 'meeting',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '09:00',
      duration: '1',
      attendees: [],
      description: '',
      location: '',
      recurring: false,
      recurringType: 'none'
    });
  };

  // Add attendee
  const addAttendee = () => {
    if (newAttendee && !newEvent.attendees.includes(newAttendee)) {
      setNewEvent({
        ...newEvent,
        attendees: [...newEvent.attendees, newAttendee]
      });
      setNewAttendee('');
    }
  };

  // Remove attendee
  const removeAttendee = (attendeeId) => {
    setNewEvent({
      ...newEvent,
      attendees: newEvent.attendees.filter(a => a !== attendeeId)
    });
  };

  // Delete event
  const handleDeleteEvent = (eventId) => {
    setEvents(events.filter(e => e.id !== eventId));
  };

  // Render day cell - professional style
  const renderDayCell = (day) => {
    const isSelected = isSameDay(day, selectedDate);
    const isCurrentMonth = isSameMonth(day, currentDate);
    const dayEvents = getEventsForDate(day);
    const isToday = isSameDay(day, new Date());

    return (
      <div
        key={day.toString()}
        onClick={() => handleDateClick(day)}
        className={`relative h-24 p-1 border border-gray-100 rounded-lg transition-all
          ${isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''}
          ${!isCurrentMonth ? 'text-gray-400' : 'text-gray-700'}
          ${isToday ? 'border-blue-300 bg-blue-50' : ''}
          hover:bg-gray-50 cursor-pointer`}
      >
        <div className={`text-right text-sm font-medium mb-1
          ${isToday ? 'text-blue-600' : ''}`}>
          {format(day, 'd')}
        </div>
        <div className="space-y-1 max-h-16 overflow-y-auto">
          {dayEvents.slice(0, 2).map(event => (
            <div
              key={event.id}
              className={`text-xs p-1 rounded truncate 
                ${event.type === 'meeting' ? 'bg-blue-100 text-blue-800' : ''}
                ${event.type === 'design' ? 'bg-green-100 text-green-800' : ''}
                ${event.type === 'client' ? 'bg-purple-100 text-purple-800' : ''}
                ${event.type === 'team' ? 'bg-yellow-100 text-yellow-800' : ''}`}
            >
              {event.time} {event.title}
            </div>
          ))}
          {dayEvents.length > 2 && (
            <div className="text-xs text-gray-500">+{dayEvents.length - 2} more</div>
          )}
        </div>
      </div>
    );
  };

  // Render the day view
  const renderDayView = () => {
    const dayEvents = getEventsForDate(selectedDate);
    
    return (
      <div className="mt-4">
        <h4 className="font-medium text-gray-700 mb-4 text-lg">
          {format(selectedDate, 'EEEE, MMMM d, yyyy')}
        </h4>
        <div className="space-y-4">
          {dayEvents.length > 0 ? (
            dayEvents.map(event => renderEventItem(event))
          ) : (
            <div className="text-center py-6 rounded-lg bg-gray-50">
              <p className="text-gray-500">No events scheduled for this day</p>
              <button
                onClick={() => {
                  setNewEvent({
                    ...newEvent,
                    date: format(selectedDate, 'yyyy-MM-dd')
                  });
                  setShowEventModal(true);
                }}
                className="mt-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                Add an event
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render event item - professional style
  const renderEventItem = (event) => {
    const eventDate = parseISO(event.date);
    const startTime = new Date(`${event.date}T${event.time}`);
    const endTime = addHours(startTime, parseFloat(event.duration));
    
    return (
      <div key={event.id} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2
                ${event.type === 'meeting' ? 'bg-blue-500' : ''}
                ${event.type === 'design' ? 'bg-green-500' : ''}
                ${event.type === 'client' ? 'bg-purple-500' : ''}
                ${event.type === 'team' ? 'bg-yellow-500' : ''}`}></div>
              <h4 className="font-medium text-gray-800 text-lg">{event.title}</h4>
            </div>
            <div className="mt-2 space-y-1">
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {format(startTime, 'h:mm a')} - {format(endTime, 'h:mm a')}
              </div>
              {event.location && (
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {event.location}
                </div>
              )}
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handleEditEvent(event)}
              className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => handleDeleteEvent(event.id)}
              className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
        
        {event.description && (
          <p className="mt-3 text-sm text-gray-600">{event.description}</p>
        )}
        
        {(event.attendees && event.attendees.length > 0) && (
          <div className="mt-4">
            <h5 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Attendees</h5>
            <div className="flex flex-wrap gap-2">
              {event.attendees.map(attendeeId => {
                const attendee = sampleAttendees.find(a => a.id === attendeeId);
                return attendee ? (
                  <div key={attendee.id} className="flex items-center bg-gray-50 rounded-full pl-2 pr-3 py-1">
                    <img
                      className="w-6 h-6 rounded-full mr-2"
                      src={attendee.avatar}
                      alt={attendee.name}
                    />
                    <span className="text-sm text-gray-700">{attendee.name}</span>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        )}
        
        {event.client && (
          <div className="mt-4">
            <h5 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Client</h5>
            <div className="flex items-center">
              <div className="bg-gray-100 rounded-full p-2 mr-2">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700">{event.client}</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render month view
  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

    // Get start day of week for the first day of month
    const startDay = monthStart.getDay();
    // Create empty cells for days before the first day of month
    const emptyStartDays = Array.from({ length: startDay }).map((_, i) => (
      <div key={`empty-start-${i}`} className="h-24 p-1 border border-gray-100 rounded-lg bg-gray-50"></div>
    ));

    return (
      <div className="grid grid-cols-7 gap-2 mt-2">
        {emptyStartDays}
        {monthDays.map(day => renderDayCell(day))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Calendar</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setNewEvent({
                ...newEvent,
                date: format(selectedDate, 'yyyy-MM-dd')
              });
              setShowEventModal(true);
            }}
            className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            New Event
          </button>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigateTo('prev')}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          
          <h3 className="text-lg font-semibold text-gray-800">
            {viewMode === 'day' && format(selectedDate, 'MMMM d, yyyy')}
            {viewMode === 'week' && `${format(selectedDate, 'MMM d')} - ${format(addDays(selectedDate, 6), 'MMM d, yyyy')}`}
            {viewMode === 'month' && format(currentDate, 'MMMM yyyy')}
          </h3>
          
          <button 
            onClick={() => navigateTo('next')}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
               d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
          
          <button
            onClick={() => {
              setCurrentDate(new Date());
              setSelectedDate(new Date());
            }}
            className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            Today
          </button>
        </div>

        {/* View Mode Selector */}
        <div className="flex bg-gray-100 p-1 rounded-lg">
          {['day', 'week', 'month'].map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3 py-1 text-sm rounded-md transition-colors
                ${viewMode === mode ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar Grid Header */}
      {viewMode === 'month' && (
        <div className="grid grid-cols-7 gap-2 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-gray-500 py-2"
            >
              {day}
            </div>
          ))}
        </div>
      )}

      {/* Calendar View */}
      {viewMode === 'month' && renderMonthView()}
      {viewMode === 'day' && renderDayView()}

      {/* Event Modal */}
     {showEventModal && (
  <div className="fixed inset-0 z-50 overflow-hidden">
    {/* Overlay */}
    <div 
      className="absolute inset-0 bg-[rgba(0,0,0,0.4)] bg-opacity-40 bg-opacity-50 transition-opacity"
      onClick={() => {
        setShowEventModal(false);
        setEditingEvent(null);
        resetEventForm();
      }}
    ></div>
    
    {/* Drawer */}
    <div className="absolute inset-y-0 right-0 pl-10 max-w-full flex">
      <div className="w-screen max-w-md">
        <div className="h-full flex flex-col bg-white shadow-xl overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                {editingEvent ? 'Edit Event' : 'Create New Event'}
              </h3>
              <button
                onClick={() => {
                  setShowEventModal(false);
                  setEditingEvent(null);
                  resetEventForm();
                }}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Title*</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter event title"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
                  <select
                    value={newEvent.type}
                    onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="meeting">Meeting</option>
                    <option value="design">Design Review</option>
                    <option value="client">Client Call</option>
                    <option value="team">Team Event</option>
                    <option value="personal">Personal</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. Conference Room A"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date*</label>
                  <input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Time*</label>
                    <input
                      type="time"
                      value={newEvent.time}
                      onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                    <select
                      value={newEvent.duration}
                      onChange={(e) => setNewEvent({...newEvent, duration: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="0.5">30 min</option>
                      <option value="1">1 hour</option>
                      <option value="1.5">1.5 hours</option>
                      <option value="2">2 hours</option>
                      <option value="3">3 hours</option>
                      <option value="4">4 hours</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                  placeholder="Enter event description"
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Attendees</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {newEvent.attendees.map(attendeeId => {
                    const attendee = sampleAttendees.find(a => a.id === attendeeId);
                    return attendee ? (
                      <div key={attendee.id} className="flex items-center bg-gray-100 rounded-full pl-2 pr-2 py-1">
                        <img
                          className="w-5 h-5 rounded-full mr-2"
                          src={attendee.avatar}
                          alt={attendee.name}
                        />
                        <span className="text-sm text-gray-700 mr-1">{attendee.name}</span>
                        <button
                          onClick={() => removeAttendee(attendee.id)}
                          className="text-gray-500 hover:text-red-500"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ) : null;
                  })}
                </div>
                <div className="flex">
                  <select
                    value={newAttendee}
                    onChange={(e) => setNewAttendee(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select attendee</option>
                    {sampleAttendees.filter(a => !newEvent.attendees.includes(a.id)).map(attendee => (
                      <option key={attendee.id} value={attendee.id}>{attendee.name}</option>
                    ))}
                  </select>
                  <button
                    onClick={addAttendee}
                    className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id="recurring"
                    checked={newEvent.recurring}
                    onChange={(e) => setNewEvent({...newEvent, recurring: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="recurring" className="ml-2 block text-sm text-gray-700">
                    Recurring event
                  </label>
                </div>
                
                {newEvent.recurring && (
                  <div className="ml-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Recurrence</label>
                    <select
                      value={newEvent.recurringType}
                      onChange={(e) => setNewEvent({...newEvent, recurringType: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-8 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowEventModal(false);
                  setEditingEvent(null);
                  resetEventForm();
                }}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEvent}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                disabled={!newEvent.title}
              >
                {editingEvent ? 'Update Event' : 'Create Event'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default CalendarComponent;