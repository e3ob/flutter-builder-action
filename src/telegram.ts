import { Client, StorageLocalStorage } from "@mtkruto/node";
import Tg from "telegramify-markdown";
import fg from "fast-glob";
import * as fs from "fs";
import env from "./env";

export default async (releaseBody: string) => {
  if (
    !env.TG_API_ID || !env.TG_API_HASH || !env.TG_BOT_TOKEN || !env.TG_CHAT_ID
  ) {
    console.error(
      "TG_API_ID, TG_API_HASH, TG_BOT_TOKEN or TG_CHAT_ID is not set",
    );
    return;
  }
  const chatId = env.TG_CHAT_ID;
  const isRelease = !env.RELEASE_VERSION?.startsWith("temp");
  const commitID = env.GITHUB_SHA?.slice(0, 7)!;
  const client = new Client({
    apiId: Number(env.TG_API_ID),
    apiHash: env.TG_API_HASH,
    storage: new StorageLocalStorage("my_client"),
  });
  await client.start({ botToken: env.TG_BOT_TOKEN });
  const message = `${
    isRelease
      ? "🚀 **New Release Build Available!**"
      : "🔧 **New Commit Build Ready**"
  }
📦 **Repository**:  [${env.REPO}](https://github.com/${env.REPO})
${
    isRelease
      ? `\n🏷 **Tag**: \`${env.RELEASE_VERSION}\``
      : `🔖 **Commit**: [${commitID}](https://github.com/${env.REPO}/commit/${commitID})`
  }
📂 **Branch**: \`${env.GITHUB_REF_NAME}\`
${isRelease ? "📄 **Release Notes** " : "📝 **Message**"}

${releaseBody}


${isRelease ? "#release" : ""}
`;

  await client.sendMessage(env.TG_CHAT_ID, Tg(message, "keep"), {
    parseMode: "Markdown",
    disableNotification: false,
  });
  const files = await fg(`${env.APK_PATH}*.apk`);

  await Promise.all(files.map(async (file: string) => {
    const fileBlob = await fs.openAsBlob(file);
    const fileName = file.split("/").pop();
    const fileSize = fs.statSync(file).size / (1024 * 1024);
    await client.sendDocument(chatId, await fileBlob.stream(), {
      disableNotification: false,
      fileName: fileName,
      fileSize: fileSize,
    });
  }));
  client.disconnect();
};
