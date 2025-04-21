import sendTelegram from "./telegram";
import sendDiscord from "./discord";

fetch(
  `https://api.github.com/repos/${process.env.REPO}/releases/${process.env.RELEASE_ID}`,
  {
    headers: { Authorization: `token ${process.env.GITHUB_TOKEN}` },
  },
)
  .then((response) => response.json())
  .then((response) => response.body)
  .then((body) => {
    sendDiscord(body);
    sendTelegram(body);
  })
  .catch((error) => {
    console.log(error);
  });
