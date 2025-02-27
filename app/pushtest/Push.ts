const SERVICE_WORKER_FILE_PATH = '/sw.js';//was './sw.js';

export function notificationUnsupported(): boolean {
  let unsupported = false;
  if (
    !('serviceWorker' in navigator) ||
    !('PushManager' in window) ||
    !('showNotification' in ServiceWorkerRegistration.prototype)
  ) {
    unsupported = true;
  } 
  return unsupported;
}

export function checkPermissionStateAndAct(
  onSubscribe: (subs: PushSubscription | null) => void,
): void {
  const state: NotificationPermission = Notification.permission;
  switch (state) {
    case 'denied':
      break;
    case 'granted':
      registerAndSubscribe(onSubscribe);
      break;
    case 'default':
      break;
  }
}

async function subscribe(onSubscribe: (subs: PushSubscription | null) => void): Promise<void> {
  
  navigator.serviceWorker.ready
    .then((registration: ServiceWorkerRegistration) => {
      return registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,//'BHgQh83cAayq1o13TMjh6qZGdLC_VMCkxn3YdKkVb3afh5lNgpBkdCXMlF3UVUUcE_M7eSWKEq5I376EyP-utgU',//,
      });
    })
    .then((subscription: PushSubscription) => {
      console.info('Created subscription Object: ', JSON.stringify( subscription.toJSON()));
     // alert('Created subscription Object: '+ JSON.stringify(subscription.toJSON()));

      submitSubscription(subscription).then(_ => {
        onSubscribe(subscription);
      });
    })
    .catch(e => {
      alert('Failed to subscribe cause of: '+ e);
    });
}

async function submitSubscription(subscription: PushSubscription): Promise<void> {
  const endpointUrl = '/api/web-push/subscription';
  const res = await fetch(endpointUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ subscription }),
  });
  const result = await res.json();
  console.log(result);
}

export async function registerAndSubscribe(
  onSubscribe: (subs: PushSubscription | null) => void,
): Promise<string> {
  try {
    await navigator.serviceWorker.register(SERVICE_WORKER_FILE_PATH);
    await subscribe(onSubscribe);
    return 'success'
  } catch (e) {
    //alert('Failed to register service-worker: '+e);

    return ('Failed to register service-worker: '+ e);
  }

}

export async function sendWebPush(message: string | null): Promise<void> {
  const endPointUrl = '/api/web-push/send';
  const pushBody = {
    title: 'Push Test',
    body: message ?? 'This is a test push message',
    image: 'logo192.png',
    icon: 'logo192.png',
    url: 'https://nice-hill-0674e801e.4.azurestaticapps.net/',
  };
  const res = await fetch(endPointUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(pushBody),
  });
  const result = await res.json();
  console.log(result);
}
