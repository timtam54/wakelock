"use client"

import { useState, useEffect } from "react"
import styles from "./page.module.css"

export default function WakeLockPage() {
  const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null)
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    setIsSupported("wakeLock" in navigator)
  }, [])

  const requestWakeLock = async () => {
    try {
      const lock = await navigator.wakeLock.request("screen")
      setWakeLock(lock)
      lock.addEventListener("release", () => {
        setWakeLock(null)
      })
    } catch (err) {
      console.error(`Failed to request wake lock: ${err}`)
    }
  }

  const releaseWakeLock = () => {
    if (wakeLock) {
      wakeLock.release()
      setWakeLock(null)
    }
  }

  const toggleWakeLock = () => {
    if (wakeLock) {
      releaseWakeLock()
    } else {
      requestWakeLock()
    }
  }

  if (!isSupported) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Wake Lock Not Supported</h1>
        <p className={styles.description}>Unfortunately, your browser does not support the Wake Lock API.</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Wake Lock Demo</h1>
      <p className={styles.description}>Current status: {wakeLock ? "Active" : "Inactive"}</p>
      <button className={styles.button} onClick={toggleWakeLock} aria-pressed={!!wakeLock}>
        {wakeLock ? "Deactivate Wake Lock" : "Activate Wake Lock"}
      </button>
      <p className={styles.info}>When active, this will prevent your device from dimming or locking the screen.</p>
      <a href="/pushtest">Push Test Page</a>
    </div>
  )
}

