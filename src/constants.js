export const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const FULL_DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
export const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export const PRIORITIES = {
  high:   { label: "High",  color: "#FF4D4D", bg: "rgba(255,77,77,0.12)"   },
  medium: { label: "Med",   color: "#FFB347", bg: "rgba(255,179,71,0.12)"  },
  low:    { label: "Low",   color: "#4DFFB4", bg: "rgba(77,255,180,0.12)"  },
};

export function getWeekDates(anchor) {
  const start = new Date(anchor);
  start.setDate(anchor.getDate() - anchor.getDay());
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

export function dateKey(d) {
  return d.toDateString();
}
