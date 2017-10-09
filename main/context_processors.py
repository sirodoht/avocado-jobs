def users_processor(request):
    return {
        'has_listings': request.user.listing_set.exists()
    }
