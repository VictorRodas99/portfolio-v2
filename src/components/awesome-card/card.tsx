import Atropos from 'atropos/react'
import 'atropos/css'

function BackgroundPattern() {
  return (
    <svg
      id="patternId"
      width="200%"
      height="200%"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="a"
          patternUnits="userSpaceOnUse"
          width="70"
          height="8"
          patternTransform="scale(2) rotate(0)"
        >
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="rgba(255, 255, 255, .1)"
          />
          <path
            d="M-.02 22c8.373 0 11.938-4.695 16.32-9.662C20.785 7.258 25.728 2 35 2c9.272 0 14.215 5.258 18.7 10.338C58.082 17.305 61.647 22 70.02 22M-.02 14.002C8.353 14 11.918 9.306 16.3 4.339 20.785-.742 25.728-6 35-6 44.272-6 49.215-.742 53.7 4.339c4.382 4.967 7.947 9.661 16.32 9.664M70 6.004c-8.373-.001-11.918-4.698-16.3-9.665C49.215-8.742 44.272-14 35-14c-9.272 0-14.215 5.258-18.7 10.339C11.918 1.306 8.353 6-.02 6.002"
            strokeWidth="1.5"
            stroke="rgba(255, 255, 255, .1)"
            fill="none"
          />
        </pattern>
      </defs>
      <rect
        width="800%"
        height="800%"
        transform="translate(0,0)"
        fill="url(#a)"
      />
    </svg>
  )
}

interface CardProps {
  flavor: {
    component: ({ className }: { className: string }) => React.JSX.Element
  }
}

export default function AwesomeCard({ flavor }: CardProps) {
  return (
    <Atropos
      className="size-[100px] lg:size-[220px] bg-[#000214] rounded-2xl"
      shadow={false}
    >
      <div className="relative w-full h-full overflow-hidden rounded-2xl">
        <div className="absolute h-full">
          <BackgroundPattern />
        </div>
      </div>

      <div
        className={
          'absolute top-0 z-10 overflow-hidden opacity-70 h-full rounded-2xl flex items-end'
        }
      >
        <figure>
          <flavor.component className="w-full h-full" />
        </figure>
      </div>
    </Atropos>
  )
}
