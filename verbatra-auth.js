/* ============================================================
   Verbatra — shared auth + credit-gating module
   Include on EVERY page that needs login/credits, right after the
   Supabase CDN script tag:

   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"></script>
   <script src="/verbatra-auth.js"></script>

   (Correct CDN URL is set below in code — the tag above is illustrative;
   the actual <script> tag to use is documented in SETUP.md.)
   ============================================================ */

(function () {
  // ---- FILL THESE IN from your Supabase project (Settings > API) ----
  // Both are meant to be public / safe to expose in client-side code.
  const SUPABASE_URL = "https://cgjlfxyhyesxrqvcvlyh.supabase.co";
  const SUPABASE_ANON_KEY = "sb_publishable_08MVwyP_KBAkcWQykYhEGA_YrbvSsM3";
  // ---------------------------------------------------------------------

  if (!window.supabase || !window.supabase.createClient) {
    console.error("Verbatra auth: Supabase JS SDK not loaded. Add the CDN script tag before verbatra-auth.js.");
    return;
  }

  const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  async function getSession() {
    const { data } = await sb.auth.getSession();
    return data.session || null;
  }

  async function getUser() {
    const session = await getSession();
    return session ? session.user : null;
  }

  function currentPageUrl() {
    return encodeURIComponent(window.location.pathname + window.location.search);
  }

  function goToLogin() {
    window.location.href = "/login.html?redirect=" + currentPageUrl();
  }

  function goToUpgrade(message) {
    const q = message ? "?msg=" + encodeURIComponent(message) : "?msg=" + encodeURIComponent("You've used your 5 free documents this month.");
    window.location.href = "/account.html" + q;
  }

  async function signOut() {
    await sb.auth.signOut();
    window.location.href = "/";
  }

  async function getUsageStatus() {
    const session = await getSession();
    if (!session) return { authenticated: false };
    const { data, error } = await sb.rpc("get_usage_status");
    if (error) { console.error("Verbatra auth: get_usage_status failed", error); return { authenticated: true, error: true }; }
    return data;
  }

  /**
   * Call this right before generating/exporting a document (Word or PDF).
   * - Not logged in            -> redirects to login, returns false
   * - Logged in, credit OK     -> consumes 1 credit (unless unlimited plan), returns true
   * - Logged in, limit reached -> redirects to account/upgrade page, returns false
   *
   * Usage in a tool page:
   *   const ok = await VBAuth.requireCreditAndProceed();
   *   if (!ok) return;
   *   _exportWord(); // or window.print()
   */
  async function requireCreditAndProceed() {
    const session = await getSession();
    if (!session) { goToLogin(); return false; }

    const { data, error } = await sb.rpc("consume_credit");
    if (error) {
      console.error("Verbatra auth: consume_credit failed", error);
      alert("Something went wrong checking your account. Please try again or contact verbatra.legal@gmail.com.");
      return false;
    }
    if (!data.allowed) {
      goToUpgrade("You've used your 5 free documents this month. Upgrade for unlimited access.");
      return false;
    }
    return true;
  }

  window.VBAuth = {
    supabase: sb,
    getSession,
    getUser,
    signOut,
    getUsageStatus,
    requireCreditAndProceed,
    goToLogin,
    goToUpgrade,
  };
})();
