import firebase_admin
from firebase_admin import auth, firestore

firebase_admin.initialize_app()
db = firestore.client()


def hello_http(request):
    """HTTP Cloud Function.
    Args:
        request (flask.Request): The request object.
        <http://flask.pocoo.org/docs/1.0/api/#flask.Request>
    Returns:
        The response text, or any set of values that can be turned into a
        Response object using `make_response`
        <http://flask.pocoo.org/docs/1.0/api/#flask.Flask.make_response>.
    """
    # request_json = request.get_json(silent=True)
    # request_args = request.args

    try:
        id_token = request.headers.get('authorization').split('Bearer ')[1]
        decoded_id_token = auth.verify_id_token(id_token)
        user = db.collection(u'users').document(decoded_id_token.get('uid')).get().to_dict()
        if user.get('tokenHub') is None:
            raise Exception()
    except:
        return 'Unauthorized', 403, {}

    print(user.get('tokenHub'))

    return 'Ok', 200, {}

    # if request_json and 'name' in request_json:
    #     name = request_json['name']
    # elif request_args and 'name' in request_args:
    #     name = request_args['name']
    # else:
    #     name = 'World'
    # return 'Hello {}!'.format(escape(name))
