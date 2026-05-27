// Vercel cron endpoint — triggers the K-Prop Daily Run workflow on GitHub.
//
// Schedule lives in vercel.json. Vercel hits this endpoint on each scheduled
// time, and this function POSTs to the GitHub Actions workflow_dispatch API
// which kicks off `daily.yml` in the rsnbets/kprop-tool repo.
//
// Env vars required (set in Vercel Project Settings → Environment Variables):
//   CRON_SECRET  — Vercel auto-adds this as the Bearer token on cron requests.
//                  Generate any random string (32+ chars). We verify it so
//                  random internet traffic can't trigger our workflow.
//   GITHUB_PAT   — Fine-grained Personal Access Token with:
//                    Repository: rsnbets/kprop-tool
//                    Permissions: Actions (Read and write) + Metadata (Read)
//                  Starts with "github_pat_".

export default async function handler(req, res) {
  // Vercel cron requests carry `Authorization: Bearer ${CRON_SECRET}` automatically.
  // Reject anything else so the endpoint isn't publicly callable.
  const expectedAuth = `Bearer ${process.env.CRON_SECRET}`;
  if (req.headers.authorization !== expectedAuth) {
    return res.status(401).json({ error: "unauthorized" });
  }

  if (!process.env.GITHUB_PAT) {
    return res.status(500).json({ error: "GITHUB_PAT not configured" });
  }

  try {
    const ghResponse = await fetch(
      "https://api.github.com/repos/rsnbets/kprop-tool/actions/workflows/daily.yml/dispatches",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_PAT}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
          "User-Agent": "profit-path-sports-cron",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ref: "main" }),
      }
    );

    if (!ghResponse.ok) {
      const text = await ghResponse.text();
      return res.status(502).json({
        error: "GitHub API rejected the dispatch",
        status: ghResponse.status,
        body: text,
      });
    }

    return res.status(200).json({
      triggered: true,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
}
