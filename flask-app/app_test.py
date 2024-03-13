
"""
Create a flask app.
"""

import time
from flask import Flask, jsonify

app = Flask(__name__)


@app.route("/main", methods=["GET"])
def hello_world():
    """
    Hello world.
    """
    print("the /main route is being called")
    return jsonify({"message": f"Hello, World at {time.time()}"})


if __name__ == "__main__":
    app.run(debug=True, port=5001)
