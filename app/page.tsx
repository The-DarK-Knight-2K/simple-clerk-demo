import { auth, currentUser } from '@clerk/nextjs/server'
import { SignInButton, SignUpButton, SignOutButton, UserButton } from '@clerk/nextjs'

async function getUserName(): Promise<string> {
  const user = await currentUser()

  if (!user) return "User"

  if (user.firstName) return user.firstName
  if (user.username) return user.username
  if (user.emailAddresses?.[0]?.emailAddress) {
    return user.emailAddresses[0].emailAddress.split('@')[0]
  }

  return "User"
}

export default async function HomePage() {
  const { userId } = await auth()
  const userName = userId ? await getUserName() : null

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="w-full bg-white shadow-md p-4 flex justify-end gap-4">
        {userId ? (
          <>
            <UserButton afterSignOutUrl="/" />
            <SignOutButton>
              <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                Sign Out
              </button>
            </SignOutButton>
          </>
        ) : (
          <>
            <SignInButton>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                Sign In
              </button>
            </SignInButton>

            <SignUpButton>
              <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                Sign Up
              </button>
            </SignUpButton>
          </>
        )}
      </header>

      {/* Main content */}
      <main className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md bg-white shadow-md rounded-xl p-6 text-center">
          <h1 className="text-3xl font-bold mb-4">Home Page</h1>

          {userId && (
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Welcome, <span className="text-blue-600">{userName}</span> 👋
            </h2>
          )}

          {/* Optional extra content here */}
        </div>
      </main>
    </div>
  )
}
