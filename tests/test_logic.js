// Tests de logique sans navigateur (pour environnements Chromium administrés)
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const ROOT=path.resolve(__dirname,'..');
class E {
  constructor(id=''){this.id=id;this.dataset={};this.value='';this.innerHTML='';this.textContent='';this.checked=false;this.className='';this.children=[];this.attributes={};
    this.classList={toggle(){},add(){},remove(){}};
  }
  addEventListener(){} querySelectorAll(){return []} appendChild(c){this.children.push(c)} setAttribute(k,v){this.attributes[k]=v} removeAttribute(k){delete this.attributes[k]}
  showModal(){this.open=true} close(){this.open=false} scrollTo(){}
}
const elements=new Map();
function get(sel){if(!elements.has(sel))elements.set(sel,new E(sel));return elements.get(sel)}
const doc={body:get('body'),querySelector:get,querySelectorAll:sel=>sel==='dialog'?[get('#recipeDialog'),get('#pickerDialog'),get('#settingsDialog')]:[],createElement:tag=>new E(tag),addEventListener() {}};
const storage=new Map();
const ctx={window:{},document:doc,location:{protocol:'file:'},navigator:{},console,Math,Date,Number,String,JSON,Array,Object,Set,Map,RegExp,Error,Boolean,Intl,
 structuredClone:x=>JSON.parse(JSON.stringify(x)),localStorage:{getItem(k){return storage.get(k)||null},setItem(k,v){storage.set(k,v)}},setTimeout(){return 1},clearTimeout(){},confirm(){return true}};
ctx.window.scrollTo=()=>{};
ctx.window.print=()=>{};
ctx.window.addEventListener=()=>{};
ctx.window.FRIGO_DATA=null;
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(ROOT,'js/data.js'),'utf8'),ctx);
vm.runInContext(fs.readFileSync(path.join(ROOT,'js/app.js'),'utf8'),ctx);
const api=ctx.window.FRIGO_TEST,d=ctx.window.FRIGO_DATA;
assert(api,'L’API de tests devrait être disponible');
<<<<<<< HEAD
assert.equal(d.recipes.length,303);
assert(Object.keys(d.products).length===124);
assert.equal(d.recipes.filter(r=>r.cat==='petit').length,51);
assert.equal(d.recipes.filter(r=>r.cat==='entree').length,47);
assert.equal(d.recipes.filter(r=>r.cat==='plat').length,157);
assert.equal(d.recipes.filter(r=>r.cat==='dessert').length,48);
=======
assert.equal(d.recipes.length,151);
assert(Object.keys(d.products).length>=105);
assert.equal(d.recipes.filter(r=>r.cat==='petit').length,26);
assert.equal(d.recipes.filter(r=>r.cat==='entree').length,22);
assert.equal(d.recipes.filter(r=>r.cat==='plat').length,76);
assert.equal(d.recipes.filter(r=>r.cat==='dessert').length,27);
>>>>>>> be7e0664e590d43a1428f935fc2ecba91241fe27
const p=api.parseStock('3 œufs, 2 tomates, 500 g de pommes de terre, 1,5 l de lait, jambon, 2 tranches de jambon');
assert.equal(p.length,6);
assert.deepEqual(JSON.parse(JSON.stringify(p.map(x=>[x.id,x.qty]))),[['oeuf',3],['tomate',2],['pomme_terre',500],['lait',1500],['jambon',null],['jambon',2]]);
assert.equal(api.productFromText('oeufs'),'oeuf');
assert.equal(api.productFromText('œufs'),'oeuf');
assert.equal(api.productFromText('reste de riz'),'riz_cuit');
assert.equal(api.productFromText('riz'),'riz');
assert.equal(api.productFromText('tomates cerises'),'tomates_cerises');
assert.equal(api.parseStock('de la mayonnaise')[0].id,'mayonnaise');
assert.equal(api.parseStock('2 pommes de terre')[0].qty,null,'Ne doit pas inventer un poids en grammes');
assert.equal(api.parseStock('1 kg de pomme de terre')[0].qty,1000);
assert.equal(api.parseStock('25 cl de lait')[0].qty,250);
assert.equal(api.parseStock('2 tranches jambon')[0].qty,2);
assert.equal(api.parseStock('2 paquets de 500 g de pâtes')[0].qty,1000);
assert.equal(api.parseStock('2 paquets de 500 g de pâtes')[0].displayUnit,'paquet');
assert.equal(api.parseStock('2 boîtes de 6 œufs')[0].qty,12);
assert.equal(api.parseStock('2 kg de pommes de terre')[0].displayUnit,'kg');
assert.equal(api.parseStock('juste une boîte de thon')[0].qty,null);
assert.equal(api.parseStock('une tomate')[0].qty,1);
assert.equal(api.parseStock('deux tomates')[0].qty,2);
const prose=api.parseStock('Il me reste trois œufs et deux tomates, du jambon et du fromage');
assert.equal(prose.length,4);
assert.deepEqual(prose.map(i=>i.id).join(','),'oeuf,tomate,jambon,fromage');
assert.equal(prose[0].qty,3);
assert.equal(prose[1].qty,2);
assert.equal(api.parseStock('<img src=x onerror=alert(1)>')[0].recognized,false);
const base={stock:{pain:{qty:2},beurre:{qty:null},confiture:{qty:60}},people:2,
 plan:[{petit:'r001',midi:{plat:null,entree:null,dessert:null},soir:{plat:null,entree:null,dessert:null}},...Array.from({length:6},()=>({petit:null,midi:{plat:null,entree:null,dessert:null},soir:{plat:null,entree:null,dessert:null}}))]};
