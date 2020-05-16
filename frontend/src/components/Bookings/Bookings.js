import React from 'react';
import styled from 'styled-components';
import { minuteOfDayToHourAndMinuteString } from '../../utils/utils'
import { useAuth0 } from "../../react-auth0-spa";
import { deleteBooking } from '../../services/bookings'
import loadingStore from '../../stores/loading/loading'

const Title = styled.h4``


const TitleNoBookings = styled.h4`
	font-style: italic;
`

const Wrapper = styled.div`
	padding: 18px 0;
`
const BookingRow = styled.div`
	display: flex;
	flex-direction: row;
`

const BookingTimeAndBy = styled.div`
	display: flex;
	flex-direction: column;
	margin-right: 10px;
`

const BookingBy = styled.div`
	font-size: 12px;
	font-style: italic;
`

const deleteBookingWithLoader = async (chosenDate, bookingId, setLoading, setBookings) => {
	try {
		setLoading(true)
		const newBookings = await deleteBooking(chosenDate, bookingId)
		setBookings(newBookings)
	} catch(error){
		throw error
	} finally {
		setLoading(false)
	}
}


const bookingRow = (booking, loggedInUser, chosenDate, setLoading, setBookings) => {
	const fromString = minuteOfDayToHourAndMinuteString(booking['from'])
	const toString = minuteOfDayToHourAndMinuteString(booking['to'])
	const bookedByUser = booking['user']
	const bookingId = booking['id']
	const bookingEmail = booking['email']

	return (
		<BookingRow>
			<BookingTimeAndBy>
				<div>Booking {`${fromString} - ${toString}`}</div>
				<BookingBy>av {`${bookingEmail}`}</BookingBy>
			</BookingTimeAndBy>
			{bookedByUser === loggedInUser && <button onClick={() => deleteBookingWithLoader(chosenDate, bookingId, setLoading, setBookings)}>Slett booking</button>}
		</BookingRow>
		)
}

const Bookings = ({ bookings, chosenDate, setBookings }) => {
	const { user } = useAuth0();

  	const setLoading = loadingStore(state => state.setLoading)

	if (bookings.length === 0) {
		return (
			<Wrapper>
				<TitleNoBookings>Ingen booking denne dato</TitleNoBookings>
			</Wrapper>
		)
	}

	return (
		<Wrapper>
			<Title>Bookinger dette dato</Title>
			{bookings.map(booking => bookingRow(booking, user.sub, chosenDate, setLoading, setBookings))}
		</Wrapper>
		)
}

export default Bookings