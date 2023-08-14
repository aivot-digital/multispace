import os


def version_context(request):
    return {
        'version': os.getenv('MULTISPACE_VERSION', 'dev')
    }
