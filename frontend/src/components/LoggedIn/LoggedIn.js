import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { getBookings } from '../../services/bookings'


const LoggedIn = () => {
	const [date, setDate] = useState(new Date());
	const [bookings, setBookings] = useState([]);

	const updateBookings = async (date) => {
		const yearMonthDay = date.toISOString().split('T')[0]
		const newBookings = await getBookings(yearMonthDay);
		//setBookings(newBookings)
	}
	useEffect(
  	() => {
    	updateBookings(date);
		},
  	[date],
	);

	return (
		<>
			<Calendar
    		onChange={date => setDate(date)}
    		value={date}
    	/>
		</>
		)
}

export default LoggedIn;