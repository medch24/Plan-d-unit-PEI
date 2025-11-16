#!/usr/bin/env python3
"""
Script de test pour la génération d'unités PEI
"""

import requests
import json

# URL de l'API (ajustez selon votre configuration)
BASE_URL = "http://localhost:5000"

def test_get_matieres():
    """Test de récupération des matières"""
    print("🧪 Test 1: Récupération des matières...")
    response = requests.get(f"{BASE_URL}/api/matieres")
    if response.status_code == 200:
        matieres = response.json()
        print(f"✅ {len(matieres)} matières disponibles:")
        for key, value in matieres.items():
            print(f"   - {value['nom']} ({key})")
        return True
    else:
        print(f"❌ Erreur: {response.status_code}")
        return False

def test_generate_units():
    """Test de génération d'unités"""
    print("\n🧪 Test 2: Génération d'unités pour Design (PEI 1-2)...")
    
    # Données de test
    data = {
        "matiere": "design",
        "annee_pei": "pei1-2",
        "enseignant": "Test Enseignant",
        "chapitres": [
            {
                "id": 0,
                "titre": "Introduction au design thinking",
                "contenu": "Comprendre les principes de base du design thinking, l'empathie utilisateur, et le processus itératif de création.",
                "duree": 8
            },
            {
                "id": 1,
                "titre": "Analyse de produits existants",
                "contenu": "Étude de cas de produits réussis, identification des forces et faiblesses, analyse comparative.",
                "duree": 10
            },
            {
                "id": 2,
                "titre": "Prototypage rapide",
                "contenu": "Techniques de création de prototypes, matériaux, outils, tests utilisateurs.",
                "duree": 12
            },
            {
                "id": 3,
                "titre": "Tests et itération",
                "contenu": "Méthodes de test, collecte de feedback, amélioration itérative du design.",
                "duree": 8
            },
            {
                "id": 4,
                "titre": "Présentation de projet",
                "contenu": "Communication visuelle, storytelling, présentation orale et écrite du projet.",
                "duree": 6
            },
            {
                "id": 5,
                "titre": "Design durable",
                "contenu": "Principes d'éco-conception, cycle de vie des produits, matériaux durables.",
                "duree": 8
            }
        ]
    }
    
    response = requests.post(
        f"{BASE_URL}/api/generate-units",
        json=data,
        headers={"Content-Type": "application/json"}
    )
    
    if response.status_code == 200:
        result = response.json()
        units = result.get('units', [])
        print(f"✅ {len(units)} unités générées:")
        for i, unit in enumerate(units, 1):
            print(f"\n   📘 Unité {i}: {unit.get('titre_unite', 'N/A')}")
            print(f"      ⏱️  Durée: {unit.get('duree', 0)} heures")
            print(f"      🔑 Concept clé: {unit.get('concept_cle', 'N/A')}")
            print(f"      🌐 Contexte: {unit.get('contexte_mondial', 'N/A')}")
            print(f"      🎯 Objectifs: {', '.join(unit.get('objectifs_specifiques', []))}")
        return True
    else:
        print(f"❌ Erreur: {response.status_code}")
        print(f"   Message: {response.text}")
        return False

def test_generate_units_langue_litterature():
    """Test de génération pour Langue et littérature (6 unités)"""
    print("\n🧪 Test 3: Génération d'unités pour Langue et littérature (PEI 3-4)...")
    
    data = {
        "matiere": "langue_litterature",
        "annee_pei": "pei3-4",
        "enseignant": "Test Enseignant",
        "chapitres": [
            {
                "id": 0,
                "titre": "Poésie lyrique",
                "contenu": "Étude des formes poétiques, figures de style, thèmes lyriques.",
                "duree": 10
            },
            {
                "id": 1,
                "titre": "Roman réaliste",
                "contenu": "Analyse de romans réalistes du XIXe siècle, contexte historique.",
                "duree": 12
            },
            {
                "id": 2,
                "titre": "Théâtre classique",
                "contenu": "Tragédie et comédie classiques, règles du théâtre, représentation.",
                "duree": 10
            },
            {
                "id": 3,
                "titre": "Nouvelle contemporaine",
                "contenu": "Structure de la nouvelle, chute, suspense, auteurs contemporains.",
                "duree": 8
            },
            {
                "id": 4,
                "titre": "Production écrite créative",
                "contenu": "Écriture d'invention, pastiche, imitation de styles.",
                "duree": 10
            },
            {
                "id": 5,
                "titre": "Argumentation",
                "contenu": "Essai argumentatif, thèse, arguments, contre-arguments.",
                "duree": 12
            },
            {
                "id": 6,
                "titre": "Analyse comparative",
                "contenu": "Comparaison de textes, intertextualité, influences.",
                "duree": 8
            },
            {
                "id": 7,
                "titre": "Oral individuel",
                "contenu": "Préparation et présentation orale, analyse textuelle.",
                "duree": 8
            }
        ]
    }
    
    response = requests.post(
        f"{BASE_URL}/api/generate-units",
        json=data,
        headers={"Content-Type": "application/json"}
    )
    
    if response.status_code == 200:
        result = response.json()
        units = result.get('units', [])
        print(f"✅ {len(units)} unités générées (doit être 6):")
        for i, unit in enumerate(units, 1):
            print(f"\n   📘 Unité {i}: {unit.get('titre_unite', 'N/A')}")
            print(f"      ⏱️  Durée: {unit.get('duree', 0)} heures")
        return len(units) == 6
    else:
        print(f"❌ Erreur: {response.status_code}")
        return False

def main():
    """Exécute tous les tests"""
    print("=" * 60)
    print("🚀 Tests du Générateur d'Unités PEI")
    print("=" * 60)
    
    tests_passed = 0
    tests_total = 3
    
    if test_get_matieres():
        tests_passed += 1
    
    if test_generate_units():
        tests_passed += 1
    
    if test_generate_units_langue_litterature():
        tests_passed += 1
    
    print("\n" + "=" * 60)
    print(f"📊 Résultats: {tests_passed}/{tests_total} tests réussis")
    print("=" * 60)
    
    if tests_passed == tests_total:
        print("✅ Tous les tests sont passés avec succès!")
        return 0
    else:
        print(f"❌ {tests_total - tests_passed} test(s) ont échoué")
        return 1

if __name__ == "__main__":
    exit(main())
