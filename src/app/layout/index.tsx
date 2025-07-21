import { useCallback, type FC, type PropsWithChildren } from 'react'

import { Link } from '@tanstack/react-router'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/shared/ui/organisms/navigation-menu'
import { Button } from '@/shared/ui/atoms/button'

import { getAuthActions } from '@/features/auth/model/auth'

const navigationMenuItems = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Applications', href: '/applications' },
  { title: 'Docs', href: '#docs' },
]

const Layout: FC<PropsWithChildren> = ({ children }) => {
  const { logout } = getAuthActions()

  const onClickLogOut = useCallback(() => logout(), [logout])

  return (
    <div className="flex h-[100vh] w-[100vw]">
      <NavigationMenu className="!max-w-[260px] !min-w-[260px] top-[0] flex w-[200px] px-[2rem] py-[1rem] ">
        <h1 className="mb-8">Jobs_Tracker</h1>
        <NavigationMenuList>
          {navigationMenuItems.map(item => (
            <NavigationMenuItem key={item.title}>
              <NavigationMenuLink className={navigationMenuTriggerStyle()} asChild>
                <Link
                  to={item.href}
                  className="!text-[var(--color-text)] !flex-1 !w-[200px] !block mt-2"
                >
                  {item.title}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
        <Button onClick={onClickLogOut} className="mt-auto">
          Log Out
        </Button>
      </NavigationMenu>
      <div className="py-4 px-8 bg-[#f9f9f9] flex-1 overflow-x-auto">{children}</div>
    </div>
  )
}

export default Layout
