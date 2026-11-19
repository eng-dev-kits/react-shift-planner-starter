// Optional React integration example. Install react/react-dom in your consuming app.
// This intentionally small example uses the same framework-independent scheduler utils.
import React, { useMemo, useState } from 'react';
import { mondayOf, localDateKey, weekdays, addDays, shiftDuration } from '../src/schedule.mjs';

export function ShiftPlanner({employees=[],shifts=[],onShiftClick=()=>{}}) {
  const [monday,setMonday]=useState(()=>mondayOf(localDateKey(new Date())));
  const days=useMemo(()=>weekdays(monday),[monday]);
  return <section aria-label="Weekly employee schedule">
    <header style={{display:'flex',gap:12,alignItems:'center',marginBottom:16}}>
      <button type="button" onClick={()=>setMonday(addDays(monday,-7))}>Previous</button>
      <strong>{monday} — {days[6]}</strong>
      <button type="button" onClick={()=>setMonday(addDays(monday,7))}>Next</button>
    </header>
    <div style={{overflowX:'auto'}}><table style={{borderCollapse:'collapse',width:'100%',minWidth:800}}>
      <thead><tr><th>Team member</th>{days.map(day=><th key={day}>{day}</th>)}</tr></thead>
      <tbody>{employees.map(person=><tr key={person.id}><th style={{textAlign:'left',padding:12}}>{person.name}</th>{days.map(day=><td key={day} style={{padding:8,border:'1px solid #ddd',verticalAlign:'top'}}>
        {shifts.filter(shift=>shift.employeeId===person.id && shift.date===day).map(shift=><button key={shift.id} type="button" onClick={()=>onShiftClick(shift)} style={{display:'block',marginBottom:5,padding:8}}>{shift.start}–{shift.end} ({Math.round(shiftDuration(shift)/60*10)/10}h)</button>)}
      </td>)}</tr>)}</tbody>
    </table></div>
  </section>
}
