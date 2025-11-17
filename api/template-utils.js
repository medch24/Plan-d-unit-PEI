import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import fs from 'fs';
import { DESCRIPTEURS_COMPLETS } from './descripteurs-complets.js';

/**
 * Extract sub-criteria (i, ii, iii, iv) from descriptor text
 * Example: "L'élève : i. explique ... ; ii. construit ... ; iii. analyse ..."
 * Returns: {i: "explique...", ii: "construit...", iii: "analyse..."}
 */
export function extractSubCriteria(descriptorText) {
  if (!descriptorText || typeof descriptorText !== 'string') return {};
  
  const subCriteria = {};
  // Match patterns like "i. text" or "ii. text" etc.
  const matches = descriptorText.matchAll(/([ivx]+)\.\s*([^;]+)/gi);
  
  for (const match of matches) {
    const [, roman, text] = match;
    subCriteria[roman.toLowerCase()] = text.trim();
  }
  
  return subCriteria;
}

/**
 * Get full sub-criteria list for a criterion
 * Returns all i, ii, iii, iv found across all level ranges
 */
export function getAllSubCriteria(criterionData) {
  if (!criterionData || !criterionData.niveaux) return {};
  
  const allSubs = {};
  
  // Parse each level range to find sub-criteria
  for (const [level, text] of Object.entries(criterionData.niveaux)) {
    if (level === '0') continue; // Skip level 0
    
    const subs = extractSubCriteria(text);
    // Keep the most detailed version (usually from highest level)
    Object.assign(allSubs, subs);
  }
  
  return allSubs;
}

/**
 * Format sub-criteria as a bulleted list
 */
export function formatSubCriteriaList(subCriteria) {
  if (!subCriteria || Object.keys(subCriteria).length === 0) {
    return "Aucun sous-critère spécifique défini.";
  }
  
  return Object.entries(subCriteria)
    .map(([roman, text]) => `${roman}. ${text}`)
    .join('\n');
}

/**
 * Get criterion data from DESCRIPTEURS_COMPLETS
 */
export function getCriterionData(matiere, classeKey, critere) {
  const matiereKey = (matiere || "").toLowerCase().replace(/\s+/g, '_');
  const pool = DESCRIPTEURS_COMPLETS[matiereKey];
  
  if (!pool) {
    console.warn(`⚠️  No descriptors found for matiere: ${matiere}`);
    return null;
  }
  
  // Map classe to PEI level
  let peiLevel = 'pei1';
  if (classeKey.includes('1') || classeKey.includes('2')) peiLevel = 'pei1';
  else if (classeKey.includes('3') || classeKey.includes('4')) peiLevel = 'pei3';
  else if (classeKey.includes('5')) peiLevel = 'pei5';
  
  const yearData = pool[peiLevel];
  if (!yearData) {
    console.warn(`⚠️  No descriptors found for level: ${peiLevel}`);
    return null;
  }
  
  // Handle "same_as_peiX" references
  if (typeof yearData === 'string' && yearData.startsWith('same_as_')) {
    const refLevel = yearData.split('_')[2]; // Extract "pei1" from "same_as_pei1"
    return pool[refLevel]?.[critere] || null;
  }
  
  return yearData[critere] || null;
}

/**
 * Fill Plan template with data
 */
export async function fillPlanTemplate(templatePath, data) {
  const content = fs.readFileSync(templatePath);
  const zip = new PizZip(content);
  
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
    nullGetter: (part) => {
      console.warn(`⚠️  Missing placeholder: ${part.value}`);
      return `[${part.value}]`; // Show missing placeholders
    }
  });
  
  // Prepare data with all required fields
  const templateData = {
    enseignant: data.enseignant || 'Nom de l\'enseignant',
    groupe_matiere: data.groupe_matiere || data.matiere || '',
    titre_unite: data.titre_unite || data.titre || '',
    annee_pei: data.annee_pei || data.classe || '',
    duree: data.duree || '',
    concept_cle: data.concept_cle || '',
    concepts_connexes: data.concepts_connexes || '',
    contexte_mondial: data.contexte_mondial || '',
    enonce_de_recherche: data.enonce_de_recherche || '',
    questions_factuelles: data.questions_factuelles || '',
    questions_conceptuelles: data.questions_conceptuelles || '',
    questions_debat: data.questions_debat || '',
    objectifs_specifiques: data.objectifs_specifiques || '',
    evaluation_sommative: data.evaluation_sommative || '',
    approches_apprentissage: data.approches_apprentissage || '',
    contenu: data.contenu || '',
    processus_apprentissage: data.processus_apprentissage || '',
    ressources: data.ressources || '',
    differenciation: data.differenciation || '',
    evaluation_formative: data.evaluation_formative || '',
    reflexion_avant: data.reflexion_avant || '',
    reflexion_pendant: data.reflexion_pendant || '',
    reflexion_apres: data.reflexion_apres || ''
  };
  
  doc.setData(templateData);
  
  try {
    doc.render();
  } catch (error) {
    console.error('❌ Template rendering error:', error);
    throw error;
  }
  
  return doc.getZip().generate({ 
    type: 'nodebuffer',
    compression: 'DEFLATE'
  });
}

/**
 * Fill Eval template with data including exercises
 */
export async function fillEvalTemplate(templatePath, data) {
  const content = fs.readFileSync(templatePath);
  const zip = new PizZip(content);
  
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
    nullGetter: (part) => {
      console.warn(`⚠️  Missing placeholder: ${part.value}`);
      return `[${part.value}]`;
    }
  });
  
  // Get criterion data
  const criterionData = getCriterionData(
    data.groupe_matiere || data.matiere,
    data.annee_pei || data.classe,
    data.lettre_critere || 'A'
  );
  
  // Extract sub-criteria
  const subCriteria = criterionData ? getAllSubCriteria(criterionData) : {};
  
  // Format sub-criteria for template
  const objectifs_specifiques_formatted = formatSubCriteriaList(subCriteria);
  
  // Prepare exercises data
  const exercices = data.exercices || [];
  
  // Prepare descriptors
  const niveaux = criterionData?.niveaux || {};
  
  const templateData = {
    annee_pei: data.annee_pei || data.classe || '',
    groupe_matiere: data.groupe_matiere || data.matiere || '',
    titre_unite: data.titre_unite || data.titre || '',
    objectifs_specifiques: objectifs_specifiques_formatted,
    enonce_de_recherche: data.enonce_de_recherche || '',
    lettre_critere: data.lettre_critere || 'A',
    nom_objectif_specifique: criterionData?.titre || 'Critère d\'évaluation',
    Exercices: data.Exercices || 'Exercices à compléter',
    descripteur_1_2: niveaux['1-2'] || '',
    descripteur_3_4: niveaux['3-4'] || '',
    descripteur_5_6: niveaux['5-6'] || '',
    descripteur_7_8: niveaux['7-8'] || ''
  };
  
  doc.setData(templateData);
  
  try {
    doc.render();
  } catch (error) {
    console.error('❌ Template rendering error:', error);
    throw error;
  }
  
  return doc.getZip().generate({ 
    type: 'nodebuffer',
    compression: 'DEFLATE'
  });
}

export default {
  extractSubCriteria,
  getAllSubCriteria,
  formatSubCriteriaList,
  getCriterionData,
  fillPlanTemplate,
  fillEvalTemplate
};
