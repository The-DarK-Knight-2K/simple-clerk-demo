import { clerkClient } from '@clerk/nextjs/server'
import Link from 'next/link'

export default async function UserDetailsPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  // await params first because it's a Promise in Next.js 15+
  const { id } = await params

  try {
    const client = await clerkClient()
    const user = await client.users.getUser(id)

    return (
      <div className="p-8">
        <Link href="/" className="text-blue-500 mb-4 inline-block">← Back</Link>

        <h1 className="text-2xl font-bold mb-4">User Details</h1>

        <div className="space-y-2">
          <p><strong>ID:</strong> {user.id}</p>
          <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
          <p><strong>Email:</strong> {user.emailAddresses[0]?.emailAddress}</p>
          <p><strong>Username:</strong> {user.username || 'N/A'}</p>
        </div>
      </div>
    )
  } catch (error) {
    return (
      <div className="p-8">
        <Link href="/" className="text-blue-500 mb-4 inline-block">← Back</Link>
        <h1 className="text-2xl font-bold mb-4 text-red-500">User Not Found</h1>
        <p>The user with ID &quot;{id}&quot; could not be found.</p>
      </div>
    )
  }
}