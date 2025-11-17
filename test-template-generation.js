/**
 * Test script for template-based document generation
 */

const testData = {
  plan: {
    enseignant: "M. Dupont",
    matiere: "Sciences",
    classe: "Année 3-4 du PEI",
    unite: {
      titre: "L'énergie et ses transformations",
      duree: "6 semaines (18 heures)",
      concept_cle: "Changement",
      concepts_connexes: "Énergie, Systèmes, Transformation",
      contexte_mondial: "Innovation scientifique et technique",
      enonce_recherche: "Comment l'énergie se transforme-t-elle dans les systèmes?",
      questions_factuelles: "Quelles sont les formes d'énergie?\nComment mesure-t-on l'énergie?",
      questions_conceptuelles: "Pourquoi l'énergie ne peut-elle ni être créée ni détruite?",
      questions_debat: "Les énergies renouvelables peuvent-elles remplacer les énergies fossiles?",
      objectifs_specifiques: "A.i - Décrire les concepts scientifiques\nA.ii - Appliquer les connaissances scientifiques",
      evaluation_sommative: "Évaluation sur les critères A et B",
      approches_apprentissage: "Compétences de recherche et de pensée critique",
      contenu: "Formes d'énergie, transformations, conservation",
      ressources: "Manuel de sciences, vidéos éducatives, matériel de laboratoire",
      differenciation: "Support supplémentaire pour élèves en difficulté",
      evaluation_formative: "Observations continues, quiz formatifs",
      reflexion_avant: "Préparation du matériel de laboratoire",
      reflexion_pendant: "Ajustements selon les besoins des élèves",
      reflexion_apres: "Analyse des résultats d'évaluation"
    }
  },
  eval: {
    matiere: "Sciences",
    classe: "Année 3-4 du PEI",
    critere: "A",
    unite: {
      titre: "L'énergie et ses transformations",
      enonce_recherche: "Comment l'énergie se transforme-t-elle dans les systèmes?"
    }
  }
};

console.log('📋 Test Data Prepared');
console.log('====================\n');

console.log('📄 Plan Template Data:');
console.log(JSON.stringify(testData.plan, null, 2));

console.log('\n📄 Eval Template Data:');
console.log(JSON.stringify(testData.eval, null, 2));

console.log('\n✅ Test data ready for API calls');
console.log('\nTo test:');
console.log('1. POST to /api/generate-plan-template with testData.plan');
console.log('2. POST to /api/generate-eval-template with testData.eval');
