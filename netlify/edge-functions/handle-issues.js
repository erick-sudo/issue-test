export default async (event) => {
  return new Response(JSON.stringify({ welcome: "Hellow!!" }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const config = {
  path: "/handle-issues",
};
