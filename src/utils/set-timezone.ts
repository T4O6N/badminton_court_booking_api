import * as moment from 'moment-timezone';
import { ISetVientianeTimezone } from 'src/interfaces/timezone.interface';

function setTimezone(timeParam: moment.Moment, timezoneParam: string = 'Asia/Bangkok'): moment.Moment {
    return timeParam.tz(timezoneParam);
}

function setVientianeTimezone(nowDate: Date): ISetVientianeTimezone {
    const currentDateLocal = moment(nowDate.toISOString());
    // get local timezone if timezone is equal to Asia/Bangkok or Asia/Vientiane
    if (currentDateLocal.tz() === 'Asia/Bangkok' || currentDateLocal.tz() === 'Asia/Vientiane') {
        const vtTimezone = currentDateLocal.tz();
        return {
            day: currentDateLocal.date(),
            month: currentDateLocal.month() + 1,
            year: currentDateLocal.year(),
            time: currentDateLocal.format('HH:mm:ss'),
            fullDate: vtTimezone,
        };
    } else {
        const currentTimezoneOffsetInMinutes = new Date().getTimezoneOffset();
        const currentTimezoneOffsetInHours = -currentTimezoneOffsetInMinutes / 60;

        const currentDateTimeZone = currentDateLocal.utcOffset(currentTimezoneOffsetInHours).format();

        const vtTimezone = moment().tz(currentDateTimeZone).tz('Asia/Bangkok').format();
        console.log('it work');
        console.log(vtTimezone);

        return {
            day: moment().tz(vtTimezone).date(),
            month: moment().tz(vtTimezone).month() + 1,
            year: moment().tz(vtTimezone).year(),
            time: moment().tz(vtTimezone).format('HH:mm:ss'),
            fullDate: vtTimezone,
        };
    }
}

function setExpireTime(): Date {
    const expireTime = new Date();
    expireTime.setMinutes(expireTime.getMinutes() + 3);
    return expireTime;
}

export { setTimezone, setExpireTime, setVientianeTimezone };
