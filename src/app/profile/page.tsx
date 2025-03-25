import { PrismaClient } from '@prisma/client'
import { getSession } from '@/lib/useauth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { UserIcon, KeyIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'

async function getUserProfile() {
  const session = await getSession()
  if (!session || !session.user) {
    return null
  }

  const prisma = new PrismaClient()
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id
      },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        role: true
      }
    })
    return user
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return null
  } finally {
    await prisma.$disconnect()
  }
}

export default async function ProfilePage() {
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }

  const user = await getUserProfile()
  if (!user) {
    redirect('/dashboard')
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link 
          href="/dashboard" 
          className="flex items-center text-sm text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Link>
      </div>
      
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">User Profile</h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            View and manage your account information.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <UserIcon className="h-6 w-6 text-gray-400 mr-2" />
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              Personal Information
            </h3>
          </div>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Full name</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">{user.name}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Email address</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">{user.email}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Member since</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                {user.emailVerified ? new Date(user.emailVerified).toLocaleDateString() : 'N/A'}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="mt-8 bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <KeyIcon className="h-6 w-6 text-gray-400 mr-2" />
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              Account Security
            </h3>
          </div>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">Password</h4>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Update your password to keep your account secure.
              </p>
            </div>
            <Link
              href="/profile/change-password"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Change password
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
