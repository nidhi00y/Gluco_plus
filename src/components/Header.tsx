import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'

export default function Header() {
  const { user } = useAuth()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-100 bg-white/80 backdrop-blur-sm px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <div className="flex flex-1 gap-x-4 self-stretch items-center justify-end">
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          {user && (
            <div className="flex items-center gap-x-4">
              <span className="text-sm text-gray-700">{user.email}</span>
              <button
                onClick={handleSignOut}
                className="text-sm font-medium text-gray-900 hover:text-primary-600 transition-colors duration-200"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}