api.setState(base);
const rows=api.shopRows();
assert.equal(rows.find(x=>x.id==='pain').qty,2);
assert.equal(rows.find(x=>x.id==='beurre').qty,20);
assert.equal(rows.find(x=>x.id==='beurre').unknown,true);
assert(!rows.some(x=>x.id==='confiture'));
api.setState({...base,people:4});
assert.equal(api.shopRows().find(x=>x.id==='pain').qty,6);
// Planificateur : tous les repas, trois services, sans four, végétarien
api.setState({people:2,vegetarian:true,porkFree:true,method:'nooven',priority:'variety',fullCourses:true,plan:[]});
api.generateWeek();
const state=api.getState();
assert.equal(state.plan.length,7);
const ids=[];
for(const day of state.plan){
 assert(day.petit && day.midi.plat && day.soir.plat && day.midi.entree && day.midi.dessert && day.soir.entree && day.soir.dessert);
 ids.push(day.petit,day.midi.plat,day.soir.plat,day.midi.entree,day.midi.dessert,day.soir.entree,day.soir.dessert);
}
assert.equal(ids.length,49);
assert(ids.every(id=>{const r=d.recipes.find(x=>x.id===id);return r&&r.vegetarian&&r.porkFree&&r.method!=='four';}));
const r1=state.plan[0].midi.plat;
state.locks['0:midi:plat']=true;
api.setState(state);api.generateWeek();
assert.equal(api.getState().plan[0].midi.plat,r1,'Verrouillage respecté');
// Validation des données d'import : doit rejeter les IDs inconnus
api.setState({stock:{faux:{qty:100},oeuf:{qty:4}},people:999,plan:[]});
assert.equal(api.getState().people,12);
assert(!api.getState().stock.faux);
assert.equal(api.fmt('lait',1500),'1,5 l');
<<<<<<< HEAD
// Ancienne sauvegarde et nouveaux modes sans effacer les menus existants.
api.setState({stock:{pates:{qty:1000},oeuf:{qty:9}},mealMode:'dinner',people:2,plan:[]});
assert.equal(api.getState().stock.pates.qty,1000);
assert.equal(api.getState().stock.pates.displayUnit,'g');
assert.equal(api.mealCount(),7);
api.generateWeek();
assert.equal(api.getState().plan.filter(d=>d.soir.plat).length,7);
assert.equal(api.getState().plan.filter(d=>d.petit).length,0);
assert.equal(api.getState().plan.filter(d=>d.midi.plat).length,0);
api.setState({...api.getState(),mealMode:'lunch_dinner'});api.generateWeek();
assert.equal(api.mealCount(),14);
assert.equal(api.getState().plan.filter(d=>d.midi.plat).length,7);
api.setState({...api.getState(),mealMode:'all'});api.generateWeek();assert.equal(api.mealCount(),21);
const pack={qty:1000,detail:'',displayUnit:'g',packSize:null,packCount:null};
api.chooseStockUnit(pack,d.products.pates,'kg');assert.equal(api.displayQty(pack,d.products.pates),1);
api.readStockQuantity(pack,d.products.pates,'1.5');assert.equal(pack.qty,1500);
api.chooseStockUnit(pack,d.products.pates,'paquet');assert.equal(pack.qty,1500,'Changer en paquet ne perd pas le stock connu');
assert.equal(api.equipmentAllowed(d.recipes.find(r=>r.method==='gaufrier')),true);
api.setState({...api.getState(),equipments:['four','plaques']});
assert.equal(api.equipmentAllowed(d.recipes.find(r=>r.method==='gaufrier')),false);
// Achats à la pièce arrondis, recette précise conservée.
api.setState({...base,stock:{pain:{qty:2}},people:5});
assert.equal(api.shopRows().find(x=>x.id==='pain').qty,8);
const odd={...base,stock:{},people:5,plan:[{petit:'r004',midi:{plat:null,entree:null,dessert:null},soir:{plat:null,entree:null,dessert:null}},...Array.from({length:6},()=>({petit:null,midi:{plat:null,entree:null,dessert:null},soir:{plat:null,entree:null,dessert:null}}))]};
api.setState(odd);
assert.equal(api.shopRows().find(x=>x.id==='oeuf').qty,2.5);
assert.equal(api.fmtShopping('oeuf',2.5),'3 pièces');
// DLC dépassée : ne doit pas réduire les courses, même si une quantité existe.
api.setState({...base,stock:{pain:{qty:1000,expires:'2020-01-01',dateType:'dlc'}},people:2});
assert.equal(api.shopRows().find(x=>x.id==='pain').qty,4);
assert(d.recipes.every(r=>r.steps.length>=2));
assert(d.recipes.some(r=>r.vegan)&&d.recipes.some(r=>r.glutenFree));
const previousWeek=api.getState();
api.setState({...previousWeek,mealMode:'dinner',history:[{id:'r001',date:'2026-11-10'}]});
assert.equal(api.getState().history.length,1);
api.generateWeek();
assert.equal(api.getState().history.length,1,'La génération automatique sans confirmation ne doit pas accumuler les historiques');
assert.equal(d.recipes.find(r=>r.title==='Gratin dauphinois').steps.length,4);
assert(d.recipes.some(r=>r.title==='Dahl de lentilles corail'));
assert(d.recipes.filter(r=>r.cat==='plat').length>=150);
assert.equal(d.recipes.find(r=>r.title==='Poêlée pommes de terre-chorizo').vegetarian,false);
assert.equal(d.recipes.find(r=>r.title==='Poêlée pommes de terre-chorizo').porkFree,false);
assert(d.recipes.filter(r=>r.vegan).length>25);
api.setState({...base,stock:{yaourt:{qty:4,expires:'2030-03-15',dateType:'ddm'}},plan:[]});
assert.equal(api.getState().stock.yaourt.expires,'2030-03-15');
assert.equal(api.getState().stock.yaourt.dateType,'ddm');
api.printDocument('both');
assert(get('#printLayout').innerHTML.includes('Pensez à la planète'));


