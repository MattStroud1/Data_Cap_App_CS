"""
Adaptive Testing API for City Activity Survey.

Endpoints:
- POST /session/start - Start a new adaptive session
- POST /session/next - Get next question
- POST /session/respond - Record a response
- GET /session/profile - Get current profile with percentiles
- GET /session/state - Get current session state
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, List
import uuid
from pathlib import Path

from models.adaptive import AdaptiveSession

app = FastAPI(title="Adaptive Survey Engine", version="1.0.0")

# CORS for mobile app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory session storage (in production, use Redis or DB)
sessions: Dict[str, AdaptiveSession] = {}

# Paths
DATA_DIR = Path(__file__).parent / "data"
ITEM_BANK_PATH = DATA_DIR / "item_bank.json"
NORMS_PATH = DATA_DIR / "norms.json"


# Request/Response models
class StartSessionRequest(BaseModel):
    se_threshold: float = 0.35
    max_items_per_trait: int = 10


class StartSessionResponse(BaseModel):
    session_id: str
    attributes: List[str]


class NextItemResponse(BaseModel):
    item: Optional[Dict]
    is_done: bool
    progress: Dict  # {attribute: {asked: int, target_se: float, current_se: float}}


class RespondRequest(BaseModel):
    session_id: str
    item_id: str
    response: int  # 1-5 for Likert


class RespondResponse(BaseModel):
    success: bool
    updated_estimates: Dict  # {attribute: {theta, se}}


class ProfileResponse(BaseModel):
    profile: Dict  # {attribute: {theta, se, percentile, items_asked}}
    narrative: str


@app.get("/")
def root():
    return {
        "service": "Adaptive Survey Engine",
        "version": "1.0.0",
        "status": "running"
    }


@app.post("/session/start", response_model=StartSessionResponse)
def start_session(req: StartSessionRequest):
    """Start a new adaptive testing session."""
    session_id = str(uuid.uuid4())

    session = AdaptiveSession(
        item_bank_path=str(ITEM_BANK_PATH),
        norms_path=str(NORMS_PATH),
        se_threshold=req.se_threshold,
        max_items_per_trait=req.max_items_per_trait
    )

    sessions[session_id] = session

    return StartSessionResponse(
        session_id=session_id,
        attributes=session.get_attribute_list()
    )


@app.get("/session/{session_id}/next", response_model=NextItemResponse)
def get_next_item(session_id: str):
    """Get the next question to ask."""
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")

    session = sessions[session_id]

    # Check if done
    if session.is_session_done():
        return NextItemResponse(
            item=None,
            is_done=True,
            progress=_build_progress(session)
        )

    # Get next item
    next_item = session.get_next_item()

    if next_item is None:
        return NextItemResponse(
            item=None,
            is_done=True,
            progress=_build_progress(session)
        )

    return NextItemResponse(
        item=next_item,
        is_done=False,
        progress=_build_progress(session)
    )


@app.post("/session/respond", response_model=RespondResponse)
def record_response(req: RespondRequest):
    """Record a response to an item."""
    if req.session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")

    if req.response < 1 or req.response > 5:
        raise HTTPException(status_code=400, detail="Response must be 1-5")

    session = sessions[req.session_id]

    try:
        session.record_response(req.item_id, req.response)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    # Return updated estimates
    updated = {
        attr: {
            "theta": round(session.theta_estimates[attr], 3),
            "se": round(session.se_estimates[attr], 3)
        }
        for attr in session.get_attribute_list()
    }

    return RespondResponse(
        success=True,
        updated_estimates=updated
    )


@app.get("/session/{session_id}/profile", response_model=ProfileResponse)
def get_profile(session_id: str):
    """Get final profile with percentiles and narrative."""
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")

    session = sessions[session_id]
    profile = session.get_profile()
    narrative = _generate_narrative(profile)

    return ProfileResponse(
        profile=profile,
        narrative=narrative
    )


@app.get("/session/{session_id}/state")
def get_state(session_id: str):
    """Get current session state (for debugging)."""
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")

    session = sessions[session_id]
    return session.get_current_state()


def _build_progress(session: AdaptiveSession) -> Dict:
    """Build progress dict for all attributes."""
    progress = {}
    for attr in session.get_attribute_list():
        progress[attr] = {
            "items_asked": len(session.items_asked[attr]),
            "current_se": round(session.se_estimates[attr], 3),
            "target_se": session.se_threshold,
            "is_done": session.is_attribute_done(attr)
        }
    return progress


def _generate_narrative(profile: Dict) -> str:
    """
    Generate a narrative profile based on percentile scores.
    Rule-based for now; can be enhanced with LLM later.
    """
    lines = []

    # Big Five traits
    big5_map = {
        "big5_extraversion": ("Extraversion", "socially energetic", "reserved and introspective"),
        "big5_agreeableness": ("Agreeableness", "warm and cooperative", "independent and direct"),
        "big5_conscientiousness": ("Conscientiousness", "organized and disciplined", "flexible and spontaneous"),
        "big5_neuroticism": ("Neuroticism", "emotionally sensitive", "emotionally stable"),
        "big5_openness": ("Openness", "curious and creative", "practical and conventional")
    }

    for attr_id, (name, high_desc, low_desc) in big5_map.items():
        if attr_id in profile:
            pct = profile[attr_id]["percentile"]
            if pct >= 70:
                lines.append(f"You're quite {high_desc} (higher than {pct}% of people on {name}).")
            elif pct <= 30:
                lines.append(f"You're more {low_desc} (lower than {100-pct}% on {name}).")
            else:
                lines.append(f"You're around average on {name}.")

    # Social orientation
    if "need_to_belong" in profile:
        pct = profile["need_to_belong"]["percentile"]
        if pct >= 70:
            lines.append("You have a strong need for social connection and acceptance.")
        elif pct <= 30:
            lines.append("You're comfortable with solitude and don't feel a strong need to belong to groups.")
        else:
            lines.append("You have a moderate need for social connection.")

    # Sensation seeking
    if "sensation_seeking" in profile:
        pct = profile["sensation_seeking"]["percentile"]
        if pct >= 70:
            lines.append("You seek out intense, exciting experiences.")
        elif pct <= 30:
            lines.append("You prefer predictable, lower-risk activities.")

    # City preferences
    if "activity_novelty" in profile:
        pct = profile["activity_novelty"]["percentile"]
        if pct >= 60:
            lines.append("In your city, you love trying new places and events.")
        else:
            lines.append("You tend to prefer familiar spots and regular routines.")

    if "noise_tolerance" in profile:
        pct = profile["noise_tolerance"]["percentile"]
        if pct >= 60:
            lines.append("You enjoy loud, busy environments.")
        else:
            lines.append("You prefer calm, quiet spaces.")

    # Combine into paragraph
    if not lines:
        return "Profile data is being processed."

    return " ".join(lines)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=4000)
