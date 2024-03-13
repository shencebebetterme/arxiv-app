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
Deal with the OpenAI embedding.
"""

import requests
import json
import time

# ========================== OpenAI API ==============================
# Define the URL of the server endpoint
# url = "https://api.openai.com/v1/embeddings"
url = "https://one.aiskt.com/v1/embeddings"

api_key = "sk-faSkyWzwUgqnP9XO0a43EbCf33Be426fB49eDbB2E2F44e4d"

headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + api_key,
}

# Set the proxy to None
proxies = {
    'http': None,
    'https': None,
}

def embed(text_list):
    """
    Obtain the embedding vectors for a list of string.
    """
    body = {"model": "text-embedding-ada-002", "input": text_list}

    response = requests.post(url, headers=headers, proxies=proxies, json=body)
    if response.status_code == 200:
        # Parse the response as JSON
        json_data = response.json()
        vectors = [data_i["embedding"] for data_i in json_data["data"]]
        return vectors
    else:
        print("response failed, wait for 30 seconds and retrying...")
        time.sleep(30)
        response = requests.post(url, headers=headers, json=body)
        if response.status_code == 200:
            # Parse the response as JSON
            json_data = response.json()
            vectors = [data_i["embedding"] for data_i in json_data["data"]]
            return vectors
        else:
            print("Error code %d" % response.status_code)
            print(response.text)
            # raise an error and stop
            raise Exception("Error code %d" % response.status_code)
