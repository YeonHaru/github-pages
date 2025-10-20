def test_root_alive(client):
    
    """루트가 200을 반환하고 JSON응답이면 통과"""
    resp = client.get("/")
    assert resp.status_code == 200
    data = resp.get_json(silent=True)
    assert isinstance(data, dict)

def test_404(client):
    """존재하지 않는 경로는 404여야 함"""

    resp = client.get("/__not_exists___")
    assert resp.status_code == 404