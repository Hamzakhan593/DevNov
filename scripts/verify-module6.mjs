import { existsSync, readFileSync } from 'node:fs';
let errors = 0;
const check=(ok,label)=>{ console.log((ok?'PASS: ':'FAIL: ')+label); if(!ok)errors++; };
const app=readFileSync('src/App.jsx','utf8');
check(existsSync('src/components/sections/FAQ.jsx'), 'src/components/sections/FAQ.jsx');
check(existsSync('src/components/sections/Team.jsx'), 'src/components/sections/Team.jsx');
check(existsSync('scripts/manage-team.mjs'), 'scripts/manage-team.mjs');
check(existsSync('src/data/team.json'), 'src/data/team.json');
check(existsSync('TEAM-GUIDE.md'), 'TEAM-GUIDE.md');
check(app.includes('<FAQ />'), 'Mounted FAQ');
check(app.includes('<Team />'), 'Mounted Team');
const people=JSON.parse(readFileSync('src/data/team.json','utf8')); check(Array.isArray(people),'Managed team store is an array');
for(const person of people){check(Boolean(person.id&&person.name&&person.role),`Team entry required fields ${person.id}`);check(!person.published || person.permissionGranted,`Approved team publication ${person.id}`);}
if(errors) process.exit(1);
console.log('PASS: Module 06 verification complete.');