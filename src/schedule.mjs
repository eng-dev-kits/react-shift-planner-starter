export const MINUTES_IN_DAY = 24 * 60;
export const KINDS = ['day', 'late', 'training'];
export function localDateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
}
export function isDateKey(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const d = new Date(year, month-1, day, 12, 0, 0);
  return year >= 1900 && year <= 2200 && localDateKey(d) === value;
}
export function dateFromKey(key) {
  if (!isDateKey(key)) throw new Error('Invalid calendar date');
  const [y,m,d] = key.split('-').map(Number);
  return new Date(y,m-1,d,12,0,0);
}
export function addDays(key, offset) {
  const d = dateFromKey(key);
  d.setDate(d.getDate()+offset);
  return localDateKey(d);
}
export function mondayOf(key) {
  const d = dateFromKey(key);
  const diff = (d.getDay()+6)%7;
  d.setDate(d.getDate()-diff);
  return localDateKey(d);
}
export function weekdays(monday) {
  const start = mondayOf(monday);
  return Array.from({length:7}, (_,i)=>addDays(start,i));
}
export function timeToMinutes(time) {
  if (typeof time !== 'string' || !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(time)) throw new Error('Time must be HH:MM (24-hour)');
  const [h,m]=time.split(':').map(Number);
  return h*60+m;
}
export function shiftDuration(shift) {
  return timeToMinutes(shift.end)-timeToMinutes(shift.start);
}
export function validateShift(value, employees = []) {
  if (!value || typeof value !== 'object') return 'Shift is required';
  if (!employees.some(e=>e.id===value.employeeId)) return 'Choose a valid team member';
  if (!isDateKey(value.date)) return 'Choose a valid date';
  if (!KINDS.includes(value.kind)) return 'Choose a valid shift type';
  try {
    const start = timeToMinutes(value.start);
    const end = timeToMinutes(value.end);
    if (end<=start) return 'End time must be later than start time';
    if (start%15!==0 || end%15!==0) return 'Use 15-minute increments';
  } catch(err) { return err.message; }
  if (typeof value.note === 'string' && value.note.length>120) return 'Notes must be 120 characters or less';
  return null;
}
export function weeklyMinutes(shifts, monday, employeeId = null) {
  const days = new Set(weekdays(monday));
  return shifts.filter(s=>days.has(s.date) && (!employeeId || s.employeeId===employeeId))
    .reduce((sum,shift)=>sum+Math.max(0,shiftDuration(shift)),0);
}
export function seedDemo(reference = new Date()) {
  const monday = mondayOf(localDateKey(reference));
  const employees = [
    {id:'person_1', name:'Alex Morgan', role:'Operations', initials:'AM', color:'indigo'},
    {id:'person_2', name:'Jamie Chen', role:'Field team', initials:'JC', color:'mint'},
    {id:'person_3', name:'Sam Taylor', role:'Field team', initials:'ST', color:'rose'},
    {id:'person_4', name:'Robin Lee', role:'Support', initials:'RL', color:'amber'},
    {id:'person_5', name:'Charlie Fox', role:'Support', initials:'CF', color:'sky'},
  ];
  const shifts=[];
  let id=1;
  employees.forEach((person, pi) => {
    for (let day=0; day<5; day++) {
      if ((pi===2 && day===3) || (pi===4 && day===1)) continue;
      const kind = pi===3 && day>=2 ? 'late' : pi===4 && day===4 ? 'training' : 'day';
      const [start,end] = kind==='late' ? ['12:00','20:00'] : kind==='training'?['09:00','13:00']:['08:00','16:00'];
      shifts.push({id:`demo_${id++}`, employeeId:person.id, date:addDays(monday,day),start,end,kind,note:''});
    }
  });
  return {version:1,employees,shifts};
}
export function deserializeState(json) {
  try {
    const data = JSON.parse(json);
    if (data.version!==1 || !Array.isArray(data.employees) || !Array.isArray(data.shifts)) return null;
    if (data.employees.length>150 || data.shifts.length>4000) return null;
    if (data.employees.some(e=>typeof e.id!=='string' || typeof e.name!=='string' || e.name.length>80 || e.id.length>100)) return null;
    if (data.shifts.some(s=>typeof s.id!=='string' || validateShift(s,data.employees))) return null;
    return data;
  } catch { return null; }
}
