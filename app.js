'use strict';
const poems = {
 en: `You open like a flower\nwhen the air is warm enough,\nunfolding, little by little,\nthe colours you hold within.\n\nThere is music in that opening:\na thought becoming words,\na quiet moment filling\nwith songs only you could write.\n\nYour kindness reaches outward\nlike roots beneath the ground,\nfinding what a heart might need\nbefore it finds the words.\n\nYou give my worries room to settle,\ngive my tangled thoughts your time;\nin the simple way you listen,\nI can feel that I matter.\n\nAnd there is beauty in your petals,\nin the way you meet the light,\nin the care you give so freely\nand the warmth you leave behind.\n\nI hope some of that warmth returns\nand finds you when you need it.\nThere is a little more spring in my days\nbecause I have you.`,
 it: `Ti schiudi come un fiore\nquando l’aria si fa mite,\nsvelando, a poco a poco,\ni colori che custodisci.\n\nC’è musica in quello schiudersi:\nun pensiero che diventa parola,\nun momento di silenzio che si riempie\ndi canzoni che solo tu potresti scrivere.\n\nLa tua gentilezza si fa strada\ncome radici sotto terra,\ntrovando ciò che serve a un cuore\nprima che trovi le parole.\n\nDai spazio alle mie preoccupazioni,\ndedichi tempo ai miei pensieri intrecciati;\nnel tuo semplice modo di ascoltare\nsento di contare per te.\n\nE c’è bellezza nei tuoi petali,\nnel tuo volgerti alla luce,\nnella cura che doni con naturalezza\ne nel calore che lasci.\n\nSpero che un po’ di quel calore ritorni\ne ti raggiunga quando ne hai bisogno.\nC’è un po’ più di primavera nei miei giorni\nperché ci sei tu.`
};
const puzzle = '530070000600195000098000060800060003400803001700020006060000280000419005000080079';
const storageKey = 'little-spring-garden-v1';
let state = {solved:[false,false,false,false],cells:{},unlocked:false,lang:'en'};
try {
 const saved = JSON.parse(localStorage.getItem(storageKey));
 if(saved && Array.isArray(saved.solved) && saved.solved.length === 4){
 state.solved=saved.solved.map(v=>v===true);state.unlocked=saved.unlocked===true&&state.solved.every(Boolean);
 state.lang=saved.lang==='it'?'it':'en';
 if(saved.cells&&typeof saved.cells==='object') for(const [i,v] of Object.entries(saved.cells)) if(/^\d+$/.test(i)&&+i<81&&puzzle[+i]==='0'&&/^[1-9]$/.test(v)) state.cells[i]=v;
 }
} catch {}
function save(){try{localStorage.setItem(storageKey,JSON.stringify(state));}catch{}}
const letters=['I','R','I','S'];
const explanations=[
 'Exactly. Interstellar → I. Your first letter is yours.',
 'Yes. 18 has divisors 1, 2, 3, 6, 9, 18, and 18 ÷ 2 = 9 = 3². The smaller candidates 2 and 8 have only 2 and 4 divisors. 18 → R.',
 'That’s it. The pink square holds 9. The ninth letter is I.',
 'Yes. Walking beside someone, at their pace, is support. Support → S.'
];
function feedback(id,text,error=false){const el=document.getElementById(id);el.textContent=text;el.classList.toggle('error',error);}
function renderProgress(){
 document.querySelectorAll('.slot').forEach((slot,i)=>{slot.textContent=state.solved[i]?letters[i]:'·';slot.classList.toggle('found',state.solved[i]);slot.setAttribute('aria-label',`Clue ${i+1}: ${state.solved[i]?letters[i]:'not solved'}`);});
 document.getElementById('progress-text').textContent=`${state.solved.filter(Boolean).length} of 4 discoveries`;
 document.querySelectorAll('[data-card]').forEach((card,i)=>{card.querySelector('.indicator').textContent=state.solved[i]?'✓':'+';if(state.solved[i])feedback(`feedback-${i}`,explanations[i]);});
}
function solve(i){state.solved[i]=true;save();renderProgress();}
for (const [lang,text] of Object.entries(poems)) {
 const container=document.getElementById(`poem-${lang}`);
 for(const stanza of text.split('\n\n')){
 const p=document.createElement('p');stanza.split('\n').forEach((line,i)=>{if(i)p.append(document.createElement('br'));p.append(document.createTextNode(line));});container.append(p);
 }
}
function setLanguage(lang){
 state.lang=lang;document.getElementById('poem-en').hidden=lang!=='en';document.getElementById('poem-it').hidden=lang!=='it';document.getElementById('poem-title').textContent=lang==='it'?'Dove fiorisci':'Where You Bloom';document.getElementById('poem-title').lang=lang;
 document.querySelectorAll('[data-lang]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.lang===lang)));save();
}
for(let i=0;i<81;i++){
 const given=puzzle[i]!=='0';const cell=document.createElement(given?'span':'input');cell.className=`cell${given?'':' edit'}${i===6?' target':''}`;
 const label=`Row ${Math.floor(i/9)+1}, column ${i%9+1}${i===6?', pink target square':''}`;
 if(given){cell.textContent=puzzle[i];cell.setAttribute('aria-label',`${label}: ${puzzle[i]}`);}else{
 cell.inputMode='numeric';cell.maxLength=1;cell.autocomplete='off';cell.setAttribute('aria-label',label);cell.value=state.cells[i]||'';
 cell.addEventListener('input',()=>{cell.value=cell.value.replace(/[^1-9]/g,'').slice(-1);if(cell.value)state.cells[i]=cell.value;else delete state.cells[i];if(i===6)document.getElementById('sudoku-answer').value=cell.value;save();});
 cell.addEventListener('keydown',event=>{const offset={ArrowLeft:-1,ArrowRight:1,ArrowUp:-9,ArrowDown:9}[event.key];if(offset){let target=i+offset;while(target>=0&&target<81&&puzzle[target]!=='0')target+=offset;if(target>=0&&target<81){event.preventDefault();document.getElementById('sudoku').children[target].focus();}}});
 }document.getElementById('sudoku').append(cell);
}
document.querySelectorAll('[data-form]').forEach(form=>form.addEventListener('submit',event=>{
 event.preventDefault();const i=Number(form.dataset.form);const value=form.querySelector('input').value.trim().toLowerCase().replace(/\s+/g,' ');
 const correct=i===0?['interstellar','intersteller'].includes(value):i===1?Number(value)===18:Number(value)===9;
 if(correct)solve(i);else feedback(`feedback-${i}`,['Not quite. Think of Cooper and Murph’s journey.','Not quite. Check both conditions, including the number of divisors.','Not quite. Try checking the top-right box again.'][i],true);
}));
document.querySelectorAll('[data-theme]').forEach(button=>button.addEventListener('click',()=>{if(button.dataset.theme==='Support')solve(3);else feedback('feedback-3','Look at what the speaker offers: companionship when the road gets difficult.',true);}));
function reveal(scroll){const poem=document.getElementById('poem');poem.hidden=false;poem.classList.add('revealed');document.getElementById('unlock').hidden=true;if(scroll)requestAnimationFrame(()=>poem.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'}));}
document.getElementById('unlock-form').addEventListener('submit',event=>{
 event.preventDefault();if(!state.solved.every(Boolean)){feedback('unlock-feedback','There are still a few discoveries waiting for you above.',true);return;}
 if(document.getElementById('secret').value.trim().toLowerCase()!=='iris'){feedback('unlock-feedback','Try your four letters in order, from discovery 1 to 4.',true);return;}
 state.unlocked=true;save();reveal(true);
});
document.querySelectorAll('[data-lang]').forEach(button=>button.addEventListener('click',()=>setLanguage(button.dataset.lang)));
document.getElementById('reset').addEventListener('click',()=>{
 state={solved:[false,false,false,false],cells:{},unlocked:false,lang:'en'};save();
 document.querySelectorAll('input').forEach(input=>input.value='');document.querySelectorAll('.feedback').forEach(el=>{el.textContent='';el.classList.remove('error');});document.querySelectorAll('[data-card]').forEach((el,i)=>el.open=i===0);document.getElementById('unlock').hidden=false;document.getElementById('poem').hidden=true;setLanguage('en');renderProgress();document.getElementById('discover').scrollIntoView({behavior:'smooth'});
});
renderProgress();setLanguage(state.lang);if(state.unlocked)reveal(false);

