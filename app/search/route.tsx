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
