from django.contrib import admin
from .models import Search

class SearchAdmin(admin.ModelAdmin):
    list_display = ('search', 'created')
    list_filter = ('search', 'created')
    search_fields = ('search',)
    ordering = ('-created',)


# Register your models here.

admin.site.register(Search, SearchAdmin)