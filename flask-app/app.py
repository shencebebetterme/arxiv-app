
"""
Create a flask app.
"""

from flask import (
    Flask,
    request,
    jsonify,
    Response,
    stream_with_context,
    render_template,
)
import json
import time
import sys
import pathlib
import sqlite3

sys.path.insert(1, pathlib.Path(__file__).parent.parent.parent.__str__() + "/")

from ranking import search_similar, search_similar_by_id
from openai_embed import embed
from arxiv import search_by_ids, search_latest


app = Flask(__name__)


@app.route("/init", methods=["POST"])
def init_page():
    """
    Initial page.
    """
    num = request.json["num"]
    # check if num is present
    if num is None:
        num = 20
    init_papers = search_latest(num)
    return jsonify(init_papers)


@app.route("/search", methods=["POST"])
def search():
    """
    Return the similar papers.
    """
    query = request.json["message"]
    topk = request.json["topk"]
    if topk is None:
        topk = 20
    print(f"Received query: {query}")

    vecs = embed(query)
    # print(vecs)
    ids, distances = search_similar(vecs, topk)
    papers = search_by_ids(ids)

    print(f"Found {len(papers)} similar papers")
    return jsonify(papers)


@app.route("/similar", methods=["POST"])
def similar():
    """
    For a given arxiv id, show the papers that are similar to it.
    """
    id = request.json["id"]
    topk = request.json["topk"]
    if topk is None:
        topk = 20
    print(f"Received id: {id}  Search for similar papers...")
    ids, distances = search_similar_by_id(id, topk)
    papers = search_by_ids(ids)

    return jsonify(papers)


# embed query and search similar vectors in milvus
# return the similar papers in sqlite


if __name__ == "__main__":
    app.run(debug=True, port=5001)
