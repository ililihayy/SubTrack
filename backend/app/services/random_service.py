import httpx
import random as _random
from typing import Any, Dict, List
from sqlalchemy.orm import Session
from app import crud, schemas
from app.config import RANDOM_DATA_API_BASE


def fetch_with_fallback(path: str, size: int) -> List[Dict[str, Any]]:
    with httpx.Client(timeout=10.0) as client:
        try:
            bulk = client.get(f"{RANDOM_DATA_API_BASE}/{path}", params={"size": size})
            bulk.raise_for_status()
            data = bulk.json()
            if isinstance(data, dict):
                data = [data]
            return data
        except httpx.HTTPError:
            # Fallback: кілька запитів
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
                    return [mock_random_user() for _ in range(max(1, size))]
                if path == "companies":
                    return [mock_random_company() for _ in range(max(1, size))]
                return []


def mock_random_user() -> Dict[str, Any]:
    first_names = ["Alex", "Sam", "Jamie", "Taylor", "Jordan", "Casey"]
    last_names = ["Smith", "Johnson", "Lee", "Brown", "Garcia", "Miller"]
    fn = _random.choice(first_names)
    ln = _random.choice(last_names)
    return {
        "first_name": fn,
        "last_name": ln,
        "email": f"{fn.lower()}.{ln.lower()}@example.com",
        "phone_number": f"+1-555-{_random.randint(100,999)}-{_random.randint(1000,9999)}",
        "address": f"{_random.randint(10,9999)} Main St, City {_random.randint(1,99)}",
    }


def mock_random_company() -> Dict[str, Any]:
    names = ["Acme Corp", "Globex", "Initech", "Umbrella", "Hooli", "Vandelay"]
    industries = ["Tech", "Finance", "Healthcare", "Retail", "Manufacturing"]
    return {
        "business_name": _random.choice(names),
        "industry": _random.choice(industries),
        "catch_phrase": "Innovate the future",
        "buzzword": "Synergy",
        "address": f"{_random.randint(10,9999)} Market Ave, District {_random.randint(1,20)}",
    }


def mock_random_subscription() -> Dict[str, Any]:
    return {
        "plan": _random.choice(["basic", "pro", "enterprise"]),
        "status": _random.choice(["active", "paused", "canceled"]),
        "payment_method": _random.choice(["card", "paypal", "bank_transfer"]),
        "term": _random.choice(["monthly", "yearly"]),
    }


def save_random_subscription(data: Dict[str, Any], db: Session):
    user_id = data.get("user_id")
    company_id = data.get("company_id")

    if not user_id:
        users = crud.get_users(db, skip=0, limit=1)
        if not users:
            raise ValueError("No users in DB. Provide user_id or create user first.")
        user_id = users[0].id

    if not company_id:
        companies = crud.get_companies(db, skip=0, limit=1)
        if not companies:
            raise ValueError(
                "No companies in DB. Provide company_id or create company first."
            )
        company_id = companies[0].id

    sub_payload = schemas.SubscriptionCreate(
        plan=data.get("plan", "basic"),
        status=data.get("status", "active"),
        payment_method=data.get("payment_method", "card"),
        term=data.get("term", "monthly"),
        user_id=int(user_id),
        company_id=int(company_id),
    )
    return crud.create_subscription(db, sub_payload)


def save_random_user(data: Dict[str, Any], db: Session):
    user = schemas.UserCreate(**data)
    return crud.create_user(db, user)


def save_random_company(data: Dict[str, Any], db: Session):
    company = schemas.CompanyCreate(**data)
    return crud.create_company(db, company)
