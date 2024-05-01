import { App, Octokit } from "octokit";
import { createOrUpdateTextFile } from "@octokit/plugin-create-or-update-text-file";

const MyOctokit = Octokit.plugin(createOrUpdateTextFile).defaults({
  userAgent: "boop-erick-sudo@1.0.0-alpha.2",
});

const app = new App({
  appId: process.env.APP_ID,
  privateKey: process.env.PRIVATE_KEY,
  webhooks: {
    secret: process.env.WEBHOOK_SECRET,
  },
  Octokit: MyOctokit,
});

function bumpBoopCounter(content) {
  return content.replace(
    /<!-- boop-counter -->(\d+)<!-- boop-counter -->/,
    (_content, counter) =>
      `<!-- boop-counter -->${Number(counter) + 1}<!-- boop-counter -->`
  );
}

async function boopEricksCounter(octokit) {
  await octokit
    .createOrUpdateTextFile({
      owner: "erick-sudo",
      repo: "erick-sudo",
      path: "README.md",
      content: ({ content }) => bumpBoopCounter(content),
      message: "Beeping",
    })
    .catch(console.log);
}

app.webhooks.on("issues.opened", async ({ octokit, payload }) => {
  await boopEricksCounter(octokit);
  console.log("Counter booped by @" + payload.sender.login);
});

export default async (event) => {
  try {
    await app.webhooks.verifyAndReceive({
      id:
        event.headers["X-GitHub-Delivery"] ||
        event.headers["x-github-delivery"],
      name: event.headers["X-GitHub-Event"] || event.headers["x-github-event"],
      signature:
        event.headers["X-Hub-Signature-256"] ||
        event.headers["x-hub-signature-256"],
      payload: JSON.parse(event.body),
    });

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    app.log.error(error);
    return new Response(JSON.stringify({ error: "Ooops!!" }), {
      status: error.status || 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};

export const config = {
  path: "/handle-issues",
};
