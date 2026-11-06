export const MAX_SCHEDULE_DAYS = 60;

export const getKuwaitDateString = (offsetDays = 0) => {
    const date = new Date(Date.now() + offsetDays * 24 * 60 * 60 * 1000);

    return new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Kuwait",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).format(date);
};
