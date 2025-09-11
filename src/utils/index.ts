export function getFormattedDate(
  timeStamp: number,
  checkFormatted: boolean = false,
  needTime: boolean = false
) {
  const date = new Date(timeStamp);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  if (needTime) {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }
  return checkFormatted ? `${year}-${month}-${day}` : `${day}/${month}/${year}`;
}

export function getTimestamp(value: string) {
  const date = new Date(value);
  return date.getTime();
}

export function convertTo24Hour(time12h: string): string {
  const [time, modifier] = time12h.trim().split(" ");
  if (!time || !modifier) return time12h;

  const [h, m] = time.split(":").map(Number);
  let hours = h;
  const minutes = m;

  if (modifier.toLowerCase() === "pm" && hours < 12) hours += 12;
  if (modifier.toLowerCase() === "am" && hours === 12) hours = 0;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export function getTaskStatus(
  dueDate: number,
  dueTime: string
): "Upcoming" | "Completed" {
  const [hours, minutes] = dueTime.split(":").map(Number);

  const dueDateTime = new Date(dueDate);
  dueDateTime.setHours(hours, minutes, 0, 0);

  const now = new Date();

  return now < dueDateTime ? "Upcoming" : "Completed";
}

export const getStatusColor = (status: string) => {
  return status === "Completed"
    ? "bg-green-100 text-green-700"
    : "bg-yellow-100 text-yellow-700";
};
