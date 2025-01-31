import AwesomeCard from './card'
import { useEffect, useState } from 'react'
import { FLAVORS } from '@/lib/about-card-flavors/flavors'

export default function AwesomeCardContainer() {
  const [flavor, setFlavor] = useState(FLAVORS.javascript)

  useEffect(() => {
    const arrayFlavors = Object.values(FLAVORS)

    const changeFlavor = () => {
      const randomIndex = Math.ceil(Math.random() * arrayFlavors.length - 1)
      const currentFlavor = arrayFlavors[randomIndex]
      setFlavor(currentFlavor)
    }

    const intervalFlavor = setInterval(changeFlavor, 5000)

    return () => {
      clearInterval(intervalFlavor)
    }
  }, [])

  return (
    <div>
      <AwesomeCard flavor={flavor} />
    </div>
  )
}
