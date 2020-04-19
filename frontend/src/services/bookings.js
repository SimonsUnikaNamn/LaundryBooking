export const getBookings = async (date) => {
		const url = `/get_bookings_for_date_request?date=${date}`
		return getJSON(url)
}

const getJSON = async (url) => {
	const token = getToken()
	const response = await fetch(url, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Authorization': `Bearer ${token}`,
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