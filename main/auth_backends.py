import base64
import json
import time

from django.contrib.auth import get_user_model
from django.core.signing import BadSignature, Signer

from avocado import settings


class EmailTokenBackend:
    def get_user(self, user_id):
        """Get a user by their email address."""
        User = get_user_model()
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None

    def authenticate(self, token=None):
        """Authenticate a user given a signed token."""
        try:
            data = Signer().unsign(token)
        except BadSignature:
            return

        data = json.loads(base64.b64decode(data).decode('utf8'))
        if data['t'] < time.time() - settings.AUTH_TOKEN_DURATION:
            return

        User = get_user_model()

        user, created = User.objects.get_or_create(email=data['e'], username=data['e'])
        return user
