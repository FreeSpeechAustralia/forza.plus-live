const API_BASE_URL = (
  document.body.dataset.apiBaseUrl
  || window.FORZA_API_BASE_URL
  || 'https://api.freespeechaustralia.org'
).replace(/\/$/, '');

const STORAGE_SESSION_KEY = 'forza.accounts.sessionToken';
const STRIPE_MEMBERSHIP_TIER = 'supporter';
const STRIPE_CREATOR_SLUG = String(document.body.dataset.creatorSlug || 'forza').trim().toLowerCase() || 'forza';
const MEMBERSHIP_CHECKOUT_LABEL_HTML = 'Start Membership - $17.77';

const startMembershipCheckoutLink = document.getElementById('exclusiveStartMembershipCheckout');
const membershipCheckoutMessage = document.getElementById('membershipCheckoutMessage');

function getSessionToken() {
  return String(localStorage.getItem(STORAGE_SESSION_KEY) || '').trim();
}

function setCheckoutMessage(text, tone = 'info') {
  if (!membershipCheckoutMessage) {
    return;
  }

  membershipCheckoutMessage.hidden = !text;
  membershipCheckoutMessage.textContent = text;
  membershipCheckoutMessage.dataset.tone = tone;
}

function setCheckoutLoading(isLoading) {
  if (!startMembershipCheckoutLink) {
    return;
  }

  startMembershipCheckoutLink.dataset.loading = String(isLoading);
  startMembershipCheckoutLink.style.pointerEvents = isLoading ? 'none' : '';
  startMembershipCheckoutLink[isLoading ? 'textContent' : 'innerHTML'] = isLoading
    ? 'Redirecting...'
    : MEMBERSHIP_CHECKOUT_LABEL_HTML;
}

async function requestCheckoutSession(token) {
  const successUrl = `${window.location.origin}/accounts?stripe=success&session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${window.location.origin}/accounts?stripe=cancel`;
  const response = await fetch(`${API_BASE_URL}/api/v1/stripe/checkout-session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      tier: STRIPE_MEMBERSHIP_TIER,
      creatorSlug: STRIPE_CREATOR_SLUG,
      successUrl,
      cancelUrl,
    }),
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch (error) {
    payload = null;
  }

  if (!response.ok) {
    const apiMessage = payload && payload.error && payload.error.message
      ? payload.error.message
      : `Request failed (${response.status})`;

    if (response.status === 401) {
      localStorage.removeItem(STORAGE_SESSION_KEY);
    }

    throw new Error(apiMessage);
  }

  const checkoutUrl = payload && payload.session ? payload.session.url : null;
  if (!checkoutUrl) {
    throw new Error('Stripe checkout session was created without a redirect URL.');
  }

  return checkoutUrl;
}

function navigateToAccountsViaSpa() {
  if (window.location.pathname !== '/accounts') {
    window.history.pushState({}, '', '/accounts');
  }
  window.dispatchEvent(new PopStateEvent('popstate'));
}

async function handleStartMembership(event) {
  event.preventDefault();
  event.stopPropagation();

  const sessionToken = getSessionToken();
  if (!sessionToken) {
    setCheckoutMessage('Sign in first to start your membership.', 'info');
    navigateToAccountsViaSpa();
    return;
  }

  setCheckoutLoading(true);
  setCheckoutMessage('', 'info');

  try {
    const checkoutUrl = await requestCheckoutSession(sessionToken);
    window.location.assign(checkoutUrl);
  } catch (error) {
    const normalizedMessage = String(error.message || '').toLowerCase();
    if (normalizedMessage.includes('session') || normalizedMessage.includes('authentication')) {
      setCheckoutMessage('Session expired. Sign in again to start your membership.', 'info');
      navigateToAccountsViaSpa();
      return;
    }

    setCheckoutMessage(error.message, 'error');
  } finally {
    setCheckoutLoading(false);
  }
}

if (startMembershipCheckoutLink) {
  startMembershipCheckoutLink.addEventListener('click', handleStartMembership);
}
