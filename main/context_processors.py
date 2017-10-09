def users_processor(request):
    if request.user.is_authenticated():
        has_listings = request.user.listing_set.exists()
    else:
        has_listings = False
    return {
        'has_listings': has_listings,
    }
