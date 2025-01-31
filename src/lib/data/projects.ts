import AstroIcon from '@/components/icons/astro'
import TailwindCSSIcon from '@/components/icons/tailwind'
import ReactIcon from '@/components/icons/react'
import TypeScriptIcon from '@/components/icons/typescript'
import SupabaseIcon from '@/components/icons/supabase'
import BashIcon from '@/components/icons/bash'
import PowershellIcon from '@/components/icons/powershell'
import JavaScriptIcon from '@/components/icons/javascript'
import CloudflareIcon from '@/components/icons/cloudflare'
import HonoIcon from '@/components/icons/hono'
import CSSIcon from '@/components/icons/css'

// change the color property in every project stack for colorClass
const projects = Object.freeze([
  {
    name: 'Explora Ñeembucú – Descubre los encantos de Ñeembucú, Paraguay',
    slug: 'explora-neembucu',
    image: '/projects/explora-ñeembucu.webp',
    description:
      'Una página web desarrollada con Astro y React que recopila información sobre hoteles, restaurantes y puntos turísticos relevantes de diferentes zonas de Ñeembucú. Una guía de turismo única.',
    github: 'https://github.com/VictorRodas99/explora-turismo-app',
    demo: 'https://explora-turismo-app.vercel.app/',
    stack: [
      {
        name: 'Astro',
        colorClass: 'bg-[#060913] text-[#fff]',
        icon: AstroIcon
      },
      {
        name: 'Tailwind CSS',
        colorClass: 'bg-[#003159] text-[#fff]',
        icon: TailwindCSSIcon
      },
      {
        name: 'React',
        colorClass: 'bg-[#58c4dc] text-[#fff]',
        icon: ReactIcon
      },
      {
        name: 'Typescript',
        colorClass: 'bg-[#3178C6] text-[#fff]',
        icon: TypeScriptIcon
      },
      {
        name: 'Supabase',
        colorClass: 'bg-[#31b579] text-[#fff]',
        icon: SupabaseIcon
      }
    ]
  },
  {
    name: 'just-music – Una hermosa interfaz de línea de comandos',
    slug: 'just-music',
    image: '/projects/just-music.webp',
    description:
      'Una línea de comandos que permite reproducir música de YouTube sin necesidad de un navegador.',
    github: 'https://github.com/VictorRodas99/just-music',
    demo: 'https://www.npmjs.com/package/just-music',
    stack: [
      { name: 'Bash', colorClass: 'bg-[#000] text-[#fff]', icon: BashIcon },
      {
        name: 'PowerShell',
        colorClass: 'bg-[#0072C6] text-[#fff]',
        icon: PowershellIcon
      },
      {
        name: 'JavaScript',
        colorClass: 'bg-[#f0dc4e] text-[#fff]',
        icon: JavaScriptIcon
      }
    ]
  },
  {
    name: 'InfoShop - Ecommerce FullStack',
    slug: 'info-shop',
    image: '/projects/info-shop.webp',
    description:
      'Desarrollado con React y Hono. Esta aplicación te mantiene al día con los últimos productos de informática y electrónica. El catálogo se actualiza automáticamente de manera semanal.',
    github: 'https://github.com/VictorRodas99/ecommerce-web-project',
    demo: 'https://ecommerce-project-vik.netlify.app/',
    stack: [
      {
        name: 'React',
        colorClass: 'bg-[#58c4dc] text-[#fff]',
        icon: ReactIcon
      },
      {
        name: 'Edge Workers',
        colorClass: 'bg-[#e36002] text-[#fff]',
        icon: CloudflareIcon
      },
      { name: 'Hono', colorClass: 'bg-[#e36002] text-[#fff]', icon: HonoIcon },
      { name: 'CSS', colorClass: 'bg-[#66309a] text-[#fff]', icon: CSSIcon }
    ]
  }
])

export default projects
