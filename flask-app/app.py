#!/usr/bin/python3
# -*- coding: utf-8 -*-
#
# Copyright (c) 2023 Baidu, Inc. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
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
