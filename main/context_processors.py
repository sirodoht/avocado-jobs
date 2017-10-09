def users_processor(request):
    return {
        'has_listings': bool(request.user.listing_set.all())
    }
