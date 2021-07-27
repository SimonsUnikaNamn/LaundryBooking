import React, { useState } from 'react';
import styled from 'styled-components';
import { dateToString, hourAndMinuteToMinuteOfDay } from '../../utils/utils'
import { makeBooking } from '../../services/bookings'
import loadingStore from '../../stores/loading/loading'
import { useAuth0 } from "../../react-auth0-spa";

const Title = styled.h3``
const Wrapper = styled.div`
    border-top: 1px solid gray;
`

const FormWrapper = styled.form`
	display: flex;
	flex-direction: column
`
const TimePickWrapper = styled.div`
	display: flex;
	flex-direction: row;
	margin-bottom: 10px;
`
const TimePick = styled.input``
const TimePickLabel = styled.label``
const TimeLabelWrapper = styled.div`
	display: flex;
	flex-direction: column;
	margin-right: 20px;
`
const NewBookingButton = styled.button``


const makeNewBooking = async (chosenDate, time, setBookings, setLoading, user) => {
	try {
		const from = hourAndMinuteToMinuteOfDay(time[0])
		const to = hourAndMinuteToMinuteOfDay(time[1])
		if (from >= to) {
			alert('"Fra" tidspunkt må ikke være før "Til" tidspunkt')
			return
		}
		if (to - from > 60 * 4 && !window.confirm("Denne bookingen er på over 4 timer. Er du sikker på valg av timer?")) {
			return
		}
		setLoading(true)
		const result = await makeBooking(chosenDate, from, to, user.email || "")	
		setBookings(result)
	} catch(error) {
		throw error
	} finally {
		setLoading(false)
	}
}

const NewBooking = ({ chosenDate, setBookings }) => {
  	const setLoading = loadingStore(state => state.setLoading)
  	const { user } = useAuth0();

	const [fromTime, setFromTime] = useState('16:00');
	const [toTime, setToTime] = useState('19:00');
	const dateString = dateToString(chosenDate)
	return (<Wrapper>
		<Title>Lag ny booking for {dateString}</Title>
		<FormWrapper
			onSubmit={(e) => {
				e.preventDefault()
				makeNewBooking(chosenDate, [fromTime, toTime], setBookings, setLoading, user)
			}}
		>
			<TimePickWrapper>
				<TimeLabelWrapper>
					<TimePickLabel htmlFor="from">Fra</TimePickLabel>
					<TimePick 
						type="time"
						id="from"
						name="from"
						value={fromTime}
						min="00:00"
						max="23:59"
						onChange={(e) => setFromTime(e.target.value)}
						required />
				</TimeLabelWrapper>

				<TimeLabelWrapper>
					<TimePickLabel htmlFor="to">Til</TimePickLabel>
					<TimePick 
						type="time"
						id="to"
						name="to"
						value={toTime}
						min="00:00"
						max="23:59"
						onChange={(e) => setToTime(e.target.value)}
						required />
				</TimeLabelWrapper>
			</TimePickWrapper>
			<NewBookingButton 
				type="submit"
			>
				Booke
			</NewBookingButton>
		</FormWrapper>
	</Wrapper>)
}

export default NewBooking