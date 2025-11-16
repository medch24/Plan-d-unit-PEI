"""
Gestion de la base de données MongoDB pour stocker les unités générées
"""
from pymongo import MongoClient
from datetime import datetime
import os

# Configuration MongoDB
MONGO_URL = os.environ.get('MONGO_URL', 'mongodb+srv://mohamedsherif:Mmedch86@planpei.jcvu2uq.mongodb.net/?appName=PlanPEI')

# Client MongoDB (singleton)
_client = None
_db = None

def get_db():
    """Obtient une connexion à la base de données MongoDB"""
    global _client, _db
    if _db is None:
        try:
            _client = MongoClient(MONGO_URL, serverSelectionTimeoutMS=5000)
            _db = _client['planpei']
            # Test de connexion
            _client.server_info()
            print(f"[DEBUG] Connected to MongoDB successfully")
        except Exception as e:
            print(f"[ERROR] Failed to connect to MongoDB: {e}")
            _db = None
    return _db

def init_db():
    """Initialise la base de données"""
    try:
        db = get_db()
        if db is not None:
            # Créer les collections si elles n'existent pas
            if 'units' not in db.list_collection_names():
                db.create_collection('units')
            if 'sessions' not in db.list_collection_names():
                db.create_collection('sessions')
            
            # Créer des index pour améliorer les performances
            db.units.create_index([('enseignant', 1), ('matiere', 1), ('annee_pei', 1)])
            db.sessions.create_index([('enseignant', 1), ('created_at', -1)])
            
            print(f"[DEBUG] MongoDB database initialized successfully")
            return True
    except Exception as e:
        print(f"[ERROR] Failed to initialize MongoDB: {e}")
        return False

def save_unit(enseignant, matiere, annee_pei, unite):
    """Sauvegarde une unité dans la base de données"""
    try:
        db = get_db()
        if db is None:
            print("[WARNING] MongoDB not available, skipping save")
            return None
        
        document = {
            'enseignant': enseignant,
            'matiere': matiere,
            'annee_pei': annee_pei,
            'titre_unite': unite.get('titre_unite', ''),
            'data': unite,
            'created_at': datetime.utcnow()
        }
        
        result = db.units.insert_one(document)
        unit_id = str(result.inserted_id)
        
        print(f"[DEBUG] Unit saved with ID: {unit_id}")
        return unit_id
    except Exception as e:
        print(f"[ERROR] Failed to save unit: {e}")
        return None

def save_session(enseignant, matiere, annee_pei, chapitres, units):
    """Sauvegarde une session complète de génération"""
    try:
        db = get_db()
        if db is None:
            print("[WARNING] MongoDB not available, skipping save")
            return None
        
        document = {
            'enseignant': enseignant,
            'matiere': matiere,
            'annee_pei': annee_pei,
            'chapitres': chapitres,
            'units': units,
            'created_at': datetime.utcnow()
        }
        
        result = db.sessions.insert_one(document)
        session_id = str(result.inserted_id)
        
        # Sauvegarder aussi chaque unité individuellement
        for unite in units:
            save_unit(enseignant, matiere, annee_pei, unite)
        
        print(f"[DEBUG] Session saved with ID: {session_id}, {len(units)} units")
        return session_id
    except Exception as e:
        print(f"[ERROR] Failed to save session: {e}")
        return None

def get_units_by_teacher(enseignant, matiere=None, annee_pei=None):
    """Récupère les unités d'un enseignant"""
    try:
        db = get_db()
        if db is None:
            return []
        
        query = {'enseignant': enseignant}
        
        if matiere:
            query['matiere'] = matiere
        
        if annee_pei:
            query['annee_pei'] = annee_pei
        
        units = list(db.units.find(query).sort('created_at', -1))
        
        # Convertir ObjectId en string
        for unit in units:
            unit['_id'] = str(unit['_id'])
        
        return units
    except Exception as e:
        print(f"[ERROR] Failed to get units: {e}")
        return []

def get_recent_sessions(limit=10):
    """Récupère les sessions récentes"""
    try:
        db = get_db()
        if db is None:
            return []
        
        sessions = list(db.sessions.find().sort('created_at', -1).limit(limit))
        
        # Convertir ObjectId en string
        for session in sessions:
            session['_id'] = str(session['_id'])
        
        return sessions
    except Exception as e:
        print(f"[ERROR] Failed to get sessions: {e}")
        return []

def get_session_by_id(session_id):
    """Récupère une session par son ID"""
    try:
        from bson.objectid import ObjectId
        db = get_db()
        if db is None:
            return None
        
        session = db.sessions.find_one({'_id': ObjectId(session_id)})
        if session:
            session['_id'] = str(session['_id'])
        
        return session
    except Exception as e:
        print(f"[ERROR] Failed to get session: {e}")
        return None

# Initialiser la base de données au chargement du module
init_db()
