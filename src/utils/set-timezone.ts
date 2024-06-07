export async function setVientianeTimezone(date?: Date) {
    // NOTE - UTC time Bangkok format 01-20-2024T12:00:00+07:00 as Date()
    // Assuming currentDateUTC is a Date object in UTC
    const currentDateUTC = date ? new Date(date) : new Date();

    // Specify the target timezone offset (in minutes)
    const targetTimezoneOffset = 7 * 60; // +07:00

    // Calculate the target time in milliseconds
    const targetTime = currentDateUTC.getTime() + targetTimezoneOffset * 60 * 1000;

    // Create a new Date object using the target time
    const currentDateInTimeZone = new Date(targetTime);

    return {
        fullDate: currentDateInTimeZone,
        time: currentDateInTimeZone.toLocaleTimeString(),
        day: currentDateInTimeZone.getDate(),
        month: currentDateInTimeZone.getMonth() + 1,
        year: currentDateInTimeZone.getFullYear(),
    };
}
