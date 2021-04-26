interface IPeriod {
    startTime: Date;
    endTime: Date;
    mondayAvailable: boolean;
    tuesdayAvailable: boolean;
    wednesdayAvailable: boolean;
    thursdayAvailable: boolean;
    fridayAvailable: boolean;
    saturdayAvailable: boolean;
    sundayAvailable: boolean;
    validTo: Date;
    name: String;
}

export default IPeriod;