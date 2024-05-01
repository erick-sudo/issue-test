#!/usr/bin/env node

import { Octokit } from "@octokit/core";
import { createOrUpdateTextFile } from "@octokit/plugin-create-or-update-text-file";
import { createOAuthDeviceAuth } from "@octokit/auth-oauth-device";

const MyOctokit = Octokit.plugin(createOrUpdateTextFile).defaults({
  userAgent: "Obuya Nose Booper",
});

const octokit = new MyOctokit({
  authStrategy: createOAuthDeviceAuth,
  auth: {
    clientType: "oauth-app",
    clientId: "4f80b7142fcda7202ba7",
    scopes: ["public_repo"],
    onVerification(verification) {
      // verification example
      // {
      //   device_code: "3584d83530557fdd1f46af8289938c8ef79f9dc5",
      //   user_code: "WDJB-MJHT",
      //   verification_uri: "https://github.com/login/device",
      //   expires_in: 900,
      //   interval: 5,
      // };

      console.log("Open %s", verification.verification_uri);
      console.log("Enter code: %s", verification.user_code);
    },
  },
});

async function run() {
  try {
    await octokit.createOrUpdateTextFile({
      owner: "erick-sudo",
      repo: "erick-sudo",
      path: "README.md",
      content: ({ content }) => bumpBoopCounter(content),
      message: "Beeping",
    });

    console.log("Booped succesfully");
  } catch (error) {
    const { data: issue } = await octokit.request(
      "POST /repos/{owner}/{repo}/issues",
      {
        owner: "erick-sudo",
        repo: "issue-test",
        title: "plz to boop",
        body: "I bestow upon you my finest of boops",
      }
    );

    console.log(`issue created at ${issue.html_url}`);
  }
}

function bumpBoopCounter(content) {
  return content.replace(
    /<!-- boop-counter -->(\d+)<!-- boop-counter -->/,
    (_content, counter) =>
      `<!-- boop-counter -->${Number(counter) + 1}<!-- boop-counter -->`
  );
}

run();
