/* Frigo Express V0.4 — desserts faciles, spécialités régionales et cuisines du monde. */
(() => {
  'use strict';
  const D=window.FRIGO_DATA;
  if(!D){document.body.textContent='Catalogue absent : vérifie le fichier js/data.js.';return;}
  const PRODUCTS=D.products, RECIPES=D.recipes, BYID=Object.fromEntries(RECIPES.map(r=>[r.id,r]));
  const STORE='frigo-express-v01', WEEKDAYS=['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche'];
  const MEALS=[{id:'petit',label:'Petit-déjeuner',emoji:'☀️'},{id:'midi',label:'Déjeuner',emoji:'🍽️'},{id:'soir',label:'Dîner',emoji:'🌙'}];
  const CAT_LABEL={petit:'Petit-déjeuner',entree:'Entrée',plat:'Plat',dessert:'Dessert'};
  const ORIGINS={maison:'Cuisine du quotidien',france:'France',italie:'Italie',espagne:'Espagne',maroc:'Maroc',maghreb:'Maghreb',inde:'Inde',senegal:'Sénégal',cote_ivoire:'Afrique de l’Ouest',chine:'Chine',japon:'Japon',thailande:'Thaïlande',mexique:'Mexique',portugal:'Portugal',liban:'Liban'};
  const originLabel=r=>r.region?`${ORIGINS[r.origin]||'Cuisine maison'} · ${r.region}`:(ORIGINS[r.origin]||'Cuisine maison');
  function initOrigins(){
    const cuisine=$('#originFilter'),region=$('#regionFilter');
    const used=[...new Set(RECIPES.map(r=>r.origin||'maison'))].sort((a,b)=>(ORIGINS[a]||a).localeCompare(ORIGINS[b]||b,'fr'));
    cuisine.innerHTML='<option value="all">Toutes les cuisines</option>'+used.map(k=>`<option value="${esc(k)}">${esc(ORIGINS[k]||k)}</option>`).join('');
    const regions=[...new Set(RECIPES.filter(r=>r.origin==='france'&&r.region).map(r=>r.region))].sort((a,b)=>a.localeCompare(b,'fr'));
    region.innerHTML='<option value="all">Toutes les régions</option>'+regions.map(name=>`<option value="${esc(name)}">${esc(name)}</option>`).join('');
    cuisine.value='all';region.value='all';
  }
  const EQUIPMENTS=[['four','Four'],['plaques','Plaques / cuisinière'],['micro-ondes','Micro-ondes'],['gaufrier','Gaufrier'],['friteuse','Friteuse'],['raclette','Appareil à raclette'],['crepiere','Crêpière']];
  const ALL_EQUIPMENTS=EQUIPMENTS.map(x=>x[0]);
  const MODE_LABEL={all:'Petit-déjeuner, midi et soir',lunch_dinner:'Midi et soir',dinner:'Le soir uniquement'};
  const isMealActive=meal=>state.mealMode==='all'||meal==='soir'||(state.mealMode==='lunch_dinner'&&meal==='midi');
  const mealCount=()=>state.mealMode==='all'?21:state.mealMode==='lunch_dinner'?14:7;
  const equipmentFor=recipe=>({'four':'four','poêle':'plaques','casserole':'plaques','micro-ondes':'micro-ondes','gaufrier':'gaufrier','friteuse':'friteuse','raclette':'raclette','crêpière':'crepiere'})[recipe.method]||null;
  const equipmentAllowed=recipe=>{const eq=equipmentFor(recipe);return !eq||state.equipments.includes(eq);};
  const photoForRecipe=r=>{const name=r.title.toLocaleLowerCase('fr');if(name==='mousse au chocolat')return 'assets/recipes/mousse-chocolat.webp';if(name.startsWith('gâteau au yaourt'))return 'assets/recipes/gateau-yaourt.webp';if(name==='spaghetti bolognaise')return 'assets/recipes/spaghetti-bolognaise.webp';return null;};

  const $=(selector,root=document)=>root.querySelector(selector);
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const unitLabel=(unit,q)=>unit==='u'?'pièce'+(q>1?'s':''):unit==='tranche'?'tranche'+(q>1?'s':''):unit;
  const nice=n=>Number((n||0).toFixed(2)).toLocaleString('fr-FR',{maximumFractionDigits:2});
  const unitChoices=p=>p.unit==='g'?[['g','g'],['kg','kg'],['paquet','paquet(s)']]:p.unit==='ml'?[['ml','ml'],['cl','cl'],['l','L'],['paquet','bouteille(s)']]:p.unit==='u'?[['u','pièce(s)'],['paquet','boîte(s)']]:[['tranche','tranche(s)'],['paquet','paquet(s)']];
  const unitFactor=u=>({'g':1,'kg':1000,'ml':1,'cl':10,'l':1000,'u':1,'tranche':1})[u]||1;
  const validDisplayUnit=(p,u)=>unitChoices(p).some(choice=>choice[0]===u)?u:p.unit;
  const displayQty=(item,p)=>item.qty===null?(item.displayUnit==='paquet'?item.packCount??'':''):item.displayUnit==='paquet'?(item.packCount??(item.packSize>0?item.qty/item.packSize:'')):Number((item.qty/unitFactor(item.displayUnit||p.unit)).toFixed(3));
  const fmt=(id,q)=>{const p=PRODUCTS[id];if(!p)return '';let val=q,unit=p.unit;
    if(unit==='u'||unit==='tranche')return nice(q)+' '+unitLabel(unit,q);
    if(unit==='g'&&q>=1000){val=q/1000;unit='kg';}
    if(unit==='ml'&&q>=1000){val=q/1000;unit='l';}
    return nice(val)+' '+unit;};
  const fmtShopping=(id,q)=>{const p=PRODUCTS[id];return p&&['u','tranche'].includes(p.unit)?fmt(id,Math.ceil(Math.max(0,q-1e-8))):fmt(id,q);};
  function readStockQuantity(item,p,input){const raw=input.trim().replace(',','.');
    if(raw===''){item.qty=null;item.packCount=null;item.detail='Quantité à renseigner';return;}
    const value=Number(raw);
    if(!Number.isFinite(value)||value<0||value>1000000){item.qty=null;item.detail='Quantité invalide';return;}
    if(item.displayUnit==='paquet'){item.packCount=value;item.qty=item.packSize>0?value*item.packSize:null;item.detail=item.qty===null?'Indique la contenance d’un paquet':'';}
    else {item.qty=value*unitFactor(item.displayUnit||p.unit);item.detail='';}
  }
  function chooseStockUnit(item,p,unit){const previous=item.displayUnit||p.unit;item.displayUnit=validDisplayUnit(p,unit);
    if(item.displayUnit==='paquet'&&previous!=='paquet'){item.packCount=item.packSize>0&&item.qty!==null?Number((item.qty/item.packSize).toFixed(3)):null;if(item.qty!==null&&!(item.packSize>0))item.detail='Indique la contenance du paquet pour afficher le nombre';}
    if(previous==='paquet'&&item.displayUnit!=='paquet'&&item.qty===null){item.detail='Quantité à renseigner';}
  }
  const slug=s=>String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/œ/g,'oe').replace(/æ/g,'ae').replace(/['’\-]/g,' ').replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
  const ALIASES=[];
  for(const p of Object.values(PRODUCTS))for(const alias of [p.label,...p.aliases])ALIASES.push({id:p.id,value:slug(alias)});
  ALIASES.sort((a,b)=>b.value.length-a.value.length);
  function productFromText(s){const normalized=slug(s).replace(/^(?:de |du |des |d |la |le |les |un |une )+/,'');
    if(!normalized)return null;
    const exact=ALIASES.find(a=>a.value===normalized);
    if(exact)return exact.id;
    // Reconnaît les formulations « reste de riz », sans confondre riz cru et riz cuit.
    const match=ALIASES.find(a=>a.value.length>2&&new RegExp('(?:^| )'+a.value.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'(?:$| )').test(normalized));
    return match?match.id:null;
  }
  function parseStock(text){
    const output=[];
    // Accepte aussi « Il me reste trois œufs et deux tomates ».
    const chunks=String(text||'')
      .replace(/(\d),(\d)/g,'$1¤$2')
      .replace(/\s+et\s+(?=(?:\d|un\b|une\b|deux\b|trois\b|quatre\b|du\b|des\b|de\s+la\b))/gi,', ')
      .split(/[,;\n]+/)
      .map(x=>x.replace(/¤/g,',').trim()
        .replace(/^(?:(?:dans (?:mon|le) frigo[, ]+)?(?:il me reste|nous avons|j['’]ai encore|j['’]ai|on a|il y a|reste|j'ai dans mon frigo))\s+/i,'')
        .trim()).filter(Boolean);
    for(let chunk of chunks){
      if(chunk.length>180){output.push({recognized:false,text:chunk.slice(0,180),reason:'Saisie trop longue'});continue;}
      let q=null,unit=null,rawQty='',remaining=chunk;
      const m=chunk.match(/^(\d+(?:[.,]\d+)?|une?|deux|trois|quatre|cinq|six|sept|huit|neuf|dix)\s*(kg|kilos?|g|grammes?|ml|cl|litres?|l|tranches?|pi[eè]ces?|unit[eé]s?|gousses?|bo[iî]tes?|paquets?)?(?:\s+|$)/i);
      if(m){
        const names={un:1,une:1,deux:2,trois:3,quatre:4,cinq:5,six:6,sept:7,huit:8,neuf:9,dix:10};
        q=names[slug(m[1])]??Number(m[1].replace(',','.'));
        unit=m[2]?slug(m[2]):null;rawQty=m[0].trim();remaining=chunk.slice(m[0].length).replace(/^\s*(?:de |du |des |d['’] ?)/i,'').trim();
      }
      remaining=remaining.replace(/^\s*(?:du |des |de la |de l['’]|de |d['’]|un |une )/i,'').trim();
      // 2 paquets de 500 g de pâtes / 2 boîtes de 6 œufs : aucun poids inventé.
      let packSize=null,packSizeNoUnit=null;
      if(unit&&['paquet','paquets','boite','boites'].includes(unit)){
        const pm=remaining.match(/^(?:de |du |des )?(\d+(?:[.,]\d+)?)\s*(kg|g|grammes?|cl|ml|l|litres?|pi[eè]ces?|unit[eé]s?|tranches?)\s*(?:de |du |des |d['’])?/i);
        if(pm){packSize=Number(pm[1].replace(',','.'))*({'kg':1000,'g':1,'gramme':1,'grammes':1,'cl':10,'ml':1,'l':1000,'litre':1000,'litres':1000,'piece':1,'pieces':1,'unite':1,'unites':1,'tranche':1,'tranches':1}[slug(pm[2])]||1);remaining=remaining.slice(pm[0].length).trim();}
        else {const bare=remaining.match(/^(?:de |du |des )?(\d+(?:[.,]\d+)?)\s+(?=[^0-9])/i);if(bare){packSizeNoUnit=Number(bare[1].replace(',','.'));remaining=remaining.slice(bare[0].length).trim();}}
      }
      const id=productFromText(remaining);
      if(!id){output.push({recognized:false,text:chunk,reason:'Produit non reconnu'});continue;}
      const expected=PRODUCTS[id].unit;
      if(packSizeNoUnit!==null&&['u','tranche'].includes(expected))packSize=packSizeNoUnit;
      let converted=null,detail='Quantité non précisée';
      if(q!==null && Number.isFinite(q) && q>0 && q<=100000){
        const type=unit||'u';
        if(expected==='g'&&['g','gramme','grammes'].includes(type)) converted=q;
        if(expected==='g'&&['kg','kilo','kilos'].includes(type)) converted=q*1000;
        if(expected==='ml'&&type==='ml') converted=q;
        if(expected==='ml'&&type==='cl') converted=q*10;
        if(expected==='ml'&&['l','litre','litres'].includes(type)) converted=q*1000;
        if(expected==='u'&&['u','piece','pieces','unite','unites','gousse','gousses'].includes(type)) converted=q;
        if(expected==='tranche'&&['u','tranche','tranches'].includes(type)) converted=q;
        if(['paquet','paquets','boite','boites'].includes(type)&&packSize>0)converted=q*packSize;
        if(converted===null)detail=`${rawQty} : conversion en ${expected} à vérifier`;
      } else if(q!==null) detail='Quantité impossible à convertir';
      let displayUnit=PRODUCTS[id].unit;
      if(['kg','kilo','kilos'].includes(unit))displayUnit=expected==='g'?'kg':displayUnit;
      else if(['l','litre','litres'].includes(unit))displayUnit=expected==='ml'?'l':displayUnit;
      else if(unit==='cl')displayUnit=expected==='ml'?'cl':displayUnit;
      else if(['paquet','paquets','boite','boites'].includes(unit))displayUnit='paquet';
      displayUnit=validDisplayUnit(PRODUCTS[id],displayUnit);
      output.push({recognized:true,id,qty:converted,detail,raw:chunk,displayUnit,packCount:displayUnit==='paquet'?q:null,packSize:packSize??null});
    }
    return output;
  }
  function emptyPlan(){return WEEKDAYS.map(()=>({petit:null,midi:{plat:null,entree:null,dessert:null},soir:{plat:null,entree:null,dessert:null}}));}
  const fresh=()=>({stock:{},unknown:[],favorites:[],people:2,priority:'stock',method:'all',mealMode:'all',equipments:[...ALL_EQUIPMENTS],vegetarian:false,porkFree:false,fullCourses:false,plan:emptyPlan(),locks:{},checked:{},manual:[],history:[]});
  function validate(s){
    const base=fresh();if(!s||typeof s!=='object'||Array.isArray(s))return base;
    if(s.stock&&typeof s.stock==='object')for(const [id,item] of Object.entries(s.stock))if(PRODUCTS[id]){
      const n=Number(item?.qty),p=PRODUCTS[id];
      const packSize=Number(item?.packSize),packCount=Number(item?.packCount);
      base.stock[id]={qty:item?.qty===null||item?.qty===undefined?null:Number.isFinite(n)?Math.max(0,Math.min(1000000,n)):null,
        detail:String(item?.detail||'').slice(0,120),displayUnit:validDisplayUnit(p,item?.displayUnit),
        packCount:item?.packCount===null||item?.packCount===undefined||!Number.isFinite(packCount)?null:Math.max(0,Math.min(1000000,packCount)),
        packSize:item?.packSize===null||item?.packSize===undefined||!Number.isFinite(packSize)||packSize<=0?null:Math.max(0,Math.min(1000000,packSize)),
        expires:/^\d{4}-\d{2}-\d{2}$/.test(String(item?.expires||''))?String(item.expires):'',dateType:['dlc','ddm'].includes(item?.dateType)?item.dateType:['Épicerie','Conserves','Boissons','Surgelés'].includes(p.category)?'ddm':'dlc'};
    }
    if(Array.isArray(s.unknown))base.unknown=s.unknown.slice(0,80).filter(x=>typeof x?.text==='string').map(x=>({text:x.text.slice(0,180),reason:'Produit non reconnu'}));
    if(Array.isArray(s.favorites))base.favorites=[...new Set(s.favorites.filter(id=>BYID[id]))];
    base.people=Number.isInteger(Number(s.people))?Math.min(12,Math.max(1,Number(s.people))):2;
    base.priority=['stock','variety','quick'].includes(s.priority)?s.priority:'stock';
    base.method=['all','nooven'].includes(s.method)?s.method:'all';
    base.mealMode=Object.hasOwn(MODE_LABEL,s.mealMode)?s.mealMode:'all';
    if(Array.isArray(s.equipments))base.equipments=[...new Set(s.equipments.filter(x=>ALL_EQUIPMENTS.includes(x)))];
    base.vegetarian=!!s.vegetarian;base.porkFree=!!s.porkFree;base.fullCourses=!!s.fullCourses;
    if(Array.isArray(s.plan)&&s.plan.length===7)base.plan=s.plan.map((day)=>({
      petit:BYID[day?.petit]?.cat==='petit'?day.petit:null,
      midi:cleanMeal(day?.midi),soir:cleanMeal(day?.soir)
    }));
    if(s.locks&&typeof s.locks==='object')for(const [key,v] of Object.entries(s.locks))if(/^([0-6]):(petit|midi|soir):(plat|entree|dessert)$/.test(key)&&v)base.locks[key]=true;
    if(s.checked&&typeof s.checked==='object')for(const [key,v] of Object.entries(s.checked))if(key.length<120&&v)base.checked[key]=true;
    if(Array.isArray(s.manual))base.manual=s.manual.slice(0,80).filter(x=>typeof x?.label==='string').map((x,i)=>({id:String(x.id||'manual'+i).slice(0,70),label:x.label.slice(0,90)}));
    if(Array.isArray(s.history))base.history=s.history.filter(x=>BYID[x?.id]&&typeof x?.date==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(x.date)).slice(-400).map(x=>({id:x.id,date:x.date}));
    return base;
  }
  function cleanMeal(meal){const result={plat:null,entree:null,dessert:null};for(const key of Object.keys(result))if(BYID[meal?.[key]]?.cat===key)result[key]=meal[key];return result;}
  function load(){try{return validate(JSON.parse(localStorage.getItem(STORE)));}catch{return fresh();}}
  const today=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
  const expiresInDays=item=>{if(!item?.expires)return null;const start=new Date(today()+'T12:00:00'),end=new Date(item.expires+'T12:00:00');return Number.isFinite(end.getTime())?Math.round((end-start)/86400000):null;};
  const excludedDLC=item=>item?.dateType==='dlc'&&expiresInDays(item)!==null&&expiresInDays(item)<0;
  let state=load(),currentPage='frigo',recipeMode='stock',selectedRecipeId=null,pickerTarget=null,toastTimer=null;
  function save(){try{localStorage.setItem(STORE,JSON.stringify(state));}catch{toast('Sauvegarde locale impossible : stockage navigateur bloqué ou saturé.');}}
  function resetProductChecks(){for(const k of Object.keys(state.checked))if(k.startsWith('product:'))delete state.checked[k];}
  function toast(s){const t=$('#toast');t.textContent=s;t.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('show'),3600);}
  function page(name){if(!['frigo','recettes','semaine','courses'].includes(name))return;
    currentPage=name;document.querySelectorAll('.page').forEach(el=>el.classList.toggle('active',el.id==='page-'+name));
    document.querySelectorAll('.nav-item').forEach(el=>{const on=el.dataset.page===name;el.classList.toggle('active',on);if(on)el.setAttribute('aria-current','page');else el.removeAttribute('aria-current');});
    if(name==='recettes')renderRecipes();if(name==='semaine')renderWeek();if(name==='courses')renderShop();
    window.scrollTo({top:0,behavior:'instant'});
  }
  function addParsed(text){const parsed=parseStock(text);if(!parsed.length){toast('Écris au moins un ingrédient.');return;}
    let recognized=0,unknown=0;
    for(const item of parsed){if(item.recognized){state.stock[item.id]={...state.stock[item.id],qty:item.qty,detail:item.detail,displayUnit:item.displayUnit,packSize:item.packSize,packCount:item.packCount};recognized++;}else{
      if(!state.unknown.some(x=>x.text.toLowerCase()===item.text.toLowerCase()))state.unknown.push(item);unknown++;
    }}
    resetProductChecks();save();renderAll();toast(`${recognized} ingrédient(s) enregistré(s)${unknown?' · '+unknown+' à identifier':''}. Les nouvelles saisies remplacent la quantité d’un même produit.`);
  }
  function addQuick(id){state.stock[id]={...state.stock[id],qty:null,detail:'Quantité à renseigner',displayUnit:PRODUCTS[id].unit,packCount:null,packSize:null};resetProductChecks();save();renderAll();toast(PRODUCTS[id].label+' ajouté : indique la quantité si tu la connais.');}
  function renderStock(){const entries=Object.entries(state.stock),unknown=state.unknown;
    $('#stockCount').textContent=`(${entries.length+unknown.length})`;
    $('#homeStats').innerHTML=`<div class="stat highlight"><strong>${entries.length}</strong><span>Produits reconnus</span></div><div class="stat"><strong>${unknown.length}</strong><span>À identifier</span></div><div class="stat"><strong>${RECIPES.length}</strong><span>Recettes disponibles</span></div>`;
    const rows=entries.sort((a,b)=>PRODUCTS[a[0]].label.localeCompare(PRODUCTS[b[0]].label,'fr')).map(([id,item])=>{
      const p=PRODUCTS[id],unit=validDisplayUnit(p,item.displayUnit),days=expiresInDays(item);
      const dateBadge=days===null?'':`<span class="expiry-badge ${days<0?'expiry-past':days<=3?'expiry-soon':'expiry-ok'}">${days<0?'Date dépassée':days===0?'Date aujourd’hui':days===1?'Demain':days+' jours'} · ${item.dateType==='ddm'?'DDM':'DLC'}</span>`;
      const dateFields=`<label class="expiry-field">Date sur le produit <input data-expiry="${id}" type="date" value="${esc(item.expires||'')}" aria-label="Date du produit ${esc(p.label)}"></label><label class="expiry-type">Type <select data-expiry-type="${id}" aria-label="Type de date ${esc(p.label)}"><option value="dlc" ${item.dateType!=='ddm'?'selected':''}>DLC</option><option value="ddm" ${item.dateType==='ddm'?'selected':''}>DDM</option></select></label>`;
      const options=unitChoices(p).map(([v,label])=>`<option value="${v}" ${v===unit?'selected':''}>${esc(label)}</option>`).join('');
      const pack=unit==='paquet'?`<label class="pack-detail">Contenance d’un ${p.unit==='u'?'boîte':p.unit==='ml'?'bouteille':'paquet'} : <input type="number" min="0" max="1000000" step="any" placeholder="Ex. 500" data-pack-size="${id}" value="${item.packSize??''}" aria-label="Contenance d’un paquet de ${esc(p.label)}"><span>${esc(unitLabel(p.unit,item.packSize))}</span></label>`:'';
      return `<div class="stock-row"><div class="stock-name"><strong>${esc(p.label)}</strong><small>${esc(p.category)}</small>${item.qty===null?`<div class="stock-unknown">${esc(item.detail||'Quantité à préciser')}</div>`:''}${dateBadge}</div><div class="stock-controls"><div class="stock-qty"><input type="number" min="0" max="1000000" step="any" data-quantity="${id}" aria-label="Quantité de ${esc(p.label)}" placeholder="?" value="${displayQty(item,p)}"><select data-unit="${id}" aria-label="Unité de ${esc(p.label)}">${options}</select></div>${pack}<div class="expiry-controls">${dateFields}</div></div><button class="delete" type="button" data-remove-stock="${id}" aria-label="Supprimer ${esc(p.label)}">✕</button></div>`;
    });
    rows.push(...unknown.map((item,i)=>`<div class="stock-row unrecognized"><div class="stock-name"><strong>${esc(item.text)}</strong><small>Non reconnu — essaye un nom plus simple</small></div><span class="stock-unknown">À corriger</span><button class="delete" type="button" data-remove-unknown="${i}" aria-label="Supprimer">✕</button></div>`));
    $('#stockList').innerHTML=rows.length?rows.join(''):'<div class="empty">Ton frigo est vide dans l’application. Ajoute quelques ingrédients pour commencer.</div>';
  }
  function matchRecipe(r,stock=state.stock,people=state.people){let complete=0,partial=0,unknown=0,missing=0,score=0;
    for(const ing of r.ingredients){const original=stock[ing.id],entry=excludedDLC(original)?null:original,required=ing.qty*people/r.servings;
      if(!entry){missing++;continue;}
      if(entry.qty===null){unknown++;score+=0.48;continue;}
      const coverage=Math.min(1,Math.max(0,entry.qty/required));score+=coverage;
      if(coverage>=0.999)complete++;else partial++;
    }
    return {complete,partial,unknown,missing,score:score/r.ingredients.length,available:complete+partial+unknown,
      exact:complete===r.ingredients.length};
  }
  function filtered(r){return (!$('#vegetarianFilter').checked||r.vegetarian)&&(!$('#porkFilter').checked||r.porkFree)&&(!$('#noOvenFilter').checked||r.method!=='four')&&(!$('#veganFilter').checked||r.vegan)&&(!$('#glutenFilter').checked||r.glutenFree);}
  function renderRecipes(){
    $('#recipesTotal').innerHTML=`${RECIPES.length}<small>recettes</small>`;
    $('#modeStock').classList.toggle('active',recipeMode==='stock');$('#modeAll').classList.toggle('active',recipeMode==='all');$('#modeFavorites').classList.toggle('active',recipeMode==='favorites');
    const search=slug($('#recipeSearch').value),cat=$('#categoryFilter').value,time=$('#timeFilter').value,origin=$('#originFilter').value,region=$('#regionFilter').value;
    $('#regionField').hidden=origin!=='france';
    let rs=RECIPES.filter(r=>(cat==='all'||r.cat===cat)&&(time==='all'||r.min<=Number(time))&&(origin==='all'||r.origin===origin)&&(origin!=='france'||region==='all'||r.region===region)&&filtered(r)&&equipmentAllowed(r)&&(slug(r.title).includes(search)||(search.length>2&&search.split(' ').every(word=>slug(r.title).split(' ').some(part=>part.startsWith(word))))||r.ingredients.some(i=>slug(PRODUCTS[i.id].label).includes(search))||slug(originLabel(r)).includes(search)));
    if(recipeMode==='favorites')rs=rs.filter(r=>state.favorites.includes(r.id));
    // Une recherche explicite parcourt le catalogue complet, même si l'onglet 'Avec mon frigo' est actif.
    if(recipeMode==='stock')rs=rs.filter(r=>search.length>0||matchRecipe(r).available>0).sort((a,b)=>matchRecipe(b).score-matchRecipe(a).score||a.min-b.min);
    else rs.sort((a,b)=>a.cat.localeCompare(b.cat)||a.title.localeCompare(b.title,'fr'));
    $('#resultsCount').textContent=`${rs.length} recette${rs.length>1?'s':''}`;
    $('#stockExplanation').textContent=recipeMode==='stock'?(search?'Recherche dans tout le catalogue ; ton stock reste pris en compte.':'Le classement privilégie ce que tu possèdes.'):recipeMode==='favorites'?'Tes recettes préférées.':'Catalogue complet, même sans ingrédients.';
    $('#recipeGrid').innerHTML=rs.length?rs.map(r=>{
      const m=matchRecipe(r);let badge=recipeMode==='stock'?(m.exact?'<span class="match good">✓ Tout disponible · 100 %</span>':`<span class="match">${Math.round(m.score*100)} % des quantités couvertes · ${m.missing+m.partial} à compléter${m.unknown?' · '+m.unknown+' à vérifier':''}</span>`):`<span class="match">${esc(CAT_LABEL[r.cat])}</span>`;
      return `<article class="recipe-card"><div class="card-visual ${r.cat}">${photoForRecipe(r)?`<img class="recipe-photo" loading="lazy" decoding="async" src="${photoForRecipe(r)}" alt="Photographie de ${esc(r.title)}">`:`<div class="dish-emoji" aria-hidden="true">${r.emoji}</div>`}<div class="card-overlay"><button type="button" class="fav ${state.favorites.includes(r.id)?'on':''}" data-favorite="${r.id}" aria-label="${state.favorites.includes(r.id)?'Retirer des':'Ajouter aux'} favoris" title="Favori">${state.favorites.includes(r.id)?'★':'☆'}</button></div></div><div class="card-body"><h3>${esc(r.title)}</h3><div class="recipe-meta"><span>⏱ ${r.min} min</span><span>🍴 ${esc(CAT_LABEL[r.cat])}</span><span>🌍 ${esc(originLabel(r))}</span><span>${r.vegetarian?'🥬 Végétarien':''}</span></div><div>${badge}</div><div class="card-foot"><button class="link-button" type="button" data-recipe="${r.id}">Voir la recette →</button><small>${r.ingredients.length} ingrédients</small></div></div></article>`;
    }).join(''):`<div class="empty" style="grid-column:1/-1">Aucune recette pour ces critères. ${recipeMode==='stock'&&!search?'Ajoute des ingrédients ou passe sur « Tout découvrir ».':'Essaie une autre recherche ou vérifie les filtres.'}</div>`;
  }
  function cookingTip(r){
    if(['four'].includes(r.method))return 'Préchauffe le four, utilise un plat adapté et vérifie la cuisson au centre. Les fours peuvent nécessiter quelques minutes de plus ou de moins.';
    if(r.method==='poêle')return 'Ajuste le feu pour éviter de brûler la surface avant que le cœur soit cuit. Pour les viandes et poissons, contrôle la cuisson complète.';
    if(r.method==='casserole')return 'Surveille le niveau de liquide et remue régulièrement si la préparation épaissit. Respecte le temps indiqué sur les emballages pour les féculents.';
    if(r.method==='froid')return 'Lave les produits frais, utilise des ustensiles propres et conserve au réfrigérateur les préparations contenant des produits périssables.';
    if(r.method==='micro-ondes')return 'Utilise un récipient compatible, chauffe par courtes séquences et mélange avant de déguster pour éviter les points très chauds.';
    return 'Respecte la notice de ton appareil, surveille la cuisson et vérifie la température avant de servir.';
  }
  function recipeDialog(id){const r=BYID[id];if(!r)return;selectedRecipeId=id;
    const m=matchRecipe(r),slots=slotsForCat(r.cat),options=slots.map(({day,meal,course})=>`<option value="${day}:${meal}:${course}">${WEEKDAYS[day]} · ${meal==='petit'?'Petit-déjeuner':meal==='midi'?'Déjeuner':'Dîner'}${course!=='plat'?' · '+CAT_LABEL[course]:''}</option>`).join('');
    $('#recipeDialogContent').innerHTML=`<div class="modal-top"><div><div class="section-kicker">${esc(CAT_LABEL[r.cat])} · ${r.min} MIN · ${esc(originLabel(r))}</div><h2>${esc(r.title)}</h2></div><button class="icon-btn" data-close="recipeDialog" type="button" aria-label="Fermer">✕</button></div>
    <div class="recipe-hero">${photoForRecipe(r)?`<img class="modal-photo" src="${photoForRecipe(r)}" alt="Photographie de ${esc(r.title)}">`:`<div class="emoji" aria-hidden="true">${r.emoji}</div>`}<div><strong>Facile à suivre</strong><p>${esc(r.method==='four'?'Cuisson au four':r.method==='froid'?'Sans cuisson':r.method==='micro-ondes'?'Micro-ondes':'Préparation '+r.method)} · ${r.ingredients.length} ingrédients</p><p>${m.exact?'Tous les ingrédients sont disponibles':m.unknown?'Certaines quantités sont à vérifier':'Tu peux compléter la liste de courses via le planning'}</p></div></div>
    <div class="small-controls"><label for="recipePortions">Portions</label><select id="recipePortions">${Array.from({length:12},(_,i)=>`<option value="${i+1}" ${i+1===state.people?'selected':''}>${i+1} personne${i>0?'s':''}</option>`).join('')}</select></div>
    <h3>Ingrédients</h3><div id="recipeIngredients"></div><h3>Préparation pas à pas</h3><p class="recipe-lead">Pour ${r.servings} personnes à l’origine · ${r.min} minutes environ · matériel : ${esc(r.method)}.</p><ol>${r.steps.map(s=>`<li>${esc(s)}</li>`).join('')}</ol><div class="soft-note"><strong>Conseil pratique :</strong> ${esc(cookingTip(r))}</div>${r.note?`<div class="soft-note">ℹ ${esc(r.note)}</div>`:''}
    <div class="modal-actions"><button class="btn outline" id="toggleModalFavorite" type="button">${state.favorites.includes(r.id)?'★ Retirer des favoris':'☆ Ajouter aux favoris'}</button></div>
    <h3>Mettre dans mes menus</h3><div class="small-controls"><select id="recipeSlot">${options}</select><button class="btn primary" id="addRecipeToPlan" type="button">Ajouter au planning</button></div>`;
    $('#recipePortions').addEventListener('change',()=>renderRecipeIngredients(r,Number($('#recipePortions').value)));
    renderRecipeIngredients(r,state.people);
    $('#recipeDialog').showModal();
  }
  function renderRecipeIngredients(r,people){$('#recipeIngredients').innerHTML=r.ingredients.map(ing=>{
    const p=PRODUCTS[ing.id],entry=excludedDLC(state.stock[ing.id])?null:state.stock[ing.id],need=ing.qty*people/r.servings;
    const status=!entry?'':'<span style="color:#f6bb7f;font-size:11px"> '+(entry.qty===null?'· stock à vérifier':entry.qty+0.00001>=need?'· en stock':'· stock insuffisant')+'</span>';
    return `<div class="ingredient-detail"><span>${esc(p.label)} ${status}</span><strong>${esc(fmt(ing.id,need))}</strong></div>`;
  }).join('');}
  function slotsForCat(cat){const all=[];for(let day=0;day<7;day++){
    if(cat==='petit'&&isMealActive('petit'))all.push({day,meal:'petit',course:'plat'});
    else if(cat!=='petit')for(const meal of ['midi','soir'])if(isMealActive(meal))all.push({day,meal,course:cat});
  }return all;}
  function weekSlot(day,meal,course){return meal==='petit'?state.plan[day].petit:state.plan[day][meal][course];}
  function setWeekSlot(day,meal,course,id){if(weekSlot(day,meal,course)!==id)resetProductChecks();if(meal==='petit')state.plan[day].petit=id;else state.plan[day][meal][course]=id;}
  function slotKey(day,meal,course){return `${day}:${meal}:${course}`;}
  function weekRecipeIds(){const list=[];for(const day of state.plan){if(isMealActive('petit')&&day.petit)list.push(day.petit);for(const meal of ['midi','soir']){if(!isMealActive(meal))continue;
    if(state.fullCourses&&day[meal].entree)list.push(day[meal].entree);
    if(day[meal].plat)list.push(day[meal].plat);
    if(state.fullCourses&&day[meal].dessert)list.push(day[meal].dessert);
  }}return list;}
  function generateWeek(showToast=true){
    const stamp=today(),cutoff=new Date(Date.now()-14*86400000).toISOString().slice(0,10);
    state.history=state.history.filter(x=>x.date>=cutoff);
    if(showToast){for(const id of weekRecipeIds())state.history.push({id,date:stamp});state.history=state.history.slice(-400);}
    const historyCount=new Map();for(const x of state.history)historyCount.set(x.id,(historyCount.get(x.id)||0)+1);
    let remaining=Object.fromEntries(Object.entries(state.stock).map(([id,item])=>[id,{qty:excludedDLC(item)?0:item.qty,detail:item.detail}]));
    const used=new Map();
    // Les repas verrouillés comptent déjà dans les courses et dans les stocks disponibles pour les autres propositions.
    for(let day=0;day<7;day++)for(const slot of slotsForDay(day)){
      const key=slotKey(day,slot.meal,slot.course),old=weekSlot(day,slot.meal,slot.course);
      if(old&&state.locks[key]&&(state.fullCourses||slot.course==='plat'||slot.meal==='petit'))consume(BYID[old],remaining,state.people,used);
    }
    for(let day=0;day<7;day++)for(const slot of slotsForDay(day)){
      const key=slotKey(day,slot.meal,slot.course);
      if(state.locks[key]&&weekSlot(day,slot.meal,slot.course))continue;
      const cat=slot.meal==='petit'?'petit':slot.course;
      let pool=RECIPES.filter(r=>r.cat===cat&&(!state.vegetarian||r.vegetarian)&&(!state.porkFree||r.porkFree)&&(state.method!=='nooven'||r.method!=='four')&&equipmentAllowed(r));
      if(!pool.length)pool=RECIPES.filter(r=>r.cat===cat&&equipmentAllowed(r));
      const scored=pool.map(r=>{
        const match=matchRecipe(r,remaining,state.people);
        const count=used.get(r.id)||0;
        const priorityBonus=state.priority==='stock'?match.score*12:state.priority==='quick'?(60-r.min)/6:match.score*3;
        const repeatPenalty=count*22+(count>0?13:0)+(historyCount.get(r.id)?Math.min(35,18+historyCount.get(r.id)*4):0);
        const expiringBoost=r.ingredients.reduce((points,ing)=>{const item=state.stock[ing.id],days=expiresInDays(item);return points+(days!==null&&days>=0&&days<=3&&item.qty>0?Math.max(0,5-days):0);},0);
        const varietyBoost=state.priority==='variety'?Math.max(0,6-r.ingredients.length/2):0;
        const ease=r.min<=30?2:0;
        return {r,score:priorityBonus+ease+expiringBoost+varietyBoost-repeatPenalty+Math.random()*2};
      }).sort((a,b)=>b.score-a.score);
      const chosen=scored[0]?.r;
      if(chosen){setWeekSlot(day,slot.meal,slot.course,chosen.id);consume(chosen,remaining,state.people,used);}
    }
    save();renderAll();if(showToast)toast('Semaine générée : '+mealCount()+' repas selon tes préférences.');
  }
  function slotsForDay(day){const slots=isMealActive('petit')?[{day,meal:'petit',course:'plat'}]:[];for(const meal of ['midi','soir']){if(!isMealActive(meal))continue;
    if(state.fullCourses)slots.push({day,meal,course:'entree'});
    slots.push({day,meal,course:'plat'});
    if(state.fullCourses)slots.push({day,meal,course:'dessert'});
  }return slots;}
  function consume(r,remaining,people,used){used.set(r.id,(used.get(r.id)||0)+1);for(const ing of r.ingredients){const item=remaining[ing.id];if(item&&item.qty!==null)item.qty=Math.max(0,item.qty-ing.qty*people/r.servings);}}
  function renderWeek(){
    $('#peopleCount').value=state.people;$('#planPriority').value=state.priority;$('#planMethod').value=state.method;$('#mealMode').value=state.mealMode;
    $('#weekMealCount').innerHTML=mealCount()+' <small>repas</small>';$('#weekSubtitle').textContent=MODE_LABEL[state.mealMode]+' — 7 jours organisés.';
    $('#planVegetarian').checked=state.vegetarian;$('#planPorkFree').checked=state.porkFree;$('#planCourses').checked=state.fullCourses;
    const n=weekRecipeIds().length;
    $('#weekInfo').innerHTML=`<span>👨‍👩‍👧 ${state.people} personne${state.people>1?'s':''}</span><span>🍽 ${n} recettes au programme</span><span>🔒 ${Object.values(state.locks).filter(Boolean).length} élément(s) verrouillé(s)</span>`;
    $('#weekList').innerHTML=state.plan.map((day,index)=>`<article class="day-card"><div class="day-head"><strong>${WEEKDAYS[index]}</strong><span>${index+1} / 7</span></div>${MEALS.filter(meal=>isMealActive(meal.id)).map(meal=>{
      const main=meal.id==='petit'?day.petit:day[meal.id].plat;
      const locks=slotKey(index,meal.id,'plat');
      return `<div class="meal"><div class="meal-name">${meal.emoji} ${meal.label}</div><div class="meal-row"><strong><button class="link-button" type="button" data-recipe="${esc(main||'')}">${main?esc(BYID[main]?.title):'Choisir une recette'}</button></strong><div class="meal-actions"><button class="tiny-icon" type="button" data-pick="${locks}" title="Changer le repas" aria-label="Changer ${meal.label} ${WEEKDAYS[index]}">↻</button><button class="tiny-icon ${state.locks[locks]?'locked':''}" type="button" data-lock="${locks}" aria-label="${state.locks[locks]?'Déverrouiller':'Verrouiller'} ${meal.label} ${WEEKDAYS[index]}">${state.locks[locks]?'🔒':'🔓'}</button></div></div>${state.fullCourses&&meal.id!=='petit'?`<div class="courses-extra">${['entree','dessert'].map(course=>{const id=day[meal.id][course],k=slotKey(index,meal.id,course);return `<div>${CAT_LABEL[course]} : <button type="button" data-recipe="${esc(id||'')}">${id?esc(BYID[id]?.title):'À choisir'}</button><button type="button" data-pick="${k}" title="Remplacer">↻</button><button type="button" data-lock="${k}" aria-label="Verrouiller">${state.locks[k]?'🔒':'🔓'}</button></div>`;}).join('')}</div>`:''}</div>`;
    }).join('')}</article>`).join('');
  }
  function openPicker(key){const m=key.match(/^([0-6]):(petit|midi|soir):(plat|entree|dessert)$/);if(!m)return;pickerTarget={day:Number(m[1]),meal:m[2],course:m[3]};
    $('#pickerSearch').value='';renderPicker();$('#pickerDialog').showModal();}
  function renderPicker(){if(!pickerTarget)return;const {meal,course}=pickerTarget,cat=meal==='petit'?'petit':course,search=slug($('#pickerSearch').value);
    let rs=RECIPES.filter(r=>r.cat===cat&&equipmentAllowed(r)&&slug(r.title).includes(search));
    rs.sort((a,b)=>matchRecipe(b).score-matchRecipe(a).score||a.min-b.min);
    $('#pickerList').innerHTML=rs.slice(0,100).map(r=>`<button class="picker-option" type="button" data-pick-recipe="${r.id}"><span>${r.emoji} ${esc(r.title)}</span><small>${esc(originLabel(r))} · ${r.min} min</small></button>`).join('')||'<div class="empty">Aucune recette trouvée.</div>';
  }
  function ingredientsNeeded(){const sum={};for(const id of weekRecipeIds()){
    const recipe=BYID[id];if(!recipe)continue;for(const ing of recipe.ingredients){sum[ing.id]=(sum[ing.id]||0)+ing.qty*state.people/recipe.servings;}
  }return sum;}
  function shopRows(){const needed=ingredientsNeeded(),items=[];
    for(const [id,required] of Object.entries(needed)){
      const entry=state.stock[id];const known=excludedDLC(entry)?0:entry?.qty??0;
      const toBuy=Math.max(0,required-known);
      // Pour une quantité inconnue : on affiche intégralement le besoin à vérifier, jamais "0 à acheter".
      if(toBuy>0.001)items.push({key:'product:'+id,label:PRODUCTS[id].label,category:PRODUCTS[id].category,qty:toBuy,required,known,unknown:!!entry&&entry.qty===null,id});
    }
    for(const m of state.manual)items.push({key:'manual:'+m.id,label:m.label,category:'Ajouts personnels',manual:true});
    return items.sort((a,b)=>a.category.localeCompare(b.category,'fr')||a.label.localeCompare(b.label,'fr'));
  }
  function renderShop(){const items=shopRows(),rem=items.filter(i=>!state.checked[i.key]),uncertain=items.filter(i=>i.unknown);
    $('#shopTotal').innerHTML=`${items.length}<small>produits</small>`;
    $('#shopStats').innerHTML=`<div class="stat highlight"><strong>${rem.length}</strong><span>À acheter / vérifier</span></div><div class="stat"><strong>${items.length-rem.length}</strong><span>Déjà cochés</span></div><div class="stat"><strong>${uncertain.length}</strong><span>Quantités à vérifier</span></div>`;
    if(!items.length){$('#shoppingGroups').innerHTML='<div class="empty">Tout est déjà prévu dans ton stock, ou aucun menu n’a encore été généré.</div>';return;}
    const groups=[...new Set(items.map(i=>i.category))];
    $('#shoppingGroups').innerHTML=groups.map(cat=>`<section class="shop-group"><h3>${esc(cat)}</h3>${items.filter(i=>i.category===cat).map(i=>{
      const done=!!state.checked[i.key];const text=i.manual?'Ajout personnel':fmtShopping(i.id,i.qty);
      return `<div class="shopping-item ${done?'checked':''}"><label><input type="checkbox" data-shop-check="${esc(i.key)}" ${done?'checked':''}><span>${esc(i.label)}</span></label><div class="shop-qty">${esc(text)}${i.unknown?'<small>Quantité au frigo inconnue</small>':''}${i.manual?`<button class="link-button" data-delete-manual="${esc(i.key.slice(7))}" type="button">Retirer</button>`:''}</div></div>`;
    }).join('')}</section>`).join('');
  }
  function shopText(){const items=shopRows();const groups=[...new Set(items.map(i=>i.category))];return groups.map(cat=>cat.toUpperCase()+'\n'+items.filter(i=>i.category===cat).map(i=>`☐ ${i.label} : ${i.manual?'quantité libre':fmtShopping(i.id,i.qty)}${i.unknown?' (à vérifier)':''}`).join('\n')).join('\n\n');}
  function printDocument(mode){
    const eco='🌱 Pensez à la planète : vos menus et votre liste de courses sont aussi disponibles sur votre téléphone. N’imprimez que si vous en avez besoin.';
    let html='<h1>Frigo Express — '+(mode==='menu'?'Menus de la semaine':mode==='courses'?'Liste de courses':'Menus & courses')+'</h1>';
    html+=`<p class="print-intro">${state.people} personne${state.people>1?'s':''} · ${mealCount()} repas planifiés · ${new Date().toLocaleDateString('fr-FR')}</p>`;
    if(mode!=='courses'){
      const selected=MEALS.filter(m=>isMealActive(m.id));
      html+='<h2>Planning du lundi au dimanche</h2><table><thead><tr><th>Jour</th>'+selected.map(m=>`<th>${esc(m.label)}</th>`).join('')+'</tr></thead><tbody>';
      html+=state.plan.map((d,i)=>`<tr><th>${WEEKDAYS[i]}</th>${selected.map(m=>`<td>${esc(m.id==='petit'?BYID[d.petit]?.title||'—':displayMeal(d[m.id]))}</td>`).join('')}</tr>`).join('');html+='</tbody></table>';
    }
    if(mode!=='menu'){
      html+='<h2>Liste de courses</h2><div class="print-shop-columns">';
      const items=shopRows();for(const cat of [...new Set(items.map(i=>i.category))]){
        html+=`<section class="print-shop-section"><h3>${esc(cat)}</h3>`;
        html+=items.filter(i=>i.category===cat).map(i=>`<p><span class="print-check"></span>${esc(i.label)} — ${esc(i.manual?'quantité libre':fmtShopping(i.id,i.qty))}${i.unknown?' <strong>(quantité à vérifier)</strong>':''}</p>`).join('');html+='</section>';
      }
      html+='</div>';
    }
    html+='<p class="print-foot">Vérifie les stocks dont la quantité est inconnue. Quantités calculées selon les recettes retenues.</p>';
    html+='<p class="print-eco">'+eco+'</p>';
    $('#printLayout').innerHTML=html;
    window.print();
  }
  function displayMeal(meal){if(!meal)return '—';let out=BYID[meal.plat]?.title||'—';if(state.fullCourses){if(meal.entree)out='Entrée : '+BYID[meal.entree].title+' / '+out;if(meal.dessert)out+=' / Dessert : '+BYID[meal.dessert].title;}return out;}
  async function shareShop(){
    const text=shopText();if(!text){toast('Aucune course à partager.');return;}
    if(navigator.share){try{await navigator.share({title:'Frigo Express — Mes courses',text});return;}catch(e){if(e.name==='AbortError')return;}}
    copyShop();toast('Partage direct indisponible : liste copiée si autorisée.');
  }
  function copyShop(){const content=shopText();if(!content){toast('La liste est vide.');return;}
    if(navigator.clipboard?.writeText){navigator.clipboard.writeText(content).then(()=>toast('Liste copiée.')).catch(()=>fallbackCopy(content));}
    else fallbackCopy(content);
  }
  function fallbackCopy(t){const a=document.createElement('textarea');a.value=t;document.body.appendChild(a);a.select();try{document.execCommand('copy');toast('Liste copiée.');}catch{toast('Impossible de copier sur cet appareil.');}a.remove();}
  function renderAll(){renderStock();renderRecipes();renderWeek();renderShop();renderEquipments();}
  function renderEquipments(){const el=$('#equipmentOptions');if(el)el.innerHTML=EQUIPMENTS.map(([id,label])=>`<label class="equip-option"><input type="checkbox" data-equipment="${id}" ${state.equipments.includes(id)?'checked':''}> ${esc(label)}</label>`).join('');}

  function bind(){
    for(const [id,text] of [['oeuf','+ Œufs'],['pates','+ Pâtes'],['riz','+ Riz'],['fromage','+ Fromage'],['pomme_terre','+ Pommes de terre'],['tomate','+ Tomates'],['jambon','+ Jambon'],['lait','+ Lait']]){
      const b=document.createElement('button');b.type='button';b.className='tag';b.dataset.quick=id;b.textContent=text;$('#quickProducts').appendChild(b);
    }
    document.addEventListener('click',e=>{
      const b=e.target.closest('button,[data-go]');if(!b)return;
      if(b.dataset.page){page(b.dataset.page);return;}
      if(b.dataset.go){page(b.dataset.go);return;}
      if(b.dataset.quick){addQuick(b.dataset.quick);return;}
      if(b.dataset.removeStock){delete state.stock[b.dataset.removeStock];resetProductChecks();save();renderAll();return;}
      if(b.dataset.removeUnknown!==undefined){state.unknown.splice(Number(b.dataset.removeUnknown),1);save();renderAll();return;}
      if(b.dataset.favorite){toggleFavorite(b.dataset.favorite);return;}
      if(b.dataset.recipe){recipeDialog(b.dataset.recipe);return;}
      if(b.dataset.pick){openPicker(b.dataset.pick);return;}
      if(b.dataset.lock){state.locks[b.dataset.lock]=!state.locks[b.dataset.lock];save();renderWeek();return;}
      if(b.dataset.pickRecipe){if(pickerTarget){setWeekSlot(pickerTarget.day,pickerTarget.meal,pickerTarget.course,b.dataset.pickRecipe);delete state.locks[slotKey(pickerTarget.day,pickerTarget.meal,pickerTarget.course)];
        if(['entree','dessert'].includes(pickerTarget.course))state.fullCourses=true;
        save();$('#pickerDialog').close();renderAll();toast('Repas modifié, courses recalculées.');}return;}
      if(b.dataset.deleteManual){state.manual=state.manual.filter(i=>i.id!==b.dataset.deleteManual);delete state.checked['manual:'+b.dataset.deleteManual];save();renderShop();return;}
      if(b.id==='toggleModalFavorite'){toggleFavorite(selectedRecipeId);return;}
      if(b.id==='addRecipeToPlan'){
        const value=$('#recipeSlot')?.value||'',m=value.match(/^([0-6]):(petit|midi|soir):(plat|entree|dessert)$/);if(!m||!selectedRecipeId)return;
        const day=Number(m[1]),meal=m[2],course=m[3];setWeekSlot(day,meal,course,selectedRecipeId);delete state.locks[slotKey(day,meal,course)];
        if(['entree','dessert'].includes(course))state.fullCourses=true;
        save();$('#recipeDialog').close();renderAll();toast('Recette ajoutée au menu. Les courses sont recalculées.');return;
      }
      if(b.dataset.close){$('#'+b.dataset.close).close();return;}
    });
    document.addEventListener('change',e=>{
      const t=e.target;
      if(t.dataset.expiry){const item=state.stock[t.dataset.expiry];if(item){item.expires=/^\d{4}-\d{2}-\d{2}$/.test(t.value)?t.value:'';resetProductChecks();save();renderAll();}return;}
      if(t.dataset.expiryType){const item=state.stock[t.dataset.expiryType];if(item){item.dateType=t.value==='ddm'?'ddm':'dlc';resetProductChecks();save();renderAll();}return;}
      if(t.dataset.quantity){const id=t.dataset.quantity;if(state.stock[id])readStockQuantity(state.stock[id],PRODUCTS[id],t.value);resetProductChecks();save();renderAll();return;}
      if(t.dataset.unit){const id=t.dataset.unit;if(state.stock[id])chooseStockUnit(state.stock[id],PRODUCTS[id],t.value);resetProductChecks();save();renderAll();return;}
      if(t.dataset.packSize){const id=t.dataset.packSize,item=state.stock[id];if(item){const size=Number(t.value.replace(',','.'));item.packSize=Number.isFinite(size)&&size>0&&size<=1000000?size:null;if(item.packSize>0){if(item.packCount!==null)item.qty=item.packCount*item.packSize;else if(item.qty!==null)item.packCount=Number((item.qty/item.packSize).toFixed(3));}else if(item.packCount!==null)item.qty=null;item.detail=item.qty===null?'Précise la contenance et le nombre de paquets':'';resetProductChecks();save();renderAll();}return;}
      if(t.dataset.shopCheck){state.checked[t.dataset.shopCheck]=t.checked;save();renderShop();return;}
    });
    $('#stockAdd').addEventListener('click',()=>{addParsed($('#stockText').value);$('#stockText').value='';});
    $('#stockText').addEventListener('keydown',e=>{if(e.key==='Enter'&&e.ctrlKey){e.preventDefault();$('#stockAdd').click();}});
    const Speech=window.SpeechRecognition||window.webkitSpeechRecognition;
    $('#voiceStock').addEventListener('click',()=>{if(!Speech){toast('Dictée non disponible dans ce navigateur.');return;}
      const recognition=new Speech();recognition.lang='fr-FR';recognition.interimResults=false;recognition.maxAlternatives=1;
      recognition.onresult=e=>{const said=e.results?.[0]?.[0]?.transcript||'';if(said){$('#stockText').value=($('#stockText').value.trim()?$('#stockText').value.trim()+', ':'')+said;showSuggestions();toast('Dictée ajoutée : vérifie les quantités puis valide.');}};
      recognition.onerror=()=>toast('Micro indisponible : utilise la saisie manuelle.');
      try{recognition.start();toast('Parle maintenant. La reconnaissance peut nécessiter Internet.');}catch{toast('Impossible de démarrer le micro.');}
    });
    $('#stockText').addEventListener('input',showSuggestions);
    $('#stockSuggest').addEventListener('click',e=>{const b=e.target.closest('[data-suggest]');if(!b)return;const text=$('#stockText').value;const parts=text.split(/[,;\n]/);parts[parts.length-1]=PRODUCTS[b.dataset.suggest].label;$('#stockText').value=parts.join(', ');$('#stockSuggest').innerHTML='';$('#stockText').focus();});
    $('#clearStock').addEventListener('click',()=>{const count=Object.keys(state.stock).length+state.unknown.length;if(!count)return;$('#clearStockCount').textContent=count+' ingrédient'+(count>1?'s seront supprimés':' sera supprimé');$('#clearStockDialog').showModal();});
    $('#confirmClearStock').addEventListener('click',()=>{const previous=structuredClone({stock:state.stock,unknown:state.unknown});state.stock={};state.unknown=[];resetProductChecks();save();renderAll();$('#clearStockDialog').close();
      const bar=$('#undoBar');bar.hidden=false;bar.dataset.payload=JSON.stringify(previous);toast('Stock vidé. Tu peux annuler la suppression.');});
    $('#undoClearStock').addEventListener('click',()=>{const bar=$('#undoBar');try{const prev=JSON.parse(bar.dataset.payload);state.stock=prev.stock;state.unknown=prev.unknown;resetProductChecks();save();renderAll();toast('Stock restauré.');}catch{toast('Restauration impossible.');}bar.hidden=true;bar.dataset.payload='';});
    for(const [id,mode] of [['modeStock','stock'],['modeAll','all'],['modeFavorites','favorites']])$('#'+id).addEventListener('click',()=>{recipeMode=mode;renderRecipes();});
    for(const id of ['recipeSearch','categoryFilter','timeFilter','originFilter','regionFilter','vegetarianFilter','porkFilter','noOvenFilter','veganFilter','glutenFilter'])$('#'+id).addEventListener(id==='recipeSearch'?'input':'change',renderRecipes);
    $('#peopleCount').addEventListener('change',e=>{state.people=Math.min(12,Math.max(1,Math.round(Number(e.target.value)||2)));resetProductChecks();save();renderAll();});
    $('#mealMode').addEventListener('change',e=>{state.mealMode=Object.hasOwn(MODE_LABEL,e.target.value)?e.target.value:'all';resetProductChecks();save();renderAll();});
    $('#equipmentOptions').addEventListener('change',e=>{if(!e.target.dataset.equipment)return;const eq=e.target.dataset.equipment;state.equipments=state.equipments.filter(v=>v!==eq);if(e.target.checked)state.equipments.push(eq);save();renderAll();});
    for(const [id,field] of [['planPriority','priority'],['planMethod','method']])$('#'+id).addEventListener('change',e=>{state[field]=e.target.value;save();});
    for(const [id,field] of [['planVegetarian','vegetarian'],['planPorkFree','porkFree'],['planCourses','fullCourses']])$('#'+id).addEventListener('change',e=>{state[field]=e.target.checked;if(field==='fullCourses')resetProductChecks();save();renderAll();});
    $('#generateWeek').addEventListener('click',()=>generateWeek());
    $('#printMenu').addEventListener('click',()=>printDocument('menu'));
    $('#printShopping').addEventListener('click',()=>printDocument('courses'));
    $('#printBoth').addEventListener('click',()=>printDocument('both'));
    $('#copyShopping').addEventListener('click',copyShop);
    $('#shareShopping').addEventListener('click',shareShop);
    $('#manualAdd').addEventListener('click',addManual);
    $('#manualItem').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();addManual();}});
    for(const id of ['settingsBtn','footerSettings'])$('#'+id).addEventListener('click',()=>$('#settingsDialog').showModal());
    $('#equipmentSettingsLink').addEventListener('click',()=>$('#settingsDialog').showModal());
    $('#originFilter').addEventListener('change',()=>{$('#regionFilter').value='all';renderRecipes();});
    $('#pickerSearch').addEventListener('input',renderPicker);
    $('#exportData').addEventListener('click',()=>{
      const blob=new Blob([JSON.stringify({app:'Frigo Express',version:D.version,exportedAt:new Date().toISOString(),data:state},null,2)],{type:'application/json'});
      const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='Frigo_Express_Sauvegarde_'+new Date().toISOString().slice(0,10)+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);toast('Sauvegarde exportée.');
    });
    $('#importData').addEventListener('change',async e=>{
      const file=e.target.files?.[0];if(!file)return;if(file.size>1000000){toast('Fichier trop volumineux.');e.target.value='';return;}
      try{const json=JSON.parse(await file.text());if(json.app!=='Frigo Express'||!json.data||!Array.isArray(json.data.plan))throw Error('Format non reconnu');
        if(!confirm('Importer cette sauvegarde et remplacer les données de cet appareil ?'))return;
        state=validate(json.data);save();renderAll();$('#settingsDialog').close();toast('Sauvegarde importée.');
      }catch{toast('Import impossible : fichier invalide.');}finally{e.target.value='';}
    });
    for(const dlg of document.querySelectorAll('dialog'))dlg.addEventListener('click',e=>{if(e.target===dlg)dlg.close();});
    window.addEventListener('storage',e=>{if(e.key===STORE){state=load();renderAll();toast('Données synchronisées avec cet autre onglet.');}});
  }
  function showSuggestions(){
    const el=$('#stockSuggest'),last=$('#stockText').value.split(/[,;\n]/).at(-1).trim();
    if(last.length<2){el.innerHTML='';return;}
    const term=slug(last).replace(/^(?:\d+(?:[.,]\d+)?|deux|trois|une?)\s*(?:kg|g|ml|cl|l|pièces?)?\s*(?:de\s+)?/,'').trim();
    if(term.length<2){el.innerHTML='';return;}
    const matches=Object.values(PRODUCTS).filter(p=>slug(p.label).includes(term)||p.aliases.some(a=>slug(a).startsWith(term))).slice(0,6);
    el.innerHTML=matches.map(p=>`<button type="button" data-suggest="${p.id}">${esc(p.label)} <span>${esc(p.unit)}</span></button>`).join('');
  }
  function addManual(){const input=$('#manualItem');const label=input.value.trim().slice(0,90);if(!label)return;
    if(state.manual.some(x=>slug(x.label)===slug(label))){toast('Produit déjà ajouté.');return;}
    const id='m'+Date.now().toString(36)+Math.random().toString(36).slice(2,7);state.manual.push({id,label});input.value='';save();renderShop();toast('Produit ajouté aux courses.');
  }
  function toggleFavorite(id){if(!BYID[id])return;const i=state.favorites.indexOf(id);if(i>=0)state.favorites.splice(i,1);else state.favorites.push(id);save();renderRecipes();if($('#recipeDialog').open&&selectedRecipeId===id)$('#toggleModalFavorite').textContent=state.favorites.includes(id)?'★ Retirer des favoris':'☆ Ajouter aux favoris';}
  // Initialisation
  initOrigins();
  bind();
  if(!weekRecipeIds().length)generateWeek(false);
  renderAll();
  if('serviceWorker'in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('./sw.js').catch(()=>{});
  // API de test uniquement : pas d'opérations réseau.
  window.FRIGO_TEST={originLabel,ORIGINS,parseStock,matchRecipe,ingredientsNeeded,shopRows,validate,getState:()=>structuredClone(state),setState:s=>{state=validate(s);save();renderAll();},generateWeek:()=>generateWeek(false),printDocument,fmt,fmtShopping,productFromText,mealCount,unitChoices,displayQty,readStockQuantity,chooseStockUnit,equipmentAllowed};
})();
