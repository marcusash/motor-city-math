const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require('playwright');
const root = path.resolve(__dirname,'..');
const names = ['rational-functions-practice-2026-11-12','cumulative-final-practice-2026-11-21','final-rehearsal-2026-11-22'];
const expected = ['54/58 (93.1%)','113.75/128 (88.9%)','92.75/100 (92.8%)'];
test('reports and dashboard retain exact awards, readable mobile/print layout and source navigation', {timeout:180000}, async()=>{
    const types={'.html':'text/html','.js':'application/javascript','.css':'text/css','.svg':'image/svg+xml','.woff2':'font/woff2'};
    const server=http.createServer(async(req,res)=>{
        const pathname=new URL(req.url,'http://localhost').pathname;
        const file=path.resolve(root,'.'+decodeURIComponent(pathname==='/'?'/index.html':pathname));
        if(!file.startsWith(root+path.sep)) return res.writeHead(403).end();
        try{res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream'});res.end(await fs.readFile(file));}
        catch(error){res.writeHead(error.code==='ENOENT'?404:500).end();}
    });
    await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
    const base='http://127.0.0.1:'+server.address().port;
    let browser;
    try{
        browser=await chromium.launch({channel:'msedge',headless:true});
        const page=await browser.newPage({viewport:{width:1280,height:1000}});
        const errors=[];
        page.on('pageerror',error=>errors.push(error.message));
        await page.route('https://api.github.com/**',route=>route.fulfill({status:404,body:'{}'}));
        for(const [index,name] of names.entries()){
            await page.goto(base+'/reviews/'+name+'.html');
            await page.evaluate(()=>document.fonts.ready);
            assert.equal(await page.locator('#score').textContent(),expected[index]);
            assert.equal(await page.locator('article').count(),[13,16,14][index]);
            assert.equal(await page.locator('img,iframe,embed,.katex-error').count(),0);
            const componentCount=await page.evaluate(()=>practiceGradeReport.questions.reduce((n,q)=>n+q.components.length,0));
            assert.equal(await page.locator('.rubric-table tbody tr').count(),componentCount);
            for(const width of [320,390,1280]){
                await page.setViewportSize({width,height:1000});
                assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,name+' page overflow');
                if(process.env.MCM_REPORT_EVIDENCE){
                    await fs.mkdir(process.env.MCM_REPORT_EVIDENCE,{recursive:true});
                    await page.screenshot({path:path.join(process.env.MCM_REPORT_EVIDENCE,name+'-'+width+'.png'),fullPage:true});
                }
            }
            const first=page.locator('details').first();
            await first.evaluate(detail=>{detail.open=false;});
            await page.emulateMedia({media:'print'});
            await page.evaluate(()=>dispatchEvent(new Event('beforeprint')));
            assert.equal(await page.locator('details[open]').count(),[13,16,14][index]);
            assert.equal(await page.locator('.review-actions').isVisible(),false);
            if(process.env.MCM_GENERATE_REPORT_PDFS==='1'){
                await page.pdf({path:path.join(root,'reviews',name+'.pdf'),preferCSSPageSize:true,printBackground:true});
            }
            await page.evaluate(()=>dispatchEvent(new Event('afterprint')));
            assert.equal(await first.evaluate(detail=>detail.open),false);
            await page.emulateMedia({media:'screen'});
        }
        for(const colorScheme of ['light','dark']){
            await page.emulateMedia({colorScheme});
            for(const width of [320,390,1280]){
                await page.setViewportSize({width,height:1000});
                await page.goto(base+'/index.html');
                await page.evaluate(()=>document.fonts.ready);
                assert.equal(await page.locator('#precalculusGrid .activity-card').count(),9);
                assert.equal(await page.locator('[data-score-point]').count(),8);
                assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
                assert.equal(await page.locator('body').evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(13, 17, 23)');
                const chart=page.locator('#precalculusChartContainer');
                await page.waitForFunction(()=>{
                    const chart=document.getElementById('precalculusChartContainer');
                    return chart.querySelector('svg').viewBox.baseVal.width===chart.clientWidth;
                });
                assert.equal(await chart.evaluate(el=>el.scrollWidth<=el.clientWidth),true,'Chart must fit, not scroll');
                const geometry=await chart.evaluate(el=>{
                    const box=el.getBoundingClientRect();
                    const labels=[...el.querySelectorAll('svg text')].map(text=>text.getBoundingClientRect());
                    const points=[...el.querySelectorAll('[data-score-point]')].map(point=>point.getBoundingClientRect());
                    return {
                        outside:[...labels,...points].filter(rect=>rect.left<box.left-1 || rect.right>box.right+1 ||
                            rect.top<box.top-1 || rect.bottom>box.bottom+1).length,
                        overlaps:labels.filter((label,i)=>labels.slice(i+1).some(other=>
                            label.left<other.right && label.right>other.left &&
                            label.top<other.bottom && label.bottom>other.top)).length
                    };
                });
                assert.equal(geometry.outside,0,'Every point and label must stay inside the chart');
                assert.equal(geometry.overlaps,0,'Chart labels must not overlap');
                const finalPoint=chart.locator('[data-score-point="8"]');
                await finalPoint.focus();
                assert.equal(await finalPoint.evaluate(el=>el===document.activeElement),true);
                assert.match(await finalPoint.getAttribute('aria-label'),/Rehearsal, 92.8%, Review Nov 22, practice review/);
                const scores=await chart.locator('[data-score-point]').evaluateAll(points=>
                    points.map(point=>Number(point.getAttribute('aria-label').split(', ')[1].replace('%',''))));
                assert.deepEqual(scores,[84,89.5,72.6,46.1,65.5,93.1,88.9,92.8]);
                const fontSize=await chart.locator('svg text').evaluateAll(labels=>Math.min(...labels.map(label=>
                    Number(label.getAttribute('font-size'))*label.getScreenCTM().a)));
                assert.ok(fontSize>=12,'Smallest rendered chart label: '+fontSize);
                assert.equal(await chart.locator('rect[transform]').count(),2);
                assert.equal(await page.locator('.chart-note,.chart-scores,#precalculusFirstScore').count(),0);
                assert.equal(await page.locator('.activity-card__kind,.activity-card__subject,.activity-card__note,.activity-card__result-label').count(),0);
                const rehearsalCard=page.locator('.activity-card[href="reviews/final-rehearsal-2026-11-22.html"]');
                assert.equal(await rehearsalCard.locator('h3').count(),1);
                assert.equal(await rehearsalCard.locator('.activity-card__points').textContent(),'92.75/100');
                if(width===1280)assert.ok(await rehearsalCard.evaluate(el=>el.clientWidth)>440,'Cards should use the wider layout');
                await finalPoint.evaluate(el=>el.blur());
                if(process.env.MCM_REPORT_EVIDENCE){
                    await page.screenshot({path:path.join(process.env.MCM_REPORT_EVIDENCE,'dashboard-'+colorScheme+'-'+width+'.png'),fullPage:true});
                }
            }
            for(const width of [390,1280,320,768]){
                await page.setViewportSize({width,height:1000});
                await page.waitForFunction(()=>{
                    const chart=document.getElementById('precalculusChartContainer');
                    return chart.querySelector('svg').viewBox.baseVal.width===chart.clientWidth;
                });
                assert.equal(await page.locator('#precalculusChartContainer').evaluate(el=>el.scrollWidth<=el.clientWidth),true);
                assert.equal(await page.locator('[data-score-point]').count(),8);
            }
        }
        assert.deepEqual(errors,[]);
    }finally{
        if(browser)await browser.close();
        await new Promise(resolve=>server.close(resolve));
    }
});
