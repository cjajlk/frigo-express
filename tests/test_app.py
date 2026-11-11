"""Tests de fumée E2E : Python + Playwright, Chromium local."""
import json,os
from pathlib import Path
from functools import partial
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from threading import Thread
from playwright.sync_api import sync_playwright

DIR=Path(__file__).resolve().parents[1]
<<<<<<< HEAD
BASE=os.getenv('FRIGO_BASE',DIR.joinpath('index.html').as_uri())
=======
>>>>>>> be7e0664e590d43a1428f935fc2ecba91241fe27

def run():
    server=ThreadingHTTPServer(('127.0.0.1',0),partial(SimpleHTTPRequestHandler,directory=str(DIR)))
    worker=Thread(target=server.serve_forever,daemon=True)
    worker.start()
    try:
        _run(f'http://127.0.0.1:{server.server_port}/index.html')
    finally:
        server.shutdown()
        server.server_close()

def _run(base):
    errors=[]
    with sync_playwright() as p:
        browser=p.chromium.launch(headless=True, args=['--no-sandbox'])
        page=browser.new_page(viewport={"width":390,"height":844},device_scale_factor=1)
        page.on('pageerror',lambda err:errors.append(str(err)))
        page.goto(base, wait_until='load')
        page.wait_for_function('!!window.FRIGO_TEST')
        assert page.locator('h1').inner_text()=='Frigo Express'
<<<<<<< HEAD
        assert page.evaluate('window.FRIGO_DATA.recipes.length')==303
=======
        assert page.evaluate('window.FRIGO_DATA.recipes.length')==151
>>>>>>> be7e0664e590d43a1428f935fc2ecba91241fe27
        assert page.evaluate('Object.keys(window.FRIGO_DATA.products).length') >= 95
        # Parsing des quantités, accents, unités et ambiguïtés
        parsed=page.evaluate("FRIGO_TEST.parseStock('3 œufs, 2 tomates, 500 g de pommes de terre, 1,5 l de lait, jambon, 2 tranches de jambon')")
        assert len(parsed)==6,parsed
        assert [(x.get('id'),x.get('qty')) for x in parsed]==[('oeuf',3),('tomate',2),('pomme_terre',500),('lait',1500),('jambon',None),('jambon',2)],parsed
        assert page.evaluate("FRIGO_TEST.productFromText('œufs')")=='oeuf'
        assert page.evaluate("FRIGO_TEST.productFromText('oeufs')")=='oeuf'
        assert page.evaluate("FRIGO_TEST.productFromText('reste de riz')")=='riz_cuit'
        page.locator('#stockText').fill('3 oeufs, 2 tomates, 500 g pommes de terre, du fromage')
        page.locator('#stockAdd').click()
        assert page.locator('#stockCount').inner_text()=='(4)'
        state=page.evaluate('FRIGO_TEST.getState()')
        assert state['stock']['oeuf']['qty']==3
        assert state['stock']['fromage']['qty'] is None
        # Unités V0.2 et récupération d'un ancien stock : 500 g -> 0,5 kg -> 1,5 kg.
        page.locator('[data-unit="pomme_terre"]').select_option('kg')
        assert page.evaluate('FRIGO_TEST.getState().stock.pomme_terre.qty')==500
        page.locator('[data-quantity="pomme_terre"]').fill('1.5')
        page.locator('[data-quantity="pomme_terre"]').press('Tab')
        assert page.evaluate('FRIGO_TEST.getState().stock.pomme_terre.qty')==1500
        # Fenêtre de suppression : annulation doit laisser le stock intact.
        page.locator('#clearStock').click()
        assert page.locator('#clearConfirmDialog').is_visible()
        page.locator('#clearConfirmDialog [data-close]').click()
        assert page.locator('#stockCount').inner_text()=='(4)'
        # Vérifie réactivité des recettes et filtre
        page.locator('[data-page="recettes"]').click()
        assert page.locator('#recipeGrid .recipe-card').count()>3
        page.locator('#modeAll').click()
<<<<<<< HEAD
        assert page.locator('#recipeGrid .recipe-card').count()==303
=======
        assert page.locator('#recipeGrid .recipe-card').count()==151
