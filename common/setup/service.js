//Creates timestamp with day offset
module.exports = {
    //Creates randomNum between min and max values
    randomNum: function (min, max) {
        if (min == null)
            min = 1;
        if (max == null)
            max = 1;

        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    resArrayLength: function (element) {
        return element.length
    },

    createTimestamp: function (dayOffset) {
        if (dayOffset == null)
            dayOffset = 0;
        var adjustedDate = new Date();
        var millisecOffset = dayOffset * 24 * 60 * 60 * 1000;
        adjustedDate.setTime(adjustedDate.getTime() + millisecOffset);
        adjustedDate.setMilliseconds(0);
        var unixTime = adjustedDate.valueOf();
        var adjustedMon = adjustedDate.getMonth();
        var adjustedDay = adjustedDate.getDate();
        var adjustedYear = adjustedDate.getFullYear();
        var monStr = "";
        var dayStr = "";
        var yearStr = adjustedYear.toString();
        var hourStr = adjustedDate.getHours();
        var minStr = adjustedDate.getMinutes();
        var secStr = adjustedDate.getSeconds();
        var fractionalSecStr = adjustedDate.getMilliseconds();

        //Logic to get month
        switch (adjustedMon) {
            case 0:
                monStr = "01";
                break;
            case 1:
                monStr = "02";
                break;
            case 2:
                monStr = "03";
                break;
            case 3:
                monStr = "04";
                break;
            case 4:
                monStr = "05";
                break;
            case 5:
                monStr = "06";
                break;
            case 6:
                monStr = "07";
                break;
            case 7:
                monStr = "08";
                break;
            case 8:
                monStr = "09";
                break;
            case 9:
                monStr = "10";
                break;
            case 10:
                monStr = "11";
                break;
            case 11:
                monStr = "12";
                break;
        }

        //Logic to get day
        if (adjustedDay < 10)
            dayStr = "0" + adjustedDay;
        else
            dayStr = adjustedDay.toString();

        //Logic to get hour
        if (hourStr < 10)
            hourStr = "0" + hourStr;
        else
            hourStr = hourStr.toString();

        //Logic to get minute	
        if (minStr < 10)
            minStr = "0" + minStr;
        else
            minStr = minStr.toString();

        //Logic to get second
        if (secStr < 10)
            secStr = "0" + secStr;
        else
            secStr = secStr.toString();

        //Logic to get fractional seconds
        if (fractionalSecStr < 10)
            fractionalSecStr = fractionalSecStr + "00";
        else if (fractionalSecStr < 100)
            fractionalSecStr = fractionalSecStr + "0";

        var shortAdjDateStr = yearStr + "-" + monStr + "-" + dayStr + "T" + hourStr + ":" + minStr + ":" + secStr + "." + fractionalSecStr + "Z";

        return shortAdjDateStr;
    }
}
