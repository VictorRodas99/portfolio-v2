import { useEffect, useState } from 'react'

interface BatteryManager extends EventTarget {
  charging: boolean
  chargingTime: number
  dischargingTime: number
  level: number
  addEventListener(
    type: 'chargingchange' | 'levelchange',
    listener: EventListener,
    options?: AddEventListenerOptions
  ): void
  removeEventListener(
    type: 'chargingchange' | 'levelchange',
    listener: EventListener,
    options?: EventListenerOptions
  ): void
}

interface NavigatorWithBattery extends Navigator {
  getBattery(): Promise<BatteryManager>
}

const getBattery = async (): Promise<BatteryManager | null> => {
  if (typeof window === 'undefined') {
    return null
  }

  const navigator = window.navigator as NavigatorWithBattery

  if (!navigator?.getBattery) {
    return null
  }

  try {
    return await navigator.getBattery()
  } catch (_error) {
    return null
  }
}

export default function useIsBatteryLow(minBatteryLevelAccepted: number = 20) {
  const [battery, setBattery] = useState<BatteryManager | null>(null)
  const [isDetectingBattery, setIsDetectingBattery] = useState(false)
  const [isBatteryLow, setIsBatteryLow] = useState(false)
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null)
  const [isCharging, setIsCharging] = useState<boolean | null>(null)
  const [isSupported, setIsSupported] = useState(true)

  useEffect(() => {
    let mounted = true

    const detectBattery = async () => {
      setIsDetectingBattery(true)
      const batteryManager = await getBattery()

      if (!mounted) {
        return
      }

      if (!batteryManager) {
        setIsSupported(false)
        setIsDetectingBattery(false)
        return
      }

      setBattery(batteryManager)
      setBatteryLevel(batteryManager.level * 100)
      setIsCharging(batteryManager.charging)
      setIsDetectingBattery(false)
    }

    detectBattery()

    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    if (!battery) return

    const handleLevelChange = () => {
      const level = battery.level * 100
      setBatteryLevel(level)
      setIsBatteryLow(level <= minBatteryLevelAccepted && !battery.charging)
    }

    const handleChargingChange = () => {
      setIsCharging(battery.charging)
      setIsBatteryLow(
        !battery.charging && battery.level * 100 <= minBatteryLevelAccepted
      )
    }

    handleLevelChange()
    handleChargingChange()

    battery.addEventListener('levelchange', handleLevelChange)
    battery.addEventListener('chargingchange', handleChargingChange)

    return () => {
      battery.removeEventListener('levelchange', handleLevelChange)
      battery.removeEventListener('chargingchange', handleChargingChange)
    }
  }, [battery, minBatteryLevelAccepted])

  return {
    isDetectingBattery,
    isBatteryLow,
    batteryLevel,
    isCharging,
    isSupported
  }
}
