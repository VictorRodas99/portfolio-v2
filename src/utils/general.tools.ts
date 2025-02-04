export const getRandomNumber = (to: number) => Math.ceil(Math.random() * to)

export const getRandomRGB = () => {
  const red = getRandomNumber(255)
  const green = getRandomNumber(255)

  return `rgb(${red}, ${green}, 226)`
}
