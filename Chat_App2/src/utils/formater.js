import moment from "moment-timezone";

export const getTimeFromTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const time = date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  return time
}

export const isSameDay = (time1, time2) => {
  if (!time1 || !time2 || isNaN(new Date(time1)) || isNaN(new Date(time2))) return ''
  const convertToDate = (date) => {
    return new Date(
      new Date(date).toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })
    )
      .toISOString()
      .split("T")[0];
  };
  return convertToDate(new Date(time1)) === convertToDate(new Date(time2));
};

export const getDateParts = (timeString) => {
  const date = new Date(timeString);

  const year = date.getFullYear();
  const monthIndex = date.getMonth();
  const day = date.getDate();

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const month = months[monthIndex];

  return `${day} ${month}, ${year}`;
}


export const timeAgo = (timestamp) => {
  const now = moment().tz("Asia/Ho_Chi_Minh");
  const date = moment.utc(timestamp).tz("Asia/Ho_Chi_Minh");
  const diffInMinutes = now.diff(date, "minutes");
  if (diffInMinutes < 60) {
    if (diffInMinutes < 1) {
      return "1m";
    }
    return `${diffInMinutes}m`;
  }

  const diffInHours = now.diff(date, "hours");
  if (diffInHours < 24) return `${diffInHours}h`;

  const diffInDays = now.diff(date, "days");
  if (diffInDays < 30) return `${diffInDays}d`;

  const diffInMonths = now.diff(date, "months");
  if (diffInMonths < 12) return `${diffInMonths}mo`;

  return `${now.diff(date, "years")}y`;
};