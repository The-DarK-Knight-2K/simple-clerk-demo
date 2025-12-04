import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

// Helper function to get the primary/consistent email address
function getPrimaryEmail(emailAddresses: any[], primaryEmailId: string | null | undefined): string {
  // Try to find the email matching the primary_email_address_id
  const primaryEmail = emailAddresses.find(email => email.id === primaryEmailId)

  // Use the found primary email, or fallback to the first one
  const emailToUse = primaryEmail?.email_address || emailAddresses[0]?.email_address

  console.log('📧 All emails from Clerk:', emailAddresses.map(e => e.email_address))
  console.log('🆔 Primary Email ID:', primaryEmailId)
  console.log('✅ Using email:', emailToUse)

  return emailToUse
}

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET to .env')
  }

  // Get the headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing svix headers', {
      status: 400,
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Create a new Svix instance with your secret
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error: Verification failed', {
      status: 400,
    })
  }

  // Handle the webhook
  const eventType = evt.type

  if (eventType === 'user.created') {
    const { id, email_addresses, username, first_name, last_name, image_url, primary_email_address_id } = evt.data as any
    const email = getPrimaryEmail(email_addresses, primary_email_address_id)

    try {
      await prisma.user.upsert({
        where: { clerkId: id },
        create: {
          clerkId: id,
          email: email,
          username: username,
          firstName: first_name,
          lastName: last_name,
          imageUrl: image_url,
        },
        update: {
          email: email,
          username: username,
          firstName: first_name,
          lastName: last_name,
          imageUrl: image_url,
        },
      })

      console.log('✅ User created in database:', id)
    } catch (error) {
      console.error('Error creating user:', error)
      return new Response('Error: Failed to create user', { status: 500 })
    }
  }

  if (eventType === 'user.updated') {
    const { id, email_addresses, username, first_name, last_name, image_url, primary_email_address_id } = evt.data as any
    const email = getPrimaryEmail(email_addresses, primary_email_address_id)

    try {
      await prisma.user.upsert({
        where: { clerkId: id },
        create: {
          clerkId: id,
          email: email,
          username: username,
          firstName: first_name,
          lastName: last_name,
          imageUrl: image_url,
        },
        update: {
          email: email,
          username: username,
          firstName: first_name,
          lastName: last_name,
          imageUrl: image_url,
        },
      })

      console.log('✅ User updated in database:', id)
    } catch (error) {
      console.error('Error updating user:', error)
      return new Response('Error: Failed to update user', { status: 500 })
    }
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data

    try {
      await prisma.user.deleteMany({
        where: { clerkId: id },
      })

      console.log('✅ User deleted from database:', id)
    } catch (error) {
      console.error('Error deleting user:', error)
      return new Response('Error: Failed to delete user', { status: 500 })
    }
  }

  return new Response('Webhook processed successfully', { status: 200 })
}