import React from 'react';
import styled from 'styled-components';
import { minuteOfDayToHourAndMinuteString } from '../../utils/utils'
import { useAuth0 } from "../../react-auth0-spa";
import { deleteBooking } from '../../services/bookings'

const Title = styled.h1``
const Wrapper = styled.div``
const BookingRow = styled.div`
	display: flex;
	flex-direction: row;
`


const bookingRow = (booking, loggedInUser, chosenDate) => {
	const fromString = minuteOfDayToHourAndMinuteString(booking['from'])
	const toString = minuteOfDayToHourAndMinuteString(booking['to'])
	const bookedByUser = booking['user']
	const bookingId = booking['id']
	return (
		<BookingRow>
			Booking {`${fromString} - ${toString}`}
			{bookedByUser === loggedInUser && <button onClick={() => deleteBooking(chosenDate, bookingId)}>Slett booking</button>}
		</BookingRow>
		)
}

const Bookings = ({ bookings, chosenDate }) => {
	const { user } = useAuth0();

	if (bookings.length === 0) {
		return (
			<Wrapper>
				<Title>Inge bookinger gjorde dette dato</Title>
			</Wrapper>
		)
	}

	return (
		<Wrapper>
			<Title>Bookinger dette dato</Title>
			{bookings.map(booking => bookingRow(booking, user.sub, chosenDate))}
		</Wrapper>
		)
}

export default Bookings