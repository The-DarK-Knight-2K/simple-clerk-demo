import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import OnboardingForm from './OnboardingForm'

export default async function OnboardingPage() {
    const user = await currentUser()

    if (user?.username) {
        redirect('/')
    }

    return <OnboardingForm />
}
