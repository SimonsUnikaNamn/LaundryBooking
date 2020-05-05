import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { getBookings } from '../../services/bookings'
import { dateToString } from '../../utils/utils'
import Bookings from '../Bookings/Bookings'
import NewBooking from '../NewBooking/NewBooking'
import './DateCSSOverrider.css';


const Wrapper = styled.div`
		display: inline-block;
		background-color: white;
		text-align: left;
		padding: 10px; 20px;
`


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
			<Wrapper>
				{loading && "Loading..."}
				<Calendar
	    		onChange={setDate}
	    		value={date}
	    		locale={"nb-NO"}
	    	/>
	    	<Bookings
	    		bookings={bookings}
	    		chosenDate={date}
    		/>
    		<NewBooking
    			setBookings={setBookings}
    			chosenDate={date}
    		/>
    	</Wrapper>
		</>
		)
}

export default LoggedIn;