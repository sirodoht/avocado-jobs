import re

from django import template

register = template.Library()

@register.simple_tag(takes_context=True)
def active(context, pattern):
    path = context['request'].path
    if re.search(pattern, path):
        return 'active'
    return ''
