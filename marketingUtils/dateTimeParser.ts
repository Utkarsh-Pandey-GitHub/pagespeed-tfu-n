function formatDate(date: Date | string) {
  const d = new Date(date);

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthsOfYear = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const dayOfWeek = daysOfWeek[d.getDay()];
  const day = d.getDate();
  const month = monthsOfYear[d.getMonth()];

  return `${dayOfWeek} ${day} ${month}`;
}

function formatTime(date: Date | string) {
  const d = new Date(date);
  const time = d
    .toLocaleTimeString("en-IN")
    .split(" ")[0]
    .split(":")
    .slice(0, 2)
    .join(":");
  const ampm = d.toLocaleTimeString("en-IN").split(" ")[1].toUpperCase();
  return `${time} ${ampm}`;
}

export { formatDate, formatTime };
