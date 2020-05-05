import { hourAndMinuteToMinuteOfDay, dateToString } from '../utils/utils'

const prefix = process.env.NODE_ENV === 'production' ? 'https://us-central1-wash-264217.cloudfunctions.net' : ''

export const getBookings = async (date) => {
		const url = `/get_bookings_for_date_request?date=${date}`
		return getJSON(url)
}

export const deleteBooking = async (date, bookingId) => {
	const dateString = dateToString(date)
	const url = `/delete_booking_request`
	const data = { date: dateString, id: bookingId }
	return deleteJSON(url, data)
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
	const response = await fetch(prefix + url, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
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
	const response = await fetch(prefix + url, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/javascript',
    },
  });
	if (!response.ok) {
    throw new Error('Network response was not ok');
  }	
	return response.json();
}

const deleteJSON = async (url, data) => {
	const token = getToken()
	const response = await fetch(prefix + url, {
    method: 'DELETE',
    mode: 'cors',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
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