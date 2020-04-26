import { hourAndMinuteToMinuteOfDay, dateToString } from '../utils/utils'

export const getBookings = async (date) => {
		const url = `/get_bookings_for_date_request?date=${date}`
		return getJSON(url)
}

export const makeBooking = async (date, fromTo) => {
	const dateString = dateToString(date)
	const from = hourAndMinuteToMinuteOfDay(fromTo[0])
	const to = hourAndMinuteToMinuteOfDay(fromTo[1])
	const data = { date: dateString, from_timestamp: from, to_timestamp: to }
	return await postJSON('/insert_booking_request', data)
}

const postJSON = async (url, data) => {
	const token = getToken()
	const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/javascript',
    },
    body: JSON.stringify(data)
  });
	if (!response.ok) {
    throw new Error('Network response was not ok');
  }	
	return response.json();
}

const getJSON = async (url) => {
	const token = getToken()
	const response = await fetch(url, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Authorization': `Bearer ${token}`
    },
  });
	if (!response.ok) {
    throw new Error('Network response was not ok');
  }	
	return response.json();
}


const getToken = () => {
	const token = localStorage.getItem('token')
	if(!token) {
		throw new Error("Localstorage item token not found, have you logged in?")
	}

	return token
}