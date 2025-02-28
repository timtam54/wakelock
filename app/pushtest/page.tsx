'use client';
import { useEffect, useState } from 'react';
import styles from './page.module.css';
import {
  checkPermissionStateAndAct,
  notificationUnsupported,
  registerAndSubscribe,
  sendWebPush,
} from './Push';

export default function Home() {
  const [unsupported, setUnsupported] = useState<boolean>(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [message, setMessage] = useState<string | null>(null);



  const startNotificationTimer = () => {
    setInterval(async () => {
      try {
        sendWebPush("push test page")
    /*    const response = await fetch("/api/send-notification", { method: "POST" })
        if (!response.ok) {
          throw new Error("Failed to send notification")
        }*/
      } catch (error) {
        console.error("Failed to send notification: ", error)
      }
    }, 20000) // 60000 ms = 1 minute
  }

  useEffect(() => {
    configurePush();
  }, []);

  const configurePush=async ()=>{
    const isUnsupported = notificationUnsupported();
    setUnsupported(isUnsupported);
    if (isUnsupported) {
      return;
    }
   /* if (subscription==null)
    {
    const res=await registerAndSubscribe(setSubscription);
    if (res!='success')
    {
    alert(res);
    return;
    }
    }*/
    checkPermissionStateAndAct(setSubscription);
    startNotificationTimer()
  }
  return (
    <main>
      <div className={styles.center}>
        <button
          disabled={unsupported}
          onClick={async() => {const res=await registerAndSubscribe(setSubscription);alert(res);}}
          className={subscription ? styles.activeButton : ''}>
          {unsupported
            ? 'Notification Unsupported'
            : subscription
              ? 'Notification allowed'
              : 'Allow notification'}
        </button>
        {subscription ? (
          <>
            <input
              placeholder={'Type push message ...'}
              style={{ marginTop: '5rem' }}
              value={message ?? ''}
              onChange={e => setMessage(e.target.value)}
            />
            <button onClick={() => sendWebPush(message)}>Test Web Push</button>
          </>
        ) : null}
        <div className={styles.subscriptionLabel}>
          <span>Push subscription:</span>
        </div>
        <code className={styles.codeBox}>
          {subscription
            ? JSON.stringify(subscription?.toJSON(), undefined, 2)
            : 'There is no subscription'}
        </code>
      </div>
      <a href="/">Back</a>
    </main>
  );
}
