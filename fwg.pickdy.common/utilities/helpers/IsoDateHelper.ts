export class IsoDateHelper {

    /**
    * Convert time to iso date
    * @param date Date object
    */
    // change name to convert to ISODate
    public static convertIsoDate(date: Date | string | number): Date {
        if (!date) {
            return null;
        } else if (typeof date === 'string') {
            let notUtc = new Date(date),
                utc: any = new Date(Date.UTC(notUtc.getUTCFullYear(), notUtc.getUTCMonth(), notUtc.getUTCDate(),
                    notUtc.getUTCHours(), notUtc.getUTCMinutes(), notUtc.getUTCSeconds(), notUtc.getUTCMilliseconds()));
            IsoDateHelper.overrideIsoDate(utc);
            return utc;
        } else if (typeof date === 'number') {
            let utc = new Date(date);
            IsoDateHelper.overrideIsoDate(utc);
            return utc;
        }
        let result = new Date(date.getTime());
        IsoDateHelper.overrideIsoDate(result);
        return result;
    }

    /**
     * Override method of IsoDate object
     * @param isoDate
     */
    public static overrideIsoDate(isoDate: Date) {
        let utc: any = isoDate;
        // Overide ISO Date
        utc.isISODate = true;
        // override method 
        utc.getHours = () => {
            return utc.getUTCHours();
        }

        utc.getMinutes = () => {
            return utc.getUTCMinutes();
        }

        utc.getSeconds = () => {
            return utc.getUTCSeconds();
        }

        utc.setFullYear = (...years) => {
            utc.setUTCFullYear(...years);
        }

        utc.setMonth = (...months) => {
            utc.setUTCMonth(...months);
        }

        utc.setDate = (date) => {
            utc.setUTCDate(date);
        }

        utc.setHours = (...hours) => {
            utc.setUTCHours(...hours);
        }

        utc.setMinutes = (...minutes) => {
            utc.setUTCMinutes(...minutes);
        }

        utc.setSeconds = (...seconds) => {
            utc.setUTCSeconds(...seconds);
        }

        utc.getFullYear = () => {
            return utc.getUTCFullYear();
        }

        utc.getMonth = () => {
            return utc.getUTCMonth();
        }

        utc.getDate = () => {
            return utc.getUTCDate();
        }

        utc.getDay = () => {
            return utc.getUTCDay();
        }

        utc.toString = () => {
            return utc.toISOString();
        }
    }

    /**
     * Get current isoDate
     * set VN Time
     */
    public static getCurrentISODate(): Date {
        let currentTime = new Date();
        currentTime.setUTCHours(currentTime.getHours(), currentTime.getMinutes(), currentTime.getSeconds(), 0);
        IsoDateHelper.overrideIsoDate(currentTime);
        return currentTime;
    }

    /**
     * Get start time of iso date
     */
    public static getStartISODate(date: Date): Date {
        date.setUTCHours(0, 0, 0, 0);
        IsoDateHelper.overrideIsoDate(date);
        return date;
    }

    /**
     * Get end time of iso date
     */
    public static getEndISODate(date: Date): Date {
        date.setUTCHours(23, 59, 59, 999);
        IsoDateHelper.overrideIsoDate(date);
        return date;
    }

    /**
     * Get start time of current iso date
     */
    public static getStartCurrentISODate(): Date {
        let startTime = new Date();
        startTime.setUTCHours(0, 0, 0, 0);
        IsoDateHelper.overrideIsoDate(startTime);
        return startTime;
    }

    /**
     * Get end time of current iso date
     */
    public static getEndCurrentISODate(): Date {
        let endTime = new Date();
        endTime.setUTCHours(23, 59, 59, 999);
        IsoDateHelper.overrideIsoDate(endTime);
        return endTime;
    }

    /**
     * Convert iso date to date
     */
    public static isoDateToDate(date: Date): Date {
        let isoDate: any = date;
        if (isoDate && isoDate.isISODate) {
            let result = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
                date.getUTCHours(), date.getUTCHours(), date.getUTCSeconds(), date.getUTCMilliseconds());
            return result;
        } else {
            return null;
        }
    }
    
    /**
     * Get current IsoDate by timezone
     * @param timeZone 
     */
    public static getISODateByTimezone(timeZone: string, dateTime: Date = new Date()): Date {
        let currentTime = dateTime;
        if (timeZone) {
            let currentTime = dateTime,
                options = { timeZone: timeZone, year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false },
                formatter: any = new Intl.DateTimeFormat(['en-US'], options),
                // use local is en-GB to get timeString equal '24/05/2018, 12:34:51'
                timeString: string = formatter.format(currentTime);
            timeString = timeString.replace(' ', '');
            let dateArr: Array<number> = timeString.split(',')[0].split('/').map(item => +item),
                timeArr: Array<number> = timeString.split(',')[1].split(':').map(item => +item);

            // set Date and Time
            currentTime.setUTCFullYear(dateArr[2], dateArr[0] - 1, dateArr[1]);
            currentTime.setUTCHours(timeArr[0], timeArr[1], timeArr[2], 0);
            IsoDateHelper.overrideIsoDate(currentTime);
            return currentTime;
        }
        currentTime.setUTCHours(currentTime.getHours(), currentTime.getMinutes(), currentTime.getSeconds(), 0);
        IsoDateHelper.overrideIsoDate(currentTime);
        return currentTime;
    }

    /**
     * Check is Current date
     * @param dateOrgin 
     * @param dateDestination 
     */
    public static isCurrentDate(dateOrgin: Date, dateDestination: Date): boolean {
        if (dateOrgin && dateDestination) {
            return dateOrgin.getFullYear() === dateDestination.getFullYear()
                && dateOrgin.getMonth() === dateDestination.getMonth()
                && dateOrgin.getDate() === dateDestination.getDate();
        } else {
            return false;
        }
    }

    /**
     * Get date at local server for date at timezone
     * @param date: date at timezone 
     * @param timezone: timezone
     */
    public static convertDateFromTimezoneToLocal(date: Date, timezone: string): Date {
        let options = {
            timeZone: timezone,
            year: 'numeric', month: 'numeric', day: 'numeric',
            hour: 'numeric', minute: 'numeric', second: 'numeric',
        },
            formatter = new Intl.DateTimeFormat([], options),
            currentDateAtTimezone = formatter.format(new Date()),
            diffTime: any = new Date().getTime() - (new Date(currentDateAtTimezone)).getTime(),
            dateAtLocal = new Date(new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), 0)).getTime() + diffTime);
        return dateAtLocal;
    }


}

