export default async (event) => {
  console.log(
    "-----------------------------------------------------------------------------"
  );
  console.log(event);
  console.log(
    "-----------------------------------------------------------------------------"
  );

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