console.log('✅ Tests logiques V0.3 : 303 recettes, 124 produits, parseur, unités, anti-quantités inventées, calcul des courses, 49 éléments de menu, restrictions, verrouillage, validation.');
=======
console.log('✅ Tests logiques : 151 recettes, 105 produits, parseur, unités, anti-quantités inventées, calcul des courses, 49 éléments de menu, restrictions, verrouillage, validation.');
// Régression V0.2 : choix des unités, anciennes sauvegardes, menus partiels.
api.setState({stock:{pomme_terre:{qty:2000},pates:{qty:500}},people:2,plan:[]});
assert.equal(api.getState().stock.pomme_terre.qty,2000,'Les sauvegardes V0.1 restent lisibles');
api.changeStockUnit('pomme_terre','kg');
assert.equal(api.getState().stock.pomme_terre.qty,2000);
assert.equal(api.getState().stock.pomme_terre.displayQty,2);
api.updateStockQuantity('pomme_terre','2,5');
assert.equal(api.getState().stock.pomme_terre.qty,2500);
api.changeStockUnit('pomme_terre','piece');
assert.equal(api.getState().stock.pomme_terre.qty,2500,'La simple sélection d’une unité ne perd pas le poids');
api.updateStockQuantity('pomme_terre','4');
assert.equal(api.getState().stock.pomme_terre.qty,null,'Ne pas convertir arbitrairement 4 pommes de terre en g');
assert.equal(api.getState().stock.pomme_terre.displayQty,4);
api.changeStockUnit('pates','paquet');
assert.equal(api.getState().stock.pates.qty,500,'Sélection paquet ne doit pas supprimer le stock existant');
api.updatePackSize('pates','500');
api.updateStockQuantity('pates','2');
assert.equal(api.getState().stock.pates.qty,1000);
assert.equal(api.getState().stock.pates.unitSize,500);
const parsedPack=api.parseStock('2 paquets de pâtes de 500 g')[0];
assert.equal(parsedPack.qty,1000);
assert.equal(parsedPack.displayUnit,'paquet');
assert.equal(parsedPack.unitSize,500);
assert.equal(api.parseStock('3 pommes de terre')[0].displayUnit,'piece');
assert.equal(api.formatShopping('oeuf',18.5),'19 pièces');
assert.equal(api.formatShopping('lait',1250),'1,25 l');
const baseDay={petit:'r001',midi:{plat:'r067',entree:null,dessert:null},soir:{plat:'r065',entree:null,dessert:null}};
const fullPlan=Array.from({length:7},()=>JSON.parse(JSON.stringify(baseDay)));
api.setState({people:2,plan:fullPlan,mealMode:'dinner'});
assert.equal(api.selectedMeals().join(','),'soir');
let needed=api.ingredientsNeeded();
assert(!needed.pain,'Le dîner seul ne doit pas compter les tartines du matin');
assert(!needed.riz,'Le dîner seul ne doit pas compter le riz du déjeuner');
assert(needed.poulet>0);
api.setState({people:2,plan:fullPlan,mealMode:'lunch-dinner'});
needed=api.ingredientsNeeded();
assert(!needed.pain);
assert(needed.riz>0);
api.setState({people:2,plan:fullPlan,mealMode:'all'});
assert(api.ingredientsNeeded().pain>0);
api.setState({people:2,mealMode:'dinner',plan:[]});
api.generateWeek();
assert(api.getState().plan.every(x=>!!x.soir.plat));
assert(api.getState().plan.every(x=>!x.midi.plat&&!x.petit));
api.setState({people:2,mealMode:'lunch-dinner',plan:[]});
api.generateWeek();
assert(api.getState().plan.every(x=>!!x.midi.plat&&!!x.soir.plat&&!x.petit));
api.setState({people:2,mealMode:'all',equipment:{gaufrier:false,friteuse:false,raclette:false,crepiere:false},plan:[]});
api.generateWeek();
assert(api.getState().plan.every(day=>![day.petit,day.midi.plat,day.soir.plat].some(id=>['gaufrier','friteuse','raclette','crêpière'].includes(d.recipes.find(r=>r.id===id)?.method))));
ctx.window.print=()=>{};
api.printDocument('both');
assert(get('#printLayout').innerHTML.includes('Pensez à la planète'));
api.setState({people:5,fullCourses:false,mealMode:'all',plan:[]});
api.generateWeek();
api.printDocument('both');
const css=fs.readFileSync(path.join(ROOT,'css/style.css'),'utf8');
if(process.env.FRIGO_PRINT_PREVIEW==='1')fs.writeFileSync(path.join(ROOT,'tests','print_preview.html'),`<!doctype html><html lang="fr"><meta charset="utf-8"><style>${css}</style><div class="print-layout">${get('#printLayout').innerHTML}</div></html>`);
console.log('✅ V0.2 : conversion g/kg/paquet, unités inconnues, arrondis, 7/14/21 repas, équipements, export imprimable.');
>>>>>>> be7e0664e590d43a1428f935fc2ecba91241fe27
