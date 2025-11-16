"""
Gestion de la base de données MongoDB pour stocker les unités générées
"""
from pymongo import MongoClient
from datetime import datetime
import os

# Récupérer l'URL MongoDB depuis les variables d'environnement
MONGODB_URL = os.environ.get('MONGODB_URL', 'mongodb+srv://mohamedsherif:Mmedch86@planpei.jcvu2uq.mongodb.net/?appName=PlanPEI')

# Connexion MongoDB
try:
    client = MongoClient(MONGODB_URL, serverSelectionTimeoutMS=5000)
    db = client['planpei']
    units_collection = db['units']
    sessions_collection = db['sessions']
    print(f"[DEBUG] MongoDB connected successfully")
except Exception as e:
    print(f"[ERROR] MongoDB connection failed: {e}")
    client = None
    db = None
    units_collection = None
    sessions_collection = None

def init_db():
    """Initialise la base de données et crée les index"""
    if db is None:
        print("[WARNING] MongoDB not connected, skipping initialization")
        return
    
    try:
        # Créer des index pour améliorer les performances
        units_collection.create_index([("enseignant", 1), ("created_at", -1)])
        units_collection.create_index([("matiere", 1), ("annee_pei", 1)])
        sessions_collection.create_index([("enseignant", 1), ("created_at", -1)])
        print(f"[DEBUG] Database indexes created")
    except Exception as e:
        print(f"[ERROR] Failed to create indexes: {e}")

def save_unit(enseignant, matiere, annee_pei, unite):
    """Sauvegarde une unité dans MongoDB"""
    if units_collection is None:
        print("[WARNING] MongoDB not connected, unit not saved")
        return None
    
    try:
        document = {
            "enseignant": enseignant,
            "matiere": matiere,
            "annee_pei": annee_pei,
            "titre_unite": unite.get('titre_unite', ''),
            "data": unite,
            "created_at": datetime.utcnow()
        }
        
        result = units_collection.insert_one(document)
        print(f"[DEBUG] Unit saved with ID: {result.inserted_id}")
        return str(result.inserted_id)
    except Exception as e:
        print(f"[ERROR] Failed to save unit: {e}")
        return None

def save_session(enseignant, matiere, annee_pei, chapitres, units):
    """Sauvegarde une session complète de génération"""
    if sessions_collection is None:
        print("[WARNING] MongoDB not connected, session not saved")
        return None
    
    try:
        document = {
            "enseignant": enseignant,
            "matiere": matiere,
            "annee_pei": annee_pei,
            "chapitres": chapitres,
            "units": units,
            "nb_unites": len(units),
            "created_at": datetime.utcnow()
        }
        
        result = sessions_collection.insert_one(document)
        print(f"[DEBUG] Session saved with ID: {result.inserted_id}")
        return str(result.inserted_id)
    except Exception as e:
        print(f"[ERROR] Failed to save session: {e}")
        return None

def get_units_by_teacher(enseignant, matiere=None, annee_pei=None):
    """Récupère les unités d'un enseignant"""
    if units_collection is None:
        print("[WARNING] MongoDB not connected, returning empty list")
        return []
    
    try:
        query = {"enseignant": enseignant}
        
        if matiere:
            query["matiere"] = matiere
        
        if annee_pei:
            query["annee_pei"] = annee_pei
        
        cursor = units_collection.find(query).sort("created_at", -1)
        
        units = []
        for doc in cursor:
            units.append({
                'id': str(doc['_id']),
                'matiere': doc['matiere'],
                'annee_pei': doc['annee_pei'],
                'titre_unite': doc['titre_unite'],
                'data': doc['data'],
                'created_at': doc['created_at'].isoformat()
            })
        
        print(f"[DEBUG] Found {len(units)} units for teacher: {enseignant}")
        return units
    except Exception as e:
        print(f"[ERROR] Failed to get units: {e}")
        return []

def get_recent_sessions(limit=10):
    """Récupère les sessions récentes"""
    if sessions_collection is None:
        print("[WARNING] MongoDB not connected, returning empty list")
        return []
    
    try:
        cursor = sessions_collection.find().sort("created_at", -1).limit(limit)
        
        sessions = []
        for doc in cursor:
            sessions.append({
                'id': str(doc['_id']),
                'enseignant': doc['enseignant'],
                'matiere': doc['matiere'],
                'annee_pei': doc['annee_pei'],
                'chapitres': doc['chapitres'],
                'units': doc['units'],
                'nb_unites': doc.get('nb_unites', len(doc['units'])),
                'created_at': doc['created_at'].isoformat()
            })
        
        print(f"[DEBUG] Found {len(sessions)} recent sessions")
        return sessions
    except Exception as e:
        print(f"[ERROR] Failed to get sessions: {e}")
        return []

def get_session_by_id(session_id):
    """Récupère une session spécifique par son ID"""
    if sessions_collection is None:
        print("[WARNING] MongoDB not connected")
        return None
    
    try:
        from bson.objectid import ObjectId
        doc = sessions_collection.find_one({"_id": ObjectId(session_id)})
        
        if doc:
            return {
                'id': str(doc['_id']),
                'enseignant': doc['enseignant'],
                'matiere': doc['matiere'],
                'annee_pei': doc['annee_pei'],
                'chapitres': doc['chapitres'],
                'units': doc['units'],
                'nb_unites': doc.get('nb_unites', len(doc['units'])),
                'created_at': doc['created_at'].isoformat()
            }
        return None
    except Exception as e:
        print(f"[ERROR] Failed to get session: {e}")
        return None

# Initialiser la base de données au chargement du module
init_db()
