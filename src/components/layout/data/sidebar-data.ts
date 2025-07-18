import {
  //IconBarrierBlock,
  IconBrowserCheck,
  //IconBug,
  IconChecklist,
  //IconError404,
  IconHelp,
  //  IconLayoutDashboard,
  //IconLock,
  //IconLockAccess,
  IconMessages,
  IconNotification,
  IconPackages,
  IconPalette,
  //IconServerOff,
  IconSettings,
  IconTool,
  IconUserCog,
  //IconUserOff,
  IconUsers,
} from '@tabler/icons-react'
import { type SidebarData } from '../types'
import { PlusCircledIcon, TableIcon } from '@radix-ui/react-icons'
import { BadgeDollarSign, ClockAlert, ListChecks, TableProperties } from 'lucide-react'

export const sidebarData: SidebarData = {

  navGroups: [
    {
      title: 'General',
      items: [
        /*  {
           title: 'Dashboard',
           url: '/',
           icon: IconLayoutDashboard,
         }, */
        {
          title: 'Services',
          url: '/services',
          icon: IconChecklist,
        },
        {
          title: 'Profiles',
          url: '/profiles',
          icon: ListChecks,
        },
        {
          title: "Sales",
          icon: BadgeDollarSign,
          items: [
            {
              title: "List",
              url: "/sales/all",
              icon: TableProperties,
            },
            {
              icon: ClockAlert,
              title: "Pending",
              url: "/sales"
            },
            {
              icon: PlusCircledIcon,
              title: "Register",
              url: "/sales/new"
            }
          ]
        },
        {
          title: 'Copypoints',
          icon: IconPackages,
          items: [
            {
              title: 'List',
              url: '/copypoints',
              icon: TableIcon,
            },
            {
              title: 'Create',
              url: '/copypoints/create',
              icon: PlusCircledIcon,
            },
          ]
        },
        {
          title: 'Chats',
          url: '/chats',
          badge: '3',
          icon: IconMessages,
        },
        {
          title: 'Employees',
          url: '/users',
          icon: IconUsers,
        },
      ],
    },
    /*     {
          title: 'Pages',
          items: [
            {
              title: 'Auth',
              icon: IconLockAccess,
              items: [
                {
                  title: 'Sign In',
                  url: '/sign-in',
                },
                {
                  title: 'Sign In (2 Col)',
                  url: '/sign-in-2',
                },
                {
                  title: 'Sign Up',
                  url: '/sign-up',
                },
                {
                  title: 'Forgot Password',
                  url: '/forgot-password',
                },
                {
                  title: 'OTP',
                  url: '/otp',
                },
              ],
            },
            {
              title: 'Errors',
              icon: IconBug,
              items: [
                {
                  title: 'Unauthorized',
                  url: '/401',
                  icon: IconLock,
                },
                {
                  title: 'Forbidden',
                  url: '/403',
                  icon: IconUserOff,
                },
                {
                  title: 'Not Found',
                  url: '/404',
                  icon: IconError404,
                },
                {
                  title: 'Internal Server Error',
                  url: '/500',
                  icon: IconServerOff,
                },
                {
                  title: 'Maintenance Error',
                  url: '/503',
                  icon: IconBarrierBlock,
                },
              ],
            },
          ],
        }, */
    {
      title: 'Other',
      items: [
        {
          title: 'Settings',
          icon: IconSettings,
          items: [
            {
              title: 'Profile',
              url: '/settings',
              icon: IconUserCog,
            },
            {
              title: 'Account',
              url: '/settings/account',
              icon: IconTool,
            },
            {
              title: 'Appearance',
              url: '/settings/appearance',
              icon: IconPalette,
            },
            {
              title: 'Notifications',
              url: '/settings/notifications',
              icon: IconNotification,
            },
            {
              title: 'Display',
              url: '/settings/display',
              icon: IconBrowserCheck,
            },
          ],
        },
        {
          title: 'Help Center',
          url: '/help-center',
          icon: IconHelp,
        },
      ],
    },
  ],
}
