import { Config } from "@/app/components/Config";

export async function POST(request: Request) {
  const res = await request.json(); // res now contains the body payload
  const id = res.id;

  console.log("Paper id received. Opening ", id);

  // Send request to flask server
  const response = await fetch(Config.flask_address + "/open", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: id }),
  });

  const data = await response.json();
  return Response.json(data);
  // return data;
}
