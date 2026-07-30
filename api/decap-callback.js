// api/decap-callback.js
// Step 2 of the CMS login flow: GitHub redirects here after you approve
// access, with a one-time `code`. This exchanges that code for a real
// access token (server-side, so the client secret never reaches the
// browser) and hands the token back to the /admin popup via postMessage -
// this exact handshake (the "authorizing:github" ping-pong) is what Decap
// CMS's github backend expects; it's not optional boilerplate.

export default async function handler(req, res) {
  const { code, error } = req.query;

  if (error) {
    return res.status(400).send(`GitHub OAuth error: ${error}`);
  }

  if (!code) {
    return res.status(400).send('Missing authorization code from GitHub.');
  }

  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GITHUB_OAUTH_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return res.status(500).send('GITHUB_OAUTH_CLIENT_ID / GITHUB_OAUTH_CLIENT_SECRET not set in environment variables.');
  }

  try {
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
    });
    const tokenJson = await tokenRes.json();

    if (!tokenJson.access_token) {
      return res.status(400).send(`GitHub did not return a token: ${JSON.stringify(tokenJson)}`);
    }

    const payload = JSON.stringify({ token: tokenJson.access_token, provider: 'github' });

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(`
      <html><body>
        <script>
          (function() {
            function receiveMessage(e) {
              window.opener.postMessage(
                'authorization:github:success:${payload}',
                e.origin
              );
              window.removeEventListener("message", receiveMessage, false);
            }
            window.addEventListener("message", receiveMessage, false);
            window.opener.postMessage("authorizing:github", "*");
          })();
        </script>
        Login successful - this window should close automatically.
      </body></html>
    `);
  } catch (err) {
    console.error('Decap OAuth callback failed:', err);
    return res.status(500).send('Something went wrong completing GitHub login.');
  }
}
