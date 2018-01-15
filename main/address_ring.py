import urllib.request
import json
import datetime

from django.core.mail import send_mail
from django.utils import timezone

from avocado import settings
from .models import Address, Listing


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
        error = "It seems we're more popular than we anticipated.\nPlease refresh this page in a few minutes."
        if not settings.DEBUG:
            send_mail(
                'Addresses scaling alert!',
                'ETH addresses are all used up! Add more.',
                settings.DEFAULT_FROM_EMAIL,
                [settings.EMAIL_ALERT],
            )

    return (error, result)


def get_payment(address):
    # etherscanApiUrl = 'http://rinkeby.etherscan.io/api?module=account&action=txlist&address=' + address + '&sort=desc&apikey=' + settings.ETHERSCAN_API_KEY;
    # etherscanApiUrl = 'https://api.etherscan.io/api?module=account&action=txlist&address=' + address + '&sort=desc&apikey=' + settings.ETHERSCAN_API_KEY;
    ethplorerApiUrl = 'https://api.ethplorer.io/getAddressTransactions/' + address + '?apiKey=freekey'
    api_req = urllib.request.urlopen(ethplorerApiUrl).read()
    account_transactions = json.loads(api_req)

    transaction_hash = ''
    for tx in account_transactions:
        tx_date = datetime.datetime.fromtimestamp(tx['timestamp'])
        if tx_date + datetime.timedelta(minutes=30) > datetime.datetime.now():
            if tx['success'] and tx['value'] >= 0.05:
                if not Listing.objects.filter(transaction_hash=tx['hash']).count():
                    transaction_hash = tx['hash']
                    makeAddressAvailable(address)
                    break

    return transaction_hash


def makeAddressAvailable(address):
    addr = Address.objects.get(value=address)

    # set last_used attr to the beginning of the millenia
    addr.last_used = timezone.make_aware(datetime.datetime(2000, 1, 1, 0, 0, 0, 0))

    addr.save()
