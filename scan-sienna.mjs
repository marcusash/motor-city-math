import { getDocument } from 'pdfjs-dist';
import { readFileSync } from 'fs';
const data = new Uint8Array(readFileSync("C:\\Users\\marcusash\\OneDrive - Microsoft\\Documents\\Scan from 2026-03-20 09_30_21 PM.pdf"));
const doc = await getDocument({data, useSystemFonts:true}).promise;
console.log('pages:', doc.numPages);
let total = 0;
for(let i=1;i<=doc.numPages;i++){
  const page = await doc.getPage(i);
  const c = await page.getTextContent();
  total += c.items.length;
  console.log('page '+i+': '+c.items.length+' items: '+c.items.slice(0,8).map(x=>x.str).join(' '));
}
console.log('total items:', total);
