import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import fs from 'fs';

function verifyTemplate(filePath, templateName) {
  console.log(`\n📄 Verifying: ${templateName}`);
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
    const fullText = doc.getFullText();
    const tags = fullText.match(/\{[^}]+\}/g) || [];
    const uniqueTags = [...new Set(tags)];
    
    console.log(`\n✅ Found ${uniqueTags.length} unique placeholders:\n`);
    uniqueTags.sort().forEach((tag, idx) => {
      console.log(`   ${idx + 1}. ${tag}`);
    });
    
    console.log(`\n📊 Total placeholder occurrences: ${tags.length}`);
    console.log(`✅ Template is valid and ready to use!`);
    
    return { success: true, placeholders: uniqueTags };
    
  } catch (error) {
    console.error(`❌ Error verifying ${templateName}:`, error.message);
    return { success: false, error: error.message };
  }
}

console.log('🔍 Verifying Clean Templates');
console.log('='.repeat(60));

const planResult = verifyTemplate(
  './templates/Plan_CLEAN_TEMPLATE.docx',
  'Plan Template'
);

const evalResult = verifyTemplate(
  './templates/Eval_CLEAN_TEMPLATE.docx',
  'Eval Template'
);

console.log('\n' + '='.repeat(60));
console.log('📊 Summary');
console.log('='.repeat(60));
console.log(`Plan Template: ${planResult.success ? '✅ VALID' : '❌ INVALID'}`);
console.log(`Eval Template: ${evalResult.success ? '✅ VALID' : '❌ INVALID'}`);

if (planResult.success && evalResult.success) {
  console.log('\n✅ Both templates are ready to use!');
  console.log('\n📝 Next steps:');
  console.log('1. Upload templates to a public URL (Google Drive, S3, etc.)');
  console.log('2. Add URLs to Vercel environment variables:');
  console.log('   - PLAN_TEMPLATE_URL');
  console.log('   - EVAL_TEMPLATE_URL');
  console.log('3. Update code to use these environment variables');
}
