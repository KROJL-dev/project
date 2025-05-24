import type { FC, PropsWithChildren } from 'react'

import { Link } from '@tanstack/react-router'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/shared/ui/navigation-menu'
import { Button } from '@/shared/ui/button'

import { getAuthActions } from '@/features/auth/model/auth'

const navigationMenuItems = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Applications', href: '/applications' },
  { title: 'Docs', href: '#docs' },
]

const Layout: FC<PropsWithChildren> = ({ children }) => {
  const { logout } = getAuthActions()
  return (
    <>
      <NavigationMenu className="!max-w-none sticky top-[0] block flex w-[100vw] justify-between px-[2rem] py-[1rem]">
        <NavigationMenuList>
          {navigationMenuItems.map(item => (
            <NavigationMenuItem key={item.title}>
              <NavigationMenuLink className={navigationMenuTriggerStyle()} asChild>
                <Link to={item.href} className="!text-[var(--color-text)]">
                  {item.title}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
        <Button onClick={logout}>Log Out</Button>
      </NavigationMenu>
      {children}
    </>
  )
}

export default Layout
