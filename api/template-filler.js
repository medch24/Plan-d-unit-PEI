// Template Word Filler using docxtemplater
import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Fill Word template with data
 * @param {string} templatePath - Path to template .docx file
 * @param {object} data - Data object with placeholders as keys
 * @returns {Buffer} - Filled document as buffer
 */
export async function fillTemplate(templatePath, data) {
  try {
    // Read the template
    const content = fs.readFileSync(templatePath, 'binary');
    
    // Create a PizZip instance
    const zip = new PizZip(content);
    
    // Create docxtemplater instance
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
      nullGetter: () => '' // Return empty string for undefined values
    });
    
    // Set the data
    doc.setData(data);
    
    // Render the document
    doc.render();
    
    // Get the zip document and generate a NodeJS buffer
    const buf = doc.getZip().generate({
      type: 'nodebuffer',
      compression: 'DEFLATE'
    });
    
    return buf;
  } catch (error) {
    console.error('[ERROR] Template filling failed:', error);
    if (error.properties && error.properties.errors) {
      console.error('[ERROR] Template errors:', JSON.stringify(error.properties.errors, null, 2));
    }
    throw error;
  }
}

/**
 * Extract placeholders from Word template
 * @param {string} templatePath - Path to template .docx file
 * @returns {Array<string>} - List of placeholders found
 */
export function extractPlaceholders(templatePath) {
  try {
    const content = fs.readFileSync(templatePath, 'binary');
    const zip = new PizZip(content);
    
    // Get document.xml content
    const doc = zip.file('word/document.xml');
    if (!doc) throw new Error('document.xml not found in template');
    
    const xmlContent = doc.asText();
    
    // Extract placeholders using regex
    const placeholderRegex = /{([^}]+)}/g;
    const placeholders = new Set();
    let match;
    
    while ((match = placeholderRegex.exec(xmlContent)) !== null) {
      placeholders.add(match[1]);
    }
    
    return Array.from(placeholders).sort();
  } catch (error) {
    console.error('[ERROR] Failed to extract placeholders:', error);
    throw error;
  }
}

// If run directly, analyze templates
if (import.meta.url === `file://${process.argv[1]}`) {
  const templatesDir = path.join(__dirname, '../templates');
  
  console.log('\n=== PLAN TEMPLATE PLACEHOLDERS ===');
  const planPlaceholders = extractPlaceholders(path.join(templatesDir, 'Plan_TEMPLATE.docx'));
  planPlaceholders.forEach(p => console.log(`  {${p}}`));
  
  console.log('\n=== EVAL TEMPLATE PLACEHOLDERS ===');
  const evalPlaceholders = extractPlaceholders(path.join(templatesDir, 'Eval_TEMPLATE.docx'));
  evalPlaceholders.forEach(p => console.log(`  {${p}}`));
}
