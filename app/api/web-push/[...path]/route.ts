import webpush from 'web-push';

webpush.setVapidDetails(
  'mailto:timhams@gmail.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,//'BHgQh83cAayq1o13TMjh6qZGdLC_VMCkxn3YdKkVb3afh5lNgpBkdCXMlF3UVUUcE_M7eSWKEq5I376EyP-utgU',//process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.NEXT_PUBLIC_VAPID_PRIVATE_KEY!,//'NkPwS8h4UEbu89ehDSjYUVR5WfRRWyaq8XIdoHm7GNQ',//
);

interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

let subscription: PushSubscription;

export async function POST(request:any) {
  const { pathname } = new URL(request.url);
  switch (pathname) {
    case '/api/web-push/subscription':
      return setSubscription(request);
    case '/api/web-push/send':
      return sendPush(request);
    default:
      return notFoundApi();
  }
}

async function setSubscription(request:any) {
  const body: { subscription: PushSubscription } = await request.json();
  subscription = body.subscription;
  return new Response(JSON.stringify({ message: 'Subscription set.' }), {});
}

async function sendPush(request:any) {
  console.log(subscription, 'subs');
  const body = await request.json();
  const pushPayload = JSON.stringify(body);
  await webpush.sendNotification(subscription, pushPayload);
  return new Response(JSON.stringify({ message: 'Push sent.' }), {});
}

async function notFoundApi() {
  return new Response(JSON.stringify({ error: 'Invalid endpoint' }), {
    headers: { 'Content-Type': 'application/json' },
    status: 404,
  });
}
