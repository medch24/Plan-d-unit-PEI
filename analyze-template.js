import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import fs from 'fs';

function analyzeTemplate(filePath) {
  console.log(`\n📄 Analyzing: ${filePath}`);
  console.log('='.repeat(60));
  
  try {
    const content = fs.readFileSync(filePath);
    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
      nullGetter: () => ''
    });
    
    // Extract placeholders
    const tags = doc.getFullText().match(/\{[^}]+\}/g) || [];
    const uniqueTags = [...new Set(tags)];
    
    console.log(`\n✅ Found ${uniqueTags.length} unique placeholders:\n`);
    uniqueTags.sort().forEach(tag => {
      console.log(`   ${tag}`);
    });
    
    // Get full text to see structure
    const fullText = doc.getFullText();
    console.log(`\n📊 Document length: ${fullText.length} characters`);
    console.log(`\n📝 First 500 characters:\n${fullText.substring(0, 500)}...`);
    
  } catch (error) {
    console.error(`❌ Error analyzing ${filePath}:`, error.message);
  }
}

// Analyze both templates
analyzeTemplate('./templates/Plan_TEMPLATE_NEW.docx');
analyzeTemplate('./templates/Eval_TEMPLATE_NEW.docx');
