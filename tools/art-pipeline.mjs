import {readFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
export const projectRoot=resolve(import.meta.dirname,'..');
export function promptFor(card) {
 const era=['','Paleolithic: stone, bone and hide only; ochre/charcoal and winter or dawn light.','Neolithic: clay, reed, wood and stone; sage/clay light, no finished bronze equipment unless explicitly discovered in the brief.','Bronze Age: clay-brick, timber, bronze and woven textiles; bronze gold and cool teal daylight.'][card.era] ?? 'Follow the authored historical era.';
 return 'Use case: historical-scene. Original premium portrait event-card illustration for The Cards of Fate, '+card.id+'. Human conflict: '+card.description.en+' Scene: '+card.artDirection+' Era: '+era+' Cinematic painterly historical realism consistent with the existing hearth, river, granary and copper-workshop collection; natural anatomy, expressive adult faces/hands, tactile materials, restrained emotion. Portrait 2:3, comfortably framed central silhouettes readable on iPhone. Original composition. No text, readable lettering, logo, border, watermark, modern objects or copied game designs.';
}
export function composeArtManifest(cards,previous,history) {
 return cards.map(card=>{
  const old=previous.find(a=>a.id===card.artAsset)??{};
  const submitted=history.filter(p=>p.asset===card.artAsset);
  let records=old.generationRecords??[];
  if(!records.length&&old.file&&existsSync(resolve(projectRoot,old.file))&&submitted.length) records=[{
   type:'legacy-existing',tool:submitted.at(-1).tool,model:'not exposed by built-in tool',generatedAt:null,
   source:'assets/generation_prompts.json (existing prompt record)',sha256:createHash('sha256').update(readFileSync(resolve(projectRoot,old.file))).digest('hex')
  }];
  return {id:card.artAsset,cardID:card.id,status:'missing',file:null,license:null,...old,
   brief:card.artDirection,modelPrompt:submitted.at(-1)?.prompt??promptFor(card),generationRecords:records};
 });
}
export function auditArt(cards,manifest,{root=projectRoot}={}) {
 const errors=[];
 for(const card of cards){
  const a=manifest.find(a=>a.cardID===card.id);
  if(!a){errors.push(card.id+': missing manifest row');continue;}
  if(!a.brief||!a.modelPrompt||!Array.isArray(a.generationRecords))errors.push(card.id+': incomplete brief/prompt/record');
  if(a.status==='missing'){
   if(a.file)errors.push(card.id+': missing row must not claim a file');
   continue;
  }
  if(!a.file||!existsSync(resolve(root,a.file))){errors.push(card.id+': claimed file absent');continue;}
  const b=readFileSync(resolve(root,a.file));
  if(b.length<24||b.subarray(0,8).toString('hex')!=='89504e470d0a1a0a'){errors.push(card.id+': not a PNG');continue;}
  if(b.readUInt32BE(16)>=b.readUInt32BE(20))errors.push(card.id+': expected portrait art');
  if(!a.generationRecords.length)errors.push(card.id+': missing generation provenance');
  const last=a.generationRecords.at(-1),sha=createHash('sha256').update(b).digest('hex');
  if(last?.sha256!==sha)errors.push(card.id+': generation file hash mismatch');
  const catalog=resolve(root,'App/Assets.xcassets/'+card.artAsset+'.imageset/Contents.json');
  if(!existsSync(catalog)){errors.push(card.id+': missing asset catalog');continue;}
  const images=JSON.parse(readFileSync(catalog,'utf8')).images??[];
  if(!images.some(i=>i.filename&&resolve(root,'App/Assets.xcassets/'+card.artAsset+'.imageset/'+i.filename)===resolve(root,a.file)))errors.push(card.id+': catalog/file mismatch');
 }
 if(new Set(manifest.map(x=>x.cardID)).size!==manifest.length)errors.push('duplicate art rows');
 return errors;
}
