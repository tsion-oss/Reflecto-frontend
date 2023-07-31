import React from 'react';
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';

export default function DatePicker({ value, onChange }) {
  return (
    <div className='p-5'   >
      <DateTimePicker value={value} onChange={onChange} />
    </div>
  );
}
