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
                assert.equal(await page.locator('#precalculusChartScores li').count(),8);
                assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
                assert.equal(await page.locator('body').evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(13, 17, 23)');
                const chart=page.locator('#precalculusChartContainer');
                await chart.focus();
                assert.equal(await chart.evaluate(el=>el===document.activeElement),true);
                const fontSize=await chart.locator('svg text').evaluateAll(labels=>Math.min(...labels.map(label=>
                    Number(label.getAttribute('font-size'))*label.getScreenCTM().a)));
                assert.ok(fontSize>=12,'Smallest rendered chart label: '+fontSize);
                assert.equal(await chart.locator('rect[transform]').count(),2);
                await page.locator('.chart-scores summary').click();
                assert.match(await page.locator('#precalculusChartScores').textContent(),/Rehearsal.*92.8%.*Review Nov 22.*Practice review/);
                if(process.env.MCM_REPORT_EVIDENCE){
                    await page.screenshot({path:path.join(process.env.MCM_REPORT_EVIDENCE,'dashboard-'+colorScheme+'-'+width+'.png'),fullPage:true});
                }
            }
        }
        assert.deepEqual(errors,[]);
    }finally{
        if(browser)await browser.close();
        await new Promise(resolve=>server.close(resolve));
    }
});
