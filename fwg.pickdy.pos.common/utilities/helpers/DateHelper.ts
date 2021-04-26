import Constants from "../../../fwg.pickdy.pos.common/base/Constants";
let util = require('util');
export default class DateUtils {
    /**
     * Get timestamp from date time
     * @param dateTime
     */
    public static dateTimeToTimeStamp(dateTime: Date):number{
        return Math.floor(dateTime.getTime()/1000 || 0);
    }
    /**
     * get the day of the year of a date
     * @param date 
     */
    public static getDayOfYear(date: Date): number {
        let firstDateOfYear: Date = new Date(date.getFullYear(), 0, 0, 12, 0, 0),
            currentDate: Date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0),
            magicNumber: number = 1 * 24 * 60 * 60 * 1000;
        return (currentDate.getTime() - firstDateOfYear.getTime()) / magicNumber;
    }

    /**
        * convert date time format with day ordinal(ex: Tuesday, 25th July 2017)
        * @param dt Date object
        */
       public static convertFormatShortDateWithDayOrdinal(dateFormat: Date) {
        if (dateFormat) {
            let dt = new Date(dateFormat.toString()),
                day = dt.getDate(),
                dayOfWeek = dt.toLocaleString(Constants.DATE_TIME.LANGUAGE_CULTURE, { weekday: "short" }),
                monthName = dt.toLocaleString(Constants.DATE_TIME.LANGUAGE_CULTURE, { month: "short" }),
                year = dt.getFullYear(),
                s = ["th", "st", "nd", "rd"],
                v = day % 100,
                strDayOrdinal = day + (s[(v - 20) % 10] || s[v] || s[0]);
            return util.format(Constants.DATE_TIME.DATE_WITH_DAY_ORDINAL_FORMAT, dayOfWeek, strDayOrdinal, monthName, year);
        } else {
            return null;
        }
    }

}