>>>>>>> be7e0664e590d43a1428f935fc2ecba91241fe27
        page.locator('#recipeSearch').fill('omelette')
        assert page.locator('#recipeGrid .recipe-card').count() >= 4
        page.locator('#recipeSearch').fill('')
        page.locator('#recipeGrid [data-recipe]').first.click()
        assert page.locator('#recipeDialog').is_visible()
        page.locator('#toggleModalFavorite').click()
        assert len(page.evaluate('FRIGO_TEST.getState().favorites'))==1
        page.locator('#recipeDialog [data-close]').click()
        # Modes de planification : 7 / 14 / 21 repas.
        page.locator('[data-page="semaine"]').click()
        page.locator('#mealMode').select_option('dinner')
        page.locator('#generateWeek').click()
        assert page.evaluate('FRIGO_TEST.selectedMeals().length')==1
        assert page.locator('#planTotal').inner_text().startswith('7')
        page.locator('#mealMode').select_option('lunch-dinner')
        page.locator('#generateWeek').click()
        assert page.evaluate('FRIGO_TEST.selectedMeals().length')==2
        assert page.locator('#planTotal').inner_text().startswith('14')
        page.locator('#mealMode').select_option('all')
        # Test génération 21 repas et ajout entrée/dessert
        page.locator('[data-page="semaine"]').click()
        page.locator('#peopleCount').fill('3')
        page.locator('#peopleCount').press('Tab')
        page.locator('#planCourses').check()
        page.locator('#generateWeek').click()
        data=page.evaluate('FRIGO_TEST.getState()')
        assert len(data['plan'])==7
        assert data['people']==3
        assert all(d['petit'] and d['midi']['plat'] and d['soir']['plat'] for d in data['plan'])
        assert all(d['midi']['entree'] and d['midi']['dessert'] for d in data['plan'])
        assert len(page.evaluate('FRIGO_TEST.shopRows()'))>15
        # Vérifie conservation des menus verrouillés
        first=data['plan'][0]['midi']['plat']
        page.locator('[data-lock="0:midi:plat"]').first.click()
        page.locator('#generateWeek').click()
        assert page.evaluate('FRIGO_TEST.getState().plan[0].midi.plat')==first
        # Remplacement manuel + recalcul
        page.locator('[data-pick="0:midi:plat"]').first.click()
        assert page.locator('#pickerDialog').is_visible()
        page.locator('#pickerSearch').fill('omelette')
        page.locator('#pickerList .picker-option').first.click()
        assert page.evaluate('FRIGO_TEST.getState().plan[0].midi.plat') != first or 'omelette' in page.locator('[data-recipe]').first.inner_text().lower()
        # Produits et checklist
        page.locator('[data-page="courses"]').click()
        page.locator('#manualItem').fill('liquide vaisselle')
        page.locator('#manualAdd').click()
        assert page.get_by_text('liquide vaisselle',exact=True).count()==1
        checkbox=page.locator('[data-shop-check]').first
        key=checkbox.get_attribute('data-shop-check')
        checkbox.check()
        assert page.evaluate('(k)=>FRIGO_TEST.getState().checked[k]',key) is True
        # Contrôle de l'impression
        page.evaluate('window._prints=0;window.print=()=>{window._prints++}')
        page.locator('#printBoth').click()
        assert page.evaluate('window._prints')==1
        assert 'Planning du lundi au dimanche' in page.locator('#printLayout').inner_text()
        # Injection HTML doit être neutralisée dans les données utilisateur
        page.locator('[data-page="frigo"]').click()
        page.locator('#stockText').fill('<img src=x onerror=alert(1)>')
        page.locator('#stockAdd').click()
        assert page.locator('#stockList img').count()==0
        # Persistance après rechargement
        page.reload()
        page.wait_for_function('!!window.FRIGO_TEST')
        assert page.evaluate('FRIGO_TEST.getState().people')==3
        assert page.evaluate('FRIGO_TEST.getState().manual.some(x=>x.label==="liquide vaisselle")')
        page.screenshot(path=str(DIR/'tests'/'mobile_frigo.png'),full_page=True)
        page.locator('[data-page="semaine"]').click()
        page.screenshot(path=str(DIR/'tests'/'mobile_semaine.png'),full_page=True)
        page.locator('[data-page="courses"]').click()
        page.screenshot(path=str(DIR/'tests'/'mobile_courses.png'),full_page=True)
<<<<<<< HEAD
        # Hors ligne : uniquement via HTTP(S), car les service workers sont indisponibles en file://.
        if BASE.startswith('http'):
            page.wait_for_function('navigator.serviceWorker.controller!==null',timeout=15000)
            page.context.set_offline(True)
            page.reload()
            page.wait_for_function('!!window.FRIGO_TEST')
            assert page.locator('h1').inner_text()=='Frigo Express'
            page.context.set_offline(False)
=======
        # Offline après installation service worker
        page.reload()
        page.wait_for_function('navigator.serviceWorker.controller!==null',timeout=15000)
        page.context.set_offline(True)
        page.reload()
        page.wait_for_function('!!window.FRIGO_TEST')
        assert page.locator('h1').inner_text()=='Frigo Express'
        page.context.set_offline(False)
>>>>>>> be7e0664e590d43a1428f935fc2ecba91241fe27
        assert not errors,errors
        print('✅ Tests E2E réussis : catalogue, parseur, frigo, recherches, favoris, planning, liste, impression, XSS, persistance, hors ligne')
        desktop=browser.new_page(viewport={'width':1280,'height':800})
        desktop.goto(base,wait_until='load')
        desktop.screenshot(path=str(DIR/'tests'/'desktop_frigo.png'),full_page=True)
        browser.close()

if __name__=='__main__':run()
