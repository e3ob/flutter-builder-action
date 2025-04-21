## 📦 Github Flutter Builder and Notifier

**Send Flutter build APKs to Telegram and Discord automatically.**  
Perfect for both release announcements and commit-based CI delivery.

> **Author**: [e3ob](https://github.com/e3ob)  

---

### 🔹 Features

- 🛠 **Build Flutter APKs** with full support for custom path, version, and channel  
- 🚀 **Automatic GitHub Releases** with optional version tagging  
- 📲 **Send APK files to Telegram** chats via Bot API & MTProto  
- 💬 **Send Discord embeds** with download links to `.apk` artifacts  
- ⚙️ Supports both **release builds** and **commit-based builds**  
- 🔐 Easy integration with secrets (Telegram & Discord)  
- 🧩 Composite and reusable for any CI/CD pipeline

---

### 🔧 Inputs

| Name                  | Required | Default                        | Description                                      |
|-----------------------|----------|--------------------------------|--------------------------------------------------|
| `repo`                | ❌        | `${{ github.repository }}`     | Repository to clone for building                 |
| `path`                | ❌        | `.`                            | Path to the Flutter project                      |
| `flutter_version`     | ❌        | `any`                          | Flutter version to use                           |
| `flutter_channel`     | ❌        | `stable`                       | Flutter release channel                          |
| `release_version`     | ❌        | *(none)*                       | If set, marks this as a release                  |
| `discord_webhook_url` | ❌        | *(none)*                       | Webhook URL to notify on Discord                 |
| `tg_api_id`           | ❌        | *(none)*                       | Telegram API ID                                  |
| `tg_api_hash`         | ❌        | *(none)*                       | Telegram API Hash                                |
| `tg_bot_token`        | ❌        | *(none)*                       | Telegram Bot Token                               |
| `tg_chat_id`          | ❌        | *(none)*                       | Chat ID to send Telegram messages to             |

---

### 🚀 Example Usage

```yaml
jobs:
  flutter-build:
    runs-on: ubuntu-latest
    name: Build and Notify
    steps:
      - uses: e3ob/flutter-builder-action@v1
        with:
          flutter_version: '3.16.3'
          flutter_channel: 'stable'
          release_version: 'v1.0.0'  # Optional
          tg_api_id: ${{ secrets.TG_API_ID }}
          tg_api_hash: ${{ secrets.TG_API_HASH }}
          tg_bot_token: ${{ secrets.TG_BOT_TOKEN }}
          tg_chat_id: ${{ secrets.TG_CHAT_ID }}
          discord_webhook_url: ${{ secrets.DISCORD_WEBHOOK_URL }}
```
