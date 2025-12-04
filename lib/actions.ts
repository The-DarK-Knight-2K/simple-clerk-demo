"use server"

import { auth, clerkClient } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

type State = {
    message: string | null
}

export async function completeOnboarding(prevState: State | null, formData: FormData) {
    const { userId } = await auth()

    if (!userId) {
        return { message: 'No Logged In User' }
    }

    const username = formData.get('username') as string

    if (!username || username.length < 3) {
        return { message: 'Username must be at least 3 characters long' }
    }

    try {
        const client = await clerkClient()
        await client.users.updateUser(userId, {
            username: username,
        })
    } catch (err) {
        const error = err as { errors?: { code: string }[] };
        if (error.errors && error.errors[0]?.code === 'form_identifier_exists') {
            return { message: 'Username is already taken' }
        }
        return { message: 'Something went wrong. Please try again.' }
    }

    redirect('/')
}
