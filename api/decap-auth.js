// api/decap-auth.js
// Step 1 of the CMS login flow: redirects to GitHub's OAuth authorize page.
// Decap CMS opens this in a popup window when you click "Login with GitHub"
// on /admin.

export default function handler(req, res) {
  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;

  if (!clientId) {
    return res.status(500).send('GITHUB_OAUTH_CLIENT_ID is not set in environment variables.');
  }

  const host = req.headers.host;
  const protocol = host?.includes('localhost') ? 'http' : 'https';
  const redirectUri = `${protocol}://${host}/api/decap-callback`;

  const authorizeUrl = new URL('https://github.com/login/oauth/authorize');
  authorizeUrl.searchParams.set('client_id', clientId);
  authorizeUrl.searchParams.set('redirect_uri', redirectUri);
  authorizeUrl.searchParams.set('scope', 'repo,user');

  res.writeHead(302, { Location: authorizeUrl.toString() });
  res.end();
}
