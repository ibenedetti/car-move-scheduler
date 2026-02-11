import requests
from django.conf import settings

def get_car_photos(vin):
    r = requests.get(
        f"https://api.auto.dev/photos/{vin}",
        headers={"Authorization": f"Bearer {settings.AUTO_DEV_KEY}"},
        timeout=8,
    )
    return r.json()
