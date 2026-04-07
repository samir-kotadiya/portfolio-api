import { DateTime } from "luxon";
import { MARKET_TIMEZONE, MARKET_OPEN_HOUR, MARKET_OPEN_MINUTE, MARKET_CLOSE_HOUR, MARKET_CLOSE_MINUTE } from "../../config/constants.js";

export function getExecutionTime(now: Date): Date {

    const current = DateTime.fromJSDate(now).setZone(MARKET_TIMEZONE);

    const open = current.set({
        hour: MARKET_OPEN_HOUR,
        minute: MARKET_OPEN_MINUTE,
        second: 0,
        millisecond: 0
    });

    const close = current.set({
        hour: MARKET_CLOSE_HOUR,
        minute: MARKET_CLOSE_MINUTE,
        second: 0,
        millisecond: 0
    });

    const day = current.weekday; // 1 = Monday

    // for weekend get monday start time
    if (day === 6 || day === 7) {
        return nextMonday(current).toJSDate();
    }

    if (current < open) return open.toJSDate();

    if (current > close) {
        return current.plus({ days: 1 })
            .set({
                hour: MARKET_OPEN_HOUR,
                minute: MARKET_OPEN_MINUTE,
                second: 0,
                millisecond: 0
            })
            .toJSDate();
    }

    return current.toJSDate();
}

function nextMonday(date: DateTime) {

    let d = date;

    while (d.weekday !== 1) {
        d = d.plus({ days: 1 });
    }

    return d.set({
        hour: MARKET_OPEN_HOUR,
        minute: MARKET_OPEN_MINUTE,
        second: 0,
        millisecond: 0
    });
}

export function getLocalDateTime(executionTime: any) {
    return DateTime.fromJSDate(executionTime)
        .setZone(MARKET_TIMEZONE)
        .toFormat("yyyy-MM-dd HH:mm:ss") as string
}
