import { parse } from 'date-fns';

export function parseDurationTime(durationTime: string): { start: Date; end: Date } {
    const [startTime, endTime] = durationTime.split(' - ');

    const today = new Date();
    const start = parse(startTime, 'h:mm a', today);
    const end = parse(endTime, 'h:mm a', today);

    return { start, end };
}

export function isCurrentTimeWithinDuration(start: Date, end: Date): boolean {
    const now = new Date();
    return now >= start && now <= end;
}
