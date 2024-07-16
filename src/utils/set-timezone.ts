import * as moment from 'moment-timezone';
import { ISetVientianeTimezone } from 'src/interfaces/timezone.interface';

function setTimezone(timeParam: moment.Moment, timezoneParam: string = 'Asia/Bangkok'): moment.Moment {
    return timeParam.tz(timezoneParam);
}

function setVientianeTimezone(nowDate: Date): ISetVientianeTimezone {
    const currentDateLocal = moment(nowDate).tz('Asia/Vientiane');
    return {
        day: currentDateLocal.date(),
        month: currentDateLocal.month() + 1,
        year: currentDateLocal.year(),
        time: currentDateLocal.format('HH:mm:ss'),
        fullDate: currentDateLocal.format(),
    };
}

function setExpireTime(): Date {
    const expireTime = new Date();
    expireTime.setMinutes(expireTime.getMinutes() + 3);
    return expireTime;
}

export { setTimezone, setExpireTime, setVientianeTimezone };
