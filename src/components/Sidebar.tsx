import { Link, useLocation } from 'react-router-dom'
import { FiHome, FiHeart, FiBookOpen, FiAward, FiUser } from 'react-icons/fi'
import clsx from 'clsx'

const navigation = [
  { name: 'Dashboard', href: '/', icon: FiHome },
  { name: 'Health Insights', href: '/health-insights', icon: FiHeart },
  { name: 'Awareness', href: '/awareness', icon: FiAward },
  { name: 'Education', href: '/education', icon: FiBookOpen },
  { name: 'Find Doctor', href: '/find-doctor', icon: FiUser },
]

export default function Sidebar() {
  const location = useLocation()

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white/80 backdrop-blur-sm px-6 pb-4 border-r border-gray-100">
        <div className="flex h-16 shrink-0 items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
            DiabetesTracker
          </h1>
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={clsx(
                        'nav-link',
                        location.pathname === item.href && 'nav-link-active'
                      )}
                    >
                      <item.icon
                        className={clsx(
                          'h-5 w-5',
                          location.pathname === item.href
                            ? 'text-primary-600'
                            : 'text-gray-400 group-hover:text-primary-600'
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}