import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { getBookings } from '../../services/bookings'
import { dateToString } from '../../utils/utils'
import Bookings from '../Bookings/Bookings'
import NewBooking from '../NewBooking/NewBooking'


const Wrapper = styled.div``


const LoggedIn = () => {
	const [date, setDate] = useState(new Date());
	const [bookings, setBookings] = useState([]);
	const [loading, setLoading] = useState(false);

	const updateBookings = async (date) => {
		const yearMonthDay = dateToString(date)
		setLoading(true)
		const newBookings = await getBookings(yearMonthDay);
		setBookings(newBookings)
		setLoading(false)
	}
	useEffect(
  	() => {
    	updateBookings(date);
		},
  	[date],
	);

	return (
		<>
			{loading && "Loading..."}
			<Wrapper>
				<Calendar
	    		onChange={setDate}
	    		value={date}
	    		locale={"nb-NO"}
	    	/>
	    	<Bookings
	    		bookings={bookings}
    		/>
    		<NewBooking
    			chosenDate={date}
    		/>
    	</Wrapper>
		</>
		)
}

export default LoggedIn;