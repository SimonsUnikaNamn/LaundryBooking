export const dateToString = (date) => {
	const day = twoDigit(date.getDate())
	const month = twoDigit(date.getMonth() + 1)
	return `${date.getFullYear()}-${month}-${day}`
}

const twoDigit = number => ("0" + number).slice(-2);


const minutesPerHour = 60
export const minuteOfDayToHourAndMinute = (minuteOfDay) => {
	const hour = Math.ceil(minuteOfDay/minutesPerHour)
	const minutes = minuteOfDay%minutesPerHour
	return {hour, minutes}
}

export const minuteOfDayToHourAndMinuteString = (minuteOfDay) => {
	const {hour, minutes} = minuteOfDayToHourAndMinute(minuteOfDay)
	return `${twoDigit(hour)}:${twoDigit(minutes)}`
}

export const hourAndMinuteToMinuteOfDay = (hourMinute) => {
	const splitHourMinute = hourMinute.split(':')
	const hour = parseInt(splitHourMinute[0])
	const minutes = parseInt(splitHourMinute[1])
	return hour * minutesPerHour + minutes
}