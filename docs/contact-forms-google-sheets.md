# Contact forms → Google Sheets + email

Both the contact form (`/contact`) and the franchise enquiry form are submitted to
`POST /api/enquiry`. That route validates the submission and forwards it to a Google
Apps Script web app, which appends a row to a Google Sheet and emails the team. No
email client is opened anymore.

## 0. Which Google account to use

Sign in as the account that should own both the sheet and the outgoing email:
`zippyhorseriding@gmail.com`. Apps Script sends mail as the account that authorizes
the deployment, so authorizing with this Gmail means notifications come from it.

## 1. Create the Google Sheet

1. Go to <https://sheets.google.com> and sign in with the account above.
2. **Blank spreadsheet** → name it e.g. "Zippy Website Enquiries".
3. Right-click the tab at the bottom → **Rename** → `Enquiries`. (Optional: the
   script creates this tab if it is missing.)
4. Look at the browser URL:

   ```
   https://docs.google.com/spreadsheets/d/1AbCdEfGhIjKlMnOpQrStUvWxYz1234567890/edit#gid=0
                                          └────────────── this is SHEET_ID ──────────────┘
   ```

   Copy the characters between `/d/` and `/edit`. Do not copy the whole URL.

## 2. Add the Apps Script

1. In the spreadsheet: **Extensions → Apps Script**. A new tab opens with a
   `Code.gs` file containing `function myFunction() {}`.
2. Delete everything in `Code.gs`.
3. Open [`scripts/google-apps-script/enquiry-webhook.gs`](../scripts/google-apps-script/enquiry-webhook.gs)
   from this repo, copy all of it, and paste it into the editor.
4. Click the save icon (or Ctrl+S) and rename the project to
   "Zippy Enquiry Webhook" if you like.

## 3. Add the Script Properties

These are the values the script reads at runtime.

1. In the Apps Script editor, click the gear icon **Project Settings** in the
   left sidebar.
2. Scroll to **Script Properties** → **Add script property**.
3. Add each of these:

   | Property | Value |
   | --- | --- |
   | `SHEET_ID` | the ID copied in step 1 |
   | `NOTIFY_EMAILS` | `zippyhorseriding@gmail.com` (comma-separate for more recipients) |
   | `SHARED_SECRET` | a long random string, generated below |

   Optional: `SHEET_NAME` (default `Enquiries`) and `TIMEZONE` (default `Asia/Kolkata`).

4. Generate the secret. In a terminal:

   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

   Or with OpenSSL: `openssl rand -hex 32`. Keep this value — the same string goes
   into the website environment as `GOOGLE_SHEETS_WEBHOOK_SECRET`.

5. Click **Save script properties**.

## 4. Deploy the web app

1. Top right: **Deploy → New deployment**.
2. Click the gear next to "Select type" → **Web app**.
3. Fill in:
   - **Description:** `Zippy enquiry webhook`
   - **Execute as:** **Me**
   - **Who has access:** **Anyone**
4. Click **Deploy**. Google asks for authorization:
   - **Authorize access** → choose the same Google account.
   - If you see "Google hasn't verified this app", click **Advanced → Go to
     Zippy Enquiry Webhook (unsafe)** → **Allow**. This warning is expected for
     personal scripts; you are granting your own script access to Sheets and Gmail.
5. Copy the **Web app URL**. It looks like:

   ```
   https://script.google.com/macros/s/AKfycb.../exec
   ```

   Use the `/exec` URL, **not** the `/dev` URL shown while testing.

> If you later edit the script, the live URL keeps running the old version until
> you go to **Deploy → Manage deployments → edit (pencil) → Version: New version →
> Deploy**.

## 5. Configure the website

1. Open `.env.local` in the project root (create it if it does not exist).
2. Add:

   ```bash
   GOOGLE_SHEETS_WEBHOOK_URL="https://script.google.com/macros/s/AKfycb.../exec"
   GOOGLE_SHEETS_WEBHOOK_SECRET="the exact SHARED_SECRET value"
   ```

3. Save the file and restart the dev server (`Ctrl+C`, then `npm run dev`).
   Environment variables are only read at startup.
4. For production, add the same two variables in your host's dashboard
   (e.g. Vercel → Project → Settings → Environment Variables), then redeploy.
   Do not prefix them with `NEXT_PUBLIC_` — they must stay server-side.

`.env.local` is gitignored, so these values never get committed.

## 6. Test it

1. Start the site and submit the form at `/contact`.
2. You should see the "Enquiry received" panel, a new row in the `Enquiries`
   tab, and an email at `NOTIFY_EMAILS`.
3. Open the `/exec` URL in a browser. It should return:

   ```json
   {"ok":true,"service":"zippy-enquiry-webhook"}
   ```

If any of those fail, see the troubleshooting table at the bottom.


## How it behaves

- A successful submission shows an "Enquiry received" confirmation in the page.
- Rows include: received time, form type, name, email, phone, interest, city,
  land status, message, source page, and user agent.
- The notification email sets `Reply-To` to the submitter's email when one was
  provided (franchise enquiries always include it).
- Two anti-spam guards: a hidden honeypot field and an in-memory limit of 10
  submissions per IP per 10 minutes.
- If the sheet write succeeds but the email fails, the row is still saved and the
  error is logged in the Apps Script execution log
  (**Apps Script → Executions**).

## Testing

Submit the contact form locally. Then check:

1. A new row in the `Enquiries` tab.
2. An email in the `NOTIFY_EMAILS` inbox (check spam the first time).
3. `GET` the `/exec` URL in a browser — it should return
   `{"ok":true,"service":"zippy-enquiry-webhook"}`.

You can also test the webhook directly:

```bash
curl -X POST "https://script.google.com/macros/s/.../exec" \
  -H "Content-Type: application/json" \
  -d '{"secret":"YOUR_SECRET","formType":"contact","name":"Test","phone":"9876543210","countryCode":"+91","interest":"Riding Programs","message":"Hello"}'
```

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| `Enquiry service is not configured` | `GOOGLE_SHEETS_WEBHOOK_URL` is missing; restart the server. |
| Script returns `Unauthorized` | `GOOGLE_SHEETS_WEBHOOK_SECRET` and `SHARED_SECRET` differ. |
| Email not delivered | Check **Apps Script → Executions** and the `MailApp` daily quota (consumer accounts allow ~100 emails/day; Google Workspace allows more). |
| Changes to the script have no effect | Redeploy: **Deploy → Manage deployments → Edit → New version**. |
| Sheet not updated | Confirm `SHEET_ID` is the spreadsheet ID (not the full URL) and the script has edit access. |
| Phone cell shows `#ERROR!` / "Formula parse error" | Old script version wrote `+91 ...` as a formula. Update the script to the current version, redeploy a **New version**, and delete the broken row. |
| Webhook returns `401` with an HTML page | Deployment access is not public: set **Who has access** to **Anyone** and redeploy. |
| Enquiries work only in your own browser | Test the `/exec` URL in an Incognito window; a signed-in browser hides the access problem. |
