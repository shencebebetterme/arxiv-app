// # Copyright (c) 2023 Baidu, Inc. All Rights Reserved.
// #
// # Licensed under the Apache License, Version 2.0 (the "License");
// # you may not use this file except in compliance with the License.
// # You may obtain a copy of the License at
// #
// #     http://www.apache.org/licenses/LICENSE-2.0
// #
// # Unless required by applicable law or agreed to in writing, software
// # distributed under the License is distributed on an "AS IS" BASIS,
// # WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// # See the License for the specific language governing permissions and
// # limitations under the License.

import { Config } from "@/app/components/Config";

export async function POST(request: Request) {
  const res = await request.json(); // res now contains the body payload
  const text = res.message;
  const topk = res.topk;

  console.log("Search text request received. Searching ", text);

  // Send request to flask server
  const response = await fetch(Config.flask_address + "/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: text, topk: topk }),
  });
  const data = await response.json();

  return Response.json(data);
  // return data;
}
