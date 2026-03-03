import os
import firebase_admin
from firebase_admin import credentials, auth
from fastapi import Request, HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from config import settings

security = HTTPBearer()

def initialize_firebase():
    """Initializes Firebase Admin SDK with service account file."""
    if not firebase_admin._apps:
        cred = credentials.Certificate("serviceAccountKey.json")
        firebase_admin.initialize_app(cred)

async def verify_firebase_token(credentials: HTTPAuthorizationCredentials = Security(security)):
    """Verifies Firebase ID token and returns the decoded token."""
    token = credentials.credentials
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        raise HTTPException(
            status_code=401,
            detail=f"Invalid or expired authentication token: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
