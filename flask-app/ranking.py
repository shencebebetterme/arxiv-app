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
Do the ranking.
"""

import sqlite3
import time
from pymilvus import (
    utility,
    connections,
    DataType,
    FieldSchema,
    CollectionSchema,
    Collection,
)
import requests
import json

OPENAI_EMBEDDING_DIM = 1536


# Connect to Milvus server
connections.connect("default")

arxiv = Collection(name="ArxivPapers")
arxiv.load()


def search_similar(vector_list, topk=10, offset=0):
    """
    Search for similar vectors in Milvus.
    vector_list is like [[1.1, 2.1, 3.5]]
    """
    # Search for similar vectors
    attu_param = {
        # range: [top_k, 32768]
        "ef": 250,
        # // range: [1, nlist]
        "nprobe": 1,
        # // range: {-1} ∪ [top_k, n × n_trees]
        "search_k": 250,
        # "radius": 0.5,
        # "range_filter": ,
    }

    param = {
        "nprobe": 1,
    }

    search_params = {
        "metric_type": "L2",
        "params": param,
    }
    results = arxiv.search(
        vector_list, anns_field="embedding", param=search_params, limit=topk
    )
    arxiv_ids = results[0].ids
    distances = results[0].distances
    # conver to standard python list
    arxiv_ids = list(arxiv_ids)
    distances = list(distances)
    return arxiv_ids, distances


def search_similar_by_id(id: str, topk=10, offset=0):
    """
    Search for similar papers, given the paper id.
    """
    # in Milvus, query the embedding of the paper
    expr = f"arxiv_id == '{id}'"
    results = arxiv.query(expr=expr, output_fields=["arxiv_id", "embedding"])
    # print(results)
    embedding = results[0]["embedding"]
    # in Milvus, search for similar embeddings
    ids, distances = search_similar([embedding], topk)
    return ids, distances
