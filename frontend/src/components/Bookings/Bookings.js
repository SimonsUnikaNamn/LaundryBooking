import React from 'react';
import styled from 'styled-components';
import { minuteOfDayToHourAndMinuteString } from '../../utils/utils'

const Title = styled.h1``
const Wrapper = styled.div``
const BookingRow = styled.div``


const bookingRow = booking => {
	const fromString = minuteOfDayToHourAndMinuteString(booking['from'])
	const toString = minuteOfDayToHourAndMinuteString(booking['to'])
	return (
		<BookingRow>
			Booking {`${fromString} - ${toString}`}
		</BookingRow>
		)
}

const Bookings = ({ bookings }) => {
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
			{bookings.map(bookingRow)}
		</Wrapper>
		)
}

export default Bookings