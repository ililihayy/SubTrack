from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import httpx
from typing import Any, Dict, List
import random as _random

from app import crud, schemas
from app.database import get_db
from app.config import RANDOM_DATA_API_BASE


router = APIRouter(prefix="/random", tags=["random-data"])


def _extract_user_fields(random_user: Dict[str, Any]) -> Dict[str, Any]:
    raw_address = random_user.get("address")
    address: str | None = None
    if isinstance(raw_address, dict):
        address_parts: List[str] = []
        for key in [
            "street_address",
            "city",
            "state",
            "country",
            "zip_code",
        ]:
            value = raw_address.get(key)
            if value:
                address_parts.append(str(value))
        address = ", ".join(address_parts) if address_parts else None
    elif isinstance(raw_address, str):
        address = raw_address

    return {
        "first_name": random_user.get("first_name"),
        "last_name": random_user.get("last_name"),
        "email": random_user.get("email"),
        "phone_number": random_user.get("phone_number"),
        "address": address,
    }


def _extract_company_fields(random_company: Dict[str, Any]) -> Dict[str, Any]:
    raw_address = random_company.get("address")
    address: str | None = None
    if isinstance(raw_address, dict):
        address_parts: List[str] = []
        for key in [
            "street_address",
            "city",
            "state",
            "country",
            "zip_code",
        ]:
            value = raw_address.get(key)
            if value:
                address_parts.append(str(value))
        address = ", ".join(address_parts) if address_parts else None
    elif isinstance(raw_address, str):
        address = raw_address

    return {
        "business_name": (
            random_company.get("business_name") or random_company.get("business")
        ),
        "industry": random_company.get("industry"),
        "catch_phrase": random_company.get("catch_phrase"),
        "buzzword": random_company.get("buzzword"),
        "address": address,
    }


def _fetch_with_fallback(path: str, size: int) -> List[Dict[str, Any]]:
    with httpx.Client(timeout=10.0) as client:
        try:
            bulk = client.get(f"{RANDOM_DATA_API_BASE}/{path}", params={"size": size})
            bulk.raise_for_status()
            data = bulk.json()
            if isinstance(data, dict):
                data = [data]
            return data
        except httpx.HTTPError:
            # Try single-item fallback; if that also fails, return mock data
            try:
                items: List[Dict[str, Any]] = []
                for _ in range(max(1, size)):
                    r = client.get(f"{RANDOM_DATA_API_BASE}/{path}")
                    r.raise_for_status()
                    item = r.json()
                    if isinstance(item, list):
                        items.extend(item)
                    else:
                        items.append(item)
                return items
            except httpx.HTTPError:
                if path == "users":
                    return [_mock_random_user() for _ in range(max(1, size))]
                if path == "companies":
                    return [_mock_random_company() for _ in range(max(1, size))]
                return []


def _mock_random_user() -> Dict[str, Any]:
    first_names = ["Alex", "Sam", "Jamie", "Taylor", "Jordan", "Casey"]
    last_names = ["Smith", "Johnson", "Lee", "Brown", "Garcia", "Miller"]
    fn = _random.choice(first_names)
    ln = _random.choice(last_names)
    email = f"{fn.lower()}.{ln.lower()}@example.com"
    phone = f"+1-555-{_random.randint(100,999)}-{_random.randint(1000,9999)}"
    address = f"{_random.randint(10,9999)} Main St, City {_random.randint(1,99)}"
    return {
        "first_name": fn,
        "last_name": ln,
        "email": email,
        "phone_number": phone,
        "address": address,
    }


def _mock_random_company() -> Dict[str, Any]:
    names = ["Acme Corp", "Globex", "Initech", "Umbrella", "Hooli", "Vandelay"]
    industries = ["Tech", "Finance", "Healthcare", "Retail", "Manufacturing"]
    catch_phrases = [
        "Innovate the future",
        "Empower growth",
        "Scaling success",
        "Think simple",
    ]
    buzzwords = ["Synergy", "Blockchain", "AI-driven", "Cloud-native"]
    return {
        "business_name": _random.choice(names),
        "industry": _random.choice(industries),
        "catch_phrase": _random.choice(catch_phrases),
        "buzzword": _random.choice(buzzwords),
        "address": f"{_random.randint(10,9999)} Market Ave, District {_random.randint(1,20)}",
    }


def _mock_random_subscription() -> Dict[str, Any]:
    plans = ["basic", "pro", "enterprise"]
    statuses = ["active", "paused", "canceled"]
    methods = ["card", "paypal", "bank_transfer"]
    terms = ["monthly", "yearly"]
    return {
        "plan": _random.choice(plans),
        "status": _random.choice(statuses),
        "payment_method": _random.choice(methods),
        "term": _random.choice(terms),
    }


@router.get("/users")
def get_random_users(size: int = 10):
    try:
        return _fetch_with_fallback("users", size)
    except httpx.HTTPError as exc:
        raise HTTPException(status_code=502, detail=f"RandomDataAPI error: {exc}")


@router.get("/companies")
def get_random_companies(size: int = 10):
    try:
        return _fetch_with_fallback("companies", size)
    except httpx.HTTPError as exc:
        raise HTTPException(status_code=502, detail=f"RandomDataAPI error: {exc}")


@router.get("/subscriptions")
def get_random_subscriptions(size: int = 10):
    return [_mock_random_subscription() for _ in range(max(1, size))]


def _extract_subscription_fields(random_subscription: Dict[str, Any]) -> Dict[str, Any]:
    return {
        "plan": random_subscription.get("plan") or "basic",
        "status": random_subscription.get("status") or "active",
        "payment_method": random_subscription.get("payment_method") or "card",
        "term": random_subscription.get("term") or "monthly",
    }


@router.post("/subscriptions/save", response_model=schemas.Subscription)
def save_random_subscription(
    random_subscription: Dict[str, Any], db: Session = Depends(get_db)
):
    sub_data = _extract_subscription_fields(random_subscription)

    user_id = random_subscription.get("user_id")
    company_id = random_subscription.get("company_id")

    if not user_id:
        users = crud.get_users(db, skip=0, limit=1)
        if not users:
            raise HTTPException(
                status_code=400,
                detail="No users in DB. Create a user first or provide user_id.",
            )
        user_id = users[0].id

    if not company_id:
        companies = crud.get_companies(db, skip=0, limit=1)
        if not companies:
            raise HTTPException(
                status_code=400,
                detail="No companies in DB. Create a company first or provide company_id.",
            )
        company_id = companies[0].id

    sub_payload = schemas.SubscriptionCreate(
        plan=sub_data["plan"],
        status=sub_data["status"],
        payment_method=sub_data["payment_method"],
        term=sub_data["term"],
        user_id=int(user_id),
        company_id=int(company_id),
    )
    return crud.create_subscription(db, sub_payload)


@router.post("/users/save", response_model=schemas.User)
def save_random_user(random_user: Dict[str, Any], db: Session = Depends(get_db)):
    user_data = _extract_user_fields(random_user)
    user = schemas.UserCreate(**user_data)
    return crud.create_user(db, user)


@router.post("/companies/save", response_model=schemas.Company)
def save_random_company(random_company: Dict[str, Any], db: Session = Depends(get_db)):
    company_data = _extract_company_fields(random_company)
    company = schemas.CompanyCreate(**company_data)
    return crud.create_company(db, company)
