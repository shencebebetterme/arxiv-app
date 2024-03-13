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
Deal with the arxiv database.
"""

import sqlite3
import json
from pathlib import Path
import sys

# sys.path.insert(1, pathlib.Path(__file__).parent.parent.parent.__str__() + "/")

# Connect to SQLite Database
# database_dir = Path(__file__).parent.parent / "arxiv_papers.db"
database_dir = Path("D:\\arxivMetadata\\arxiv_papers.db")
conn = sqlite3.connect(database_dir, check_same_thread=False)
cursor = conn.cursor()


def search_by_ids(id_list):
    """
    Search for paper by id in SQLite.
    """

    # Search for similar vectors
    # create a string of ? for each id
    question_marks = ",".join(["?"] * len(id_list))
    query = f"SELECT id, authors, title, categories, abstract FROM papers WHERE id IN ({question_marks})"
    cursor.execute(query, id_list)
    papers = cursor.fetchall()
    # usage: id,authors,title,abstract = papers[0]

    # sort the papers by the order of id_list
    papers = sorted(papers, key=lambda x: id_list.index(x[0]))

    # create a json object
    json_results = []
    for paper in papers:
        id, authors, title, tags, abstract = paper
        json_results.append(
            {
                "id": id,
                "authors": authors,
                "title": title,
                "tags": tags,
                "abstract": abstract,
            }
        )
    return json_results


def search_latest(num):
    """
    Return the latest num papers in category quant-ph.
    """
    query = f"SELECT id, authors, title, categories, abstract FROM papers \
    WHERE id < 'acc-phys/9411001' \
    AND categories LIKE '%quant-ph%'\
    ORDER BY id DESC LIMIT {num}"
    cursor.execute(query)
    papers = cursor.fetchall()
    # usage: id,authors,title,abstract = papers[0]

    # create a json object
    json_results = []
    for paper in papers:
        id, authors, title, tags, abstract = paper
        json_results.append(
            {
                "id": id,
                "authors": authors,
                "title": title,
                "tags": tags,
                "abstract": abstract,
            }
        )
    return json_results
