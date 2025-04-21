import env from "./env";

type Asset = {
  url: string;
  name: string;
  size: number;
  browser_download_url: string;
};

const releaseAssets = JSON.parse(env.FILES!) as Asset[];

export default async (releaseBody: string) => {
  const webhookUrl = env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error("DISCORD_WEBHOOK_URL is not set");
    return;
  }
  const isRelease = !env.RELEASE_VERSION?.startsWith("temp");
  const commitID = env.GITHUB_SHA?.slice(0, 7)!;
  const body = {
    "username": "Build Bot",
    "avatar_url":
      "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
    "embeds": [
      {
        "title": `🚀 New ${isRelease ? "Version Released" : "Build Completed"}`,
        "description": `A new build was completed for a recent ${
          isRelease ? "release" : "commit"
        }.`,
        "color": 3447003,
        "fields": [
          {
            "name": "",
            "value": `Repo : [${env.REPO}](https://github.com/${env.REPO})`,
          },
          {
            "name": "🔗 Release Notes",
            "value": releaseBody,
          },
          isRelease
            ? {
              "name": "🔧 Release Version",
              "value": `\`${env.RELEASE_VERSION}\``,
              "inline": true,
            }
            : {
              "name": "🔧 Commit",
              "value":
                `[${commitID}](https://github.com/${env.REPO}/commit/${commitID})`,
              "inline": true,
            },
          {
            "name": "📂 Branch",
            "value": `\`${env.GITHUB_REF_NAME}\``,
            "inline": true,
          },
          {
            "name": "Build Assets",
            "value": `\`${releaseAssets.length}\` files`,
          },
          ...releaseAssets.map((asset) => ({
            name: ``,
            value: `[${asset.name}](${asset.browser_download_url})`,
            inline: true,
          })),
        ],
        "footer": {
          "text": "GitHub Actions • Discord Notification",
        },
        "timestamp": new Date().toISOString(),
      },
    ],
  };

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "GitHubReleaseNotifier",
    },
    body: JSON.stringify(body),
  };
  await fetch(webhookUrl, options);
};
