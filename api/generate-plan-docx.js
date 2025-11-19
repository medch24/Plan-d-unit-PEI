import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Be tolerant to different env var namings set in Vercel dashboard
function pickEnv(...keys){
    for (const k of keys){
        if (process.env[k]) return process.env[k];
    }
    return "";
}
const PLAN_TEMPLATE_URL = pickEnv('PLAN_TEMPLATE_URL','Plan_TEMPLATE_URL','PLAN_URL','Plan_URL');
const LOCAL_PLAN_TEMPLATE_PATH = join(__dirname, '..', 'public', 'templates', 'plan_template.docx');

// Version: 1.2 - Robust env var handling + better template validation
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    try {
        const { enseignant, matiere, classe, unite } = req.body;

        console.log('[INFO] Generate Plan Request received');
        console.log('[INFO] Environment variables check:', {
            hasTemplateUrl: !!PLAN_TEMPLATE_URL,
            templateUrlLength: PLAN_TEMPLATE_URL?.length || 0
        });

        // 1. Récupérer l'URL du modèle depuis les variables d'environnement
        const templateUrl = PLAN_TEMPLATE_URL;
        if (!templateUrl) {
            const error = "L'URL du modèle de plan n'est pas configurée. Veuillez définir PLAN_TEMPLATE_URL dans les variables d'environnement Vercel.";
            console.error('[ERROR]', error);
            return res.status(500).json({ 
                error: error,
                hint: "Configurez PLAN_TEMPLATE_URL dans Vercel Dashboard > Settings > Environment Variables"
            });
        }

        // 2. Try to load template: URL first, then local fallback
        let templateArrayBuffer;
        
        if (templateUrl) {
            try {
                console.log(`[INFO] Téléchargement du modèle depuis ${templateUrl}`);
                const response = await fetch(templateUrl, { redirect: 'follow' });
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                const ct = response.headers.get('content-type') || '';
                if (!ct.includes('officedocument.wordprocessingml.document')){
                    throw new Error(`Invalid content-type: ${ct}`);
                }
                templateArrayBuffer = await response.arrayBuffer();
                console.log(`[INFO] Template downloaded from URL, size: ${templateArrayBuffer.byteLength} bytes`);
                
                if (templateArrayBuffer.byteLength === 0) {
                    throw new Error('Template is empty');
                }
            } catch (urlError) {
                console.warn('[WARN] Failed to load template from URL:', urlError.message);
                console.log('[INFO] Falling back to local template...');
                templateArrayBuffer = null;
            }
        }
        
        // Fallback to local template if URL failed or not configured
        if (!templateArrayBuffer) {
            try {
                console.log(`[INFO] Loading local template from ${LOCAL_PLAN_TEMPLATE_PATH}`);
                const localBuffer = readFileSync(LOCAL_PLAN_TEMPLATE_PATH);
                templateArrayBuffer = localBuffer.buffer.slice(localBuffer.byteOffset, localBuffer.byteOffset + localBuffer.byteLength);
                console.log(`[INFO] Local template loaded, size: ${templateArrayBuffer.byteLength} bytes`);
            } catch (localError) {
                console.error('[ERROR] Failed to load local template:', localError.message);
                return res.status(500).json({ 
                    error: 'Impossible de charger le template (URL et local ont échoué)',
                    details: localError.message
                });
            }
        }

        // 3. Charger le modèle avec PizZip et Docxtemplater
        console.log('[INFO] Loading template with PizZip...');
        const zip = new PizZip(Buffer.from(templateArrayBuffer));
        const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
            nullGetter: (part) => {
                console.warn(`⚠️  Missing placeholder in template: ${part.value}`);
                return '';
            }
        });

        // 4. Préparer les données pour le template
        // Format objectifs_specifiques_detailles if available, else fallback to simple list
        let objectifsText = '';
        if (Array.isArray(unite?.objectifs_specifiques_detailles)) {
            objectifsText = unite.objectifs_specifiques_detailles
                .map(obj => `• ${obj.critere}.${obj.sous_critere}: ${obj.description}`)
                .join('\n');
        } else if (Array.isArray(unite?.objectifsSpecifiques || unite?.objectifs_specifiques)) {
            objectifsText = (unite?.objectifsSpecifiques || unite?.objectifs_specifiques)
                .map(o => `• ${o}`)
                .join('\n');
        }
        
        const dataToRender = {
            enseignant: enseignant || '',
            groupe_matiere: matiere || '',
            annee_pei: classe || '',
            titre_unite: unite?.titreUnite || unite?.titre_unite || unite?.titre || '',
            duree: unite?.duree || '',
            concept_cle: unite?.conceptCle || unite?.concept_cle || '',
            concepts_connexes: Array.isArray(unite?.conceptsConnexes || unite?.concepts_connexes)
                ? (unite?.conceptsConnexes || unite?.concepts_connexes).join(', ')
                : (unite?.conceptsConnexes || unite?.concepts_connexes || ''),
            contexte_mondial: unite?.contexteMondial || unite?.contexte_mondial || '',
            enonce_de_recherche: unite?.enonceDeRecherche || unite?.enonce_recherche || '',
            questions_factuelles: Array.isArray(unite?.questions?.factuelles || unite?.questions_factuelles)
                ? (unite?.questions?.factuelles || unite?.questions_factuelles).map(q => `• ${q}`).join('\n')
                : '',
            questions_conceptuelles: Array.isArray(unite?.questions?.conceptuelles || unite?.questions_conceptuelles)
                ? (unite?.questions?.conceptuelles || unite?.questions_conceptuelles).map(q => `• ${q}`).join('\n')
                : '',
            questions_debat: Array.isArray(unite?.questions?.debat || unite?.questions_debat)
                ? (unite?.questions?.debat || unite?.questions_debat).map(q => `• ${q}`).join('\n')
                : '',
            objectifs_specifiques: objectifsText,
            // Use generated content, warn if using fallback
            evaluation_sommative: unite?.evaluation_sommative || '[Évaluation sommative non générée - À compléter]',
            approches_apprentissage: unite?.approches_apprentissage || '[Approches ATL non générées - À compléter]',
            contenu: unite?.contenu || '[Contenu non généré - À développer selon les chapitres]',
            processus_apprentissage: unite?.processus_apprentissage || '[Activités non générées - À planifier]',
            ressources: unite?.ressources || '[Ressources non générées - À lister]',
            differenciation: unite?.differenciation || '[Stratégies de différenciation non générées - À définir]',
            evaluation_formative: unite?.evaluation_formative || '[Évaluations formatives non générées - À planifier]',
            reflexion_avant: unite?.reflexion_avant || '[Réflexion avant non générée]',
            reflexion_pendant: unite?.reflexion_pendant || '[Réflexion pendant non générée]',
            reflexion_apres: unite?.reflexion_apres || '[Réflexion après non générée]'
        };

        console.log('[INFO] Rendering template with data...');
        doc.setData(dataToRender);
        doc.render();

        console.log('[INFO] Generating document buffer...');
        const buf = doc.getZip().generate({
            type: 'nodebuffer',
            compression: 'DEFLATE',
        });
        
        console.log('[INFO] Document generated successfully, size:', buf.length);
        
        // 5. Envoyer le fichier généré
        const ts = Date.now();
        res.setHeader('Content-Disposition', `attachment; filename=Plan_Unite_${ts}.docx`);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.status(200).send(buf);

    } catch (error) {
        console.error('Erreur lors de la génération du DOCX:', error);
        console.error('Stack trace:', error.stack);
        res.status(500).json({ error: `Erreur interne: ${error.message}` });
    }
}
