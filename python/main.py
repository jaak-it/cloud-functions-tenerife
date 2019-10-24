import json
from models.claims import claim_default

def hello_auth(data, context):
    """ Triggered by creation or deletion of a Firebase Auth user object.
     Args:
            data (dict): The event payload.
            context (google.cloud.functions.Context): Metadata for the event.
    """
    print('Function triggered by creation/deletion of user: %s' % data["uid"])
    print('Created at: %s' % data["metadata"]["createdAt"])

    if 'email' in data:
        print('Email: %s' % data["email"])
