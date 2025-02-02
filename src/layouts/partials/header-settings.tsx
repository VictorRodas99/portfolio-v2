import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/dropdown-menu'
import MoonIcon from '@/components/icons/moon'
import GearIcon from '@/components/icons/settings'
import SpainIcon from '@/components/icons/spain'

export default function HeaderSettings() {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger>
        <GearIcon className="size-[18px]" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-secondary border-primary text-soft-white">
        <DropdownMenuLabel>Configuraciones</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">
          <SpainIcon />
          Español
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <MoonIcon />
          Oscuro
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
