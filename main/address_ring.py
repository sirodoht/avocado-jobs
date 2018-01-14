import urllib.request
import json
import datetime

from django.core.mail import send_mail
from django.utils import timezone

from avocado import settings
from .models import Address


def get_address():
    lru_addresses = Address.objects.order_by('last_used')

    result = ''
    error = ''

    for addr in lru_addresses:
        if addr.last_used + timezone.timedelta(minutes=30) < timezone.now():
            addr.last_used = timezone.now()
            addr.save()
            result = addr
            break

    if not result:
        error = "It seems we're more popular than we anticipated.\nPlease try again in a few minutes."
        if not settings.DEBUG:
            send_mail(
                'Addresses scaling alert!',
                'ETH addresses are all used up! Add more.',
                settings.DEFAULT_FROM_EMAIL,
                [settings.EMAIL_ALERT],
            )

    return (error, result)


def get_payment(address):
    etherscanApiUrl = 'http://rinkeby.etherscan.io/api?module=account&action=txlist&address=' + address + '&sort=desc&apikey=' + settings.ETHERSCAN_API_KEY;
    api_req = urllib.request.urlopen(etherscanApiUrl).read()
    account_transactions = json.loads(api_req)['result']

    verified = False
    for tx in account_transactions:
        tx_date = datetime.datetime.fromtimestamp(int(tx['timeStamp']))
        if tx_date + datetime.timedelta(minutes=30) > datetime.datetime.now():
            if int(tx['value']) >= 50000000000000000:
                verified = True
                break

    return verified
