import { addDays, dateFromKey, isDateKey, localDateKey, mondayOf, weekdays, validateShift, shiftDuration, weeklyMinutes, seedDemo, deserializeState } from '/schedule.mjs';

const translations = {
 en:{workspace:'Workspace',schedule:'Schedule',team:'TEAM',demoMode:'Open-source demo',localDemo:'Data stays in this browser. No account required.',operations:'TEAM OPERATIONS',heading:'Team schedule',subtitle:"A simpler way to plan your team's week.",resetDemo:'Reset demo',addMember:'Add member',newShift:'New shift',scheduledHours:'Scheduled hours',activeMembers:'Team members',plannedShifts:'Planned shifts',hours:'hours',people:'people',thisWeek:'this week',weeklyView:'Weekly overview',weeklyDescription:'Click any shift to edit. Click + to add a shift.',today:'Today',dayShift:'Day shift',lateShift:'Late shift',training:'Training',filter:'Filter:',allTeam:'All team',teamMembers:'Team member',autoSaved:'Changes are saved locally in your browser',starterEdition:'Starter edition',footer:'Independent developer starter · No external services',editSchedule:'SCHEDULE',teamMember:'Team member',date:'Date',start:'Starts at',end:'Ends at',shiftType:'Shift type',notes:'Notes (optional)',starterInfo:'Starter supports same-day shifts. Connect your own backend for production.',delete:'Delete',cancel:'Cancel',save:'Save shift',fullName:'Full name',role:'Role',shiftSaved:'Shift saved',shiftDeleted:'Shift removed',memberAdded:'Team member added',resetConfirm:'Reset all example schedule data?',resetDone:'Demo reset',deleteConfirm:'Delete this shift?',noShifts:'No shifts',newTitle:'New shift',editTitle:'Edit shift',forWeek:'for the week'},
 fr:{workspace:'Espace de travail',schedule:'Planning',team:'ÉQUIPE',demoMode:'Démo open source',localDemo:'Données enregistrées dans ce navigateur.',operations:'OPÉRATIONS ÉQUIPE',heading:'Planning de l’équipe',subtitle:'Planifiez simplement votre semaine.',resetDemo:'Réinitialiser',addMember:'Ajouter un membre',newShift:'Nouveau service',scheduledHours:'Heures planifiées',activeMembers:'Membres',plannedShifts:'Services prévus',hours:'heures',people:'personnes',thisWeek:'cette semaine',weeklyView:'Vue hebdomadaire',weeklyDescription:'Cliquez sur un service pour le modifier, ou sur + pour en ajouter un.',today:"Aujourd’hui",dayShift:'Service de jour',lateShift:'Service tardif',training:'Formation',filter:'Filtre :',allTeam:'Toute l’équipe',teamMembers:'Collaborateur',autoSaved:'Les modifications sont enregistrées dans ce navigateur',starterEdition:'Édition Starter',footer:'Modèle développeur indépendant · Sans services externes',editSchedule:'PLANNING',teamMember:'Collaborateur',date:'Date',start:'Début',end:'Fin',shiftType:'Type de service',notes:'Notes (facultatif)',starterInfo:'Starter prend en charge les services sur une journée. Branchez votre propre backend en production.',delete:'Supprimer',cancel:'Annuler',save:'Enregistrer',fullName:'Nom complet',role:'Fonction',shiftSaved:'Service enregistré',shiftDeleted:'Service supprimé',memberAdded:'Membre ajouté',resetConfirm:'Réinitialiser le planning de démonstration ?',resetDone:'Démo réinitialisée',deleteConfirm:'Supprimer ce service ?',noShifts:'Aucun service',newTitle:'Nouveau service',editTitle:'Modifier le service',forWeek:'pour la semaine'},
 nl:{workspace:'Werkruimte',schedule:'Planning',team:'TEAM',demoMode:'Open-source demo',localDemo:'Gegevens blijven in deze browser.',operations:'TEAMOPERATIES',heading:'Teamplanning',subtitle:'Plan de werkweek van je team eenvoudig.',resetDemo:'Demo resetten',addMember:'Medewerker toevoegen',newShift:'Nieuwe shift',scheduledHours:'Geplande uren',activeMembers:'Teamleden',plannedShifts:'Geplande shifts',hours:'uren',people:'personen',thisWeek:'deze week',weeklyView:'Weekoverzicht',weeklyDescription:'Klik op een shift om te bewerken, of op + om er een toe te voegen.',today:'Vandaag',dayShift:'Dagshift',lateShift:'Late shift',training:'Opleiding',filter:'Filter:',allTeam:'Het hele team',teamMembers:'Medewerker',autoSaved:'Wijzigingen worden lokaal opgeslagen in je browser',starterEdition:'Starter-editie',footer:'Onafhankelijke developer starter · Geen externe diensten',editSchedule:'PLANNING',teamMember:'Medewerker',date:'Datum',start:'Begint om',end:'Eindigt om',shiftType:'Shifttype',notes:'Notities (optioneel)',starterInfo:'Starter ondersteunt shifts binnen één dag. Koppel je eigen backend voor productie.',delete:'Verwijderen',cancel:'Annuleren',save:'Shift opslaan',fullName:'Volledige naam',role:'Functie',shiftSaved:'Shift opgeslagen',shiftDeleted:'Shift verwijderd',memberAdded:'Teamlid toegevoegd',resetConfirm:'Demo planninggegevens resetten?',resetDone:'Demo gereset',deleteConfirm:'Deze shift verwijderen?',noShifts:'Geen shifts',newTitle:'Nieuwe shift',editTitle:'Shift bewerken',forWeek:'voor de week'}
};
const $ = (id) => document.getElementById(id);
const STORAGE_KEY = 'shift-planner-starter:v1';
const getStored = (key) => { try { return localStorage.getItem(key); } catch { return null; } };
const setStored = (key,value) => { try { localStorage.setItem(key,value); } catch { /* Private-browser demo only */ } };
function load(){try{return deserializeState(localStorage.getItem(STORAGE_KEY))}catch{return null}}
let state = load() || seedDemo();
let week = mondayOf(localDateKey(new Date()));
let language = ['en','fr','nl'].includes(getStored('shift-planner-language')) ? getStored('shift-planner-language') : 'en';
let filter = 'all';
let editing = null;
let toastTimeout;
const t = (key) => translations[language][key] || translations.en[key] || key;
const locale = () => ({en:'en-GB',fr:'fr-BE',nl:'nl-BE'})[language];
const escapeHTML = (x) => String(x ?? '').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
function save(){try{localStorage.setItem(STORAGE_KEY, JSON.stringify(state))}catch{notify('Local storage not available')}}
function notify(message){const el=$('toast');el.textContent=message;el.classList.add('visible');clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>el.classList.remove('visible'),2200)}
function formatDay(key){return new Intl.DateTimeFormat(locale(),{weekday:'short'}).format(dateFromKey(key))}
function formatRange(){const days=weekdays(week);return new Intl.DateTimeFormat(locale(),{day:'numeric',month:'short'}).format(dateFromKey(days[0]))+' – '+new Intl.DateTimeFormat(locale(),{day:'numeric',month:'short',year:'numeric'}).format(dateFromKey(days[6]))}
function niceHours(minutes){return (Math.round(minutes/60*10)/10).toLocaleString(locale(), {maximumFractionDigits:1})}
function renderPeople(){
 $('sidePeople').innerHTML=state.employees.map(p=>`<div class="side-person"><span class="mini-avatar ${escapeHTML(p.color || 'indigo')}">${escapeHTML(p.initials || '?')}</span><span>${escapeHTML(p.name)}</span></div>`).join('');
 $('shiftPerson').innerHTML=state.employees.map(p=>`<option value="${escapeHTML(p.id)}">${escapeHTML(p.name)}</option>`).join('');
 const previous=filter;
 $('filter').innerHTML=`<option value="all">${escapeHTML(t('allTeam'))}</option>`+state.employees.map(p=>`<option value="${escapeHTML(p.id)}">${escapeHTML(p.name)}</option>`).join('');
 filter=previous==='all'||state.employees.some(p=>p.id===previous)?previous:'all';$('filter').value=filter;
}
function applyLanguage(){
 document.documentElement.lang=language;
 document.querySelectorAll('[data-i18n]').forEach(node=>{node.textContent=t(node.dataset.i18n)});
 $('shiftKind').querySelector('[value="day"]').textContent=t('dayShift');
 $('shiftKind').querySelector('[value="late"]').textContent=t('lateShift');
 $('shiftKind').querySelector('[value="training"]').textContent=t('training');
 $('lang').value=language;
}
function render(){
 applyLanguage();renderPeople();
 const days=weekdays(week),today=localDateKey(new Date());
 days.forEach((key,index)=>{$('d'+index).classList.toggle('is-today',key===today);$('d'+index).innerHTML=`<span>${escapeHTML(formatDay(key))}</span><span class="number">${dateFromKey(key).getDate()}</span>`});
 $('weekRange').textContent=formatRange();
 const weekSet=new Set(days);const weekShifts=state.shifts.filter(s=>weekSet.has(s.date) && (filter==='all'||s.employeeId===filter));
 const members=state.employees.filter(p=>filter==='all'||p.id===filter);
 $('statHours').textContent=niceHours(weekShifts.reduce((sum,s)=>sum+shiftDuration(s),0));
 $('statMembers').textContent=members.length;
 $('statShifts').textContent=weekShifts.length;
 $('calendarBody').innerHTML=members.map(p=>`<tr><td class="member-cell"><div class="member-row"><span class="person-avatar ${escapeHTML(p.color||'indigo')}">${escapeHTML(p.initials||'?')}</span><div><strong>${escapeHTML(p.name)}</strong><small>${escapeHTML(p.role||'Team')}</small></div></div></td>${days.map(key=>{
  const shifts=weekShifts.filter(s=>s.employeeId===p.id&&s.date===key).sort((a,b)=>a.start.localeCompare(b.start));
  return `<td class="cell-slot">${shifts.map(s=>`<button type="button" class="shift-chip ${escapeHTML(s.kind)}" data-shift-id="${escapeHTML(s.id)}" title="${escapeHTML(s.note||'')}"><strong>${escapeHTML(s.start)} – ${escapeHTML(s.end)}</strong><small>${escapeHTML(t(s.kind==='day'?'dayShift':s.kind==='late'?'lateShift':'training'))}</small></button>`).join('')}<button type="button" class="add-inline" aria-label="Add shift" data-person-id="${escapeHTML(p.id)}" data-date="${key}">+</button></td>`
 }).join('')}</tr>`).join('');
}
function openShift(id=null,personId=null,date=null){
 editing=id;
 const existing=id?state.shifts.find(s=>s.id===id):null;
 $('shiftDialogTitle').textContent=existing?t('editTitle'):t('newTitle');
 $('shiftPerson').value=existing?.employeeId||personId||state.employees[0]?.id||'';
 $('shiftDate').value=existing?.date||date||localDateKey(new Date());
 $('shiftStart').value=existing?.start||'08:00';$('shiftEnd').value=existing?.end||'16:00';
 $('shiftKind').value=existing?.kind||'day';$('shiftNote').value=existing?.note||'';
 $('shiftError').hidden=true;$('deleteShift').hidden=!existing;
 $('shiftDialog').showModal();
}
function handleSaveShift(event){
 event.preventDefault();
 const shift={id:editing||`shift_${Date.now()}_${Math.random().toString(36).slice(2,8)}`,employeeId:$('shiftPerson').value,date:$('shiftDate').value,start:$('shiftStart').value,end:$('shiftEnd').value,kind:$('shiftKind').value,note:$('shiftNote').value.trim()};
 const error=validateShift(shift,state.employees);
 if(error){$('shiftError').textContent=error;$('shiftError').hidden=false;return;}
 if(editing){state.shifts=state.shifts.map(s=>s.id===editing?shift:s)}else{state.shifts.push(shift)}
 save();week=mondayOf(shift.date);render();$('shiftDialog').close();notify(t('shiftSaved'));
}
function addMember(event){
 event.preventDefault();
 const name=$('memberName').value.trim(),role=$('memberRole').value.trim()||'Team';
 if(name.length<2 || name.length>80 || state.employees.length>=150){$('memberError').textContent='Enter a name (2–80 characters; up to 150 members).';$('memberError').hidden=false;return}
 const colors=['indigo','mint','rose','amber','sky'];
 const initials=name.split(/\s+/).slice(0,2).map(s=>s[0].toUpperCase()).join('');
 state.employees.push({id:`person_${Date.now()}_${Math.random().toString(36).slice(2,6)}`,name,role:role.slice(0,60),initials,color:colors[state.employees.length%colors.length]});
 save();render();$('memberDialog').close();notify(t('memberAdded'));
}
$('calendarBody').addEventListener('click',event=>{
 const shiftButton=event.target.closest('button[data-shift-id]');
 if(shiftButton){openShift(shiftButton.dataset.shiftId);return}
 const addButton=event.target.closest('button[data-person-id]');
 if(addButton){openShift(null,addButton.dataset.personId,addButton.dataset.date)}
});
$('shiftForm').addEventListener('submit',handleSaveShift);
$('memberForm').addEventListener('submit',addMember);
$('addShift').addEventListener('click',()=>openShift());
$('addEmployee').addEventListener('click',()=>{$('memberForm').reset();$('memberError').hidden=true;$('memberDialog').showModal()});
$('closeShift').addEventListener('click',()=>$('shiftDialog').close());
$('cancelShift').addEventListener('click',()=>$('shiftDialog').close());
$('closeMember').addEventListener('click',()=>$('memberDialog').close());
$('cancelMember').addEventListener('click',()=>$('memberDialog').close());
$('deleteShift').addEventListener('click',()=>{
 if(!editing||!confirm(t('deleteConfirm')))return;
 state.shifts=state.shifts.filter(s=>s.id!==editing);editing=null;save();render();$('shiftDialog').close();notify(t('shiftDeleted'));
});
$('previousWeek').addEventListener('click',()=>{week=addDays(week,-7);render()});
$('nextWeek').addEventListener('click',()=>{week=addDays(week,7);render()});
$('today').addEventListener('click',()=>{week=mondayOf(localDateKey(new Date()));render()});
$('reset').addEventListener('click',()=>{if(confirm(t('resetConfirm'))){state=seedDemo();week=mondayOf(localDateKey(new Date()));filter='all';save();render();notify(t('resetDone'))}});
$('lang').addEventListener('change',event=>{language=event.target.value;setStored('shift-planner-language',language);render()});
$('filter').addEventListener('change',event=>{filter=event.target.value;render()});
$('themeToggle').addEventListener('click',()=>{document.body.classList.toggle('dark');setStored('shift-planner-theme',document.body.classList.contains('dark')?'dark':'light');$('themeToggle').textContent=document.body.classList.contains('dark')?'☀':'☾'});
if(getStored('shift-planner-theme')==='dark'){document.body.classList.add('dark');$('themeToggle').textContent='☀'}
render();
