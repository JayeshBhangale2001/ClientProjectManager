import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const CalendarView = ({ tasks }) => {
  const events = tasks.map(task => ({
    title: task.title,
    start: new Date(task.startDate), // Replace with actual start date field
    end: new Date(task.endDate),     // Replace with actual end date field
  }));

  return (
    <div className="calendar-container" style={{ height: '500px' }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
      />
    </div>
  );
};

export default CalendarView;
