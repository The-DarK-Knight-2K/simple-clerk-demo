'use client'

import { useActionState } from 'react'
import { completeOnboarding } from '../actions'

export default function OnboardingForm() {
    const [state, formAction, isPending] = useActionState(completeOnboarding, null)

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white shadow-lg rounded-xl p-8">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Welcome!</h1>
                    <p className="text-gray-600 mt-2">Please choose a username to continue.</p>
                </div>

                <form action={formAction} className="space-y-6">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                            Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            required
                            minLength={3}
                            placeholder="cooluser123"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        />
                    </div>

                    {state?.message && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                            {state.message}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isPending ? 'Setting Username...' : 'Continue'}
                    </button>
                </form>
            </div>
        </div>
    )
}
