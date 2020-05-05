import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { dateToString } from '../../utils/utils'
import TimeRangePicker from '@wojtekmaj/react-timerange-picker';
import { makeBooking } from '../../services/bookings'


const Title = styled.h1``
const Wrapper = styled.div``

const NewBookingWrapper = styled.div`
	display: flex;
	flex-direction: row;
`

const makeNewBooking = async (chosenDate, time, setBookings) => {
	const result = await makeBooking(chosenDate, time)
	setBookings(result)
}

const NewBooking = ({ chosenDate, setBookings }) => {
	const [time, setTime] = useState(['16:00', '19:00']);
	const dateString = dateToString(chosenDate)
	return (<Wrapper>
		<Title>Laga ny bokning: {dateString}</Title>
		<NewBookingWrapper>
			<TimeRangePicker
	          onChange={setTime}
	          value={time}
	          disableClock={true}
	          maxDetail={"minute"}
	          locale={"nb-NO"}
	          required={true}
	        />
			<button onClick={() => makeNewBooking(chosenDate, time, setBookings)}>
				Boke
			</button>
		</NewBookingWrapper>
	</Wrapper>)
}

export default NewBooking