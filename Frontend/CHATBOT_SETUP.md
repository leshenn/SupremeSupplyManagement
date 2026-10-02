# SSM Chatbot setup

The website chatbot is controlled by the **SSM Chatbot** WordPress plugin.

## WordPress

1. Install and activate `ssm-chatbot.zip`.
2. Open **Chatbot → Settings** to edit the greeting and intro.
3. Open **Chatbot** to add/edit choices and responses.
4. Use **Chatbot → CSV Import** for bulk updates.

The plugin exposes:

`/wp-json/ssm/v1/chatbot`

## Frontend

No extra environment variable is needed. The chatbot uses the existing `WORDPRESS_URL` value.

If WordPress/the chatbot endpoint is unavailable or has no published chatbot items, the floating chatbot is not rendered.
