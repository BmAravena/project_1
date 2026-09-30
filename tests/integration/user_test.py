

def test_get_users(client):
    response = client.get("/api/v1/users")
    assert response.status_code == 200

    assert response.json() == []


def test_get_user_by_id(client):
    # First, create a user to ensure there is one in the database
    user_data = {
        "email": "ana.garcia@example.com",
        "hashed_password": "hashed-test-password",
        "full_name": "Ana García",
        "is_active": True,
    }
    client.post("/api/v1/users", json=user_data)

    response = client.get("/api/v1/users/1")
    assert response.status_code == 200
    assert response.json() == {
        "id": 1,
        "email": user_data["email"],
        "full_name": user_data["full_name"],
        "is_active": True,
    }


def test_create_user(client):
    user_data = {
        "email": "ana.garcia@example.com",
        "hashed_password": "hashed-test-password",
        "full_name": "Ana García",
        "is_active": True,
    }

    response = client.post("/api/v1/users", json=user_data)

    assert response.status_code == 201
    assert response.json() == {
        "id": 1,
        "email": user_data["email"],
        "full_name": user_data["full_name"],
        "is_active": True,
    }