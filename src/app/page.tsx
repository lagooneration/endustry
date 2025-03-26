'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Hero from '@/components/sections/Hero'
import Features from '@/components/sections/Features'
import CallToAction from '@/components/sections/CallToAction'
import Footer from '@/components/sections/Footer'
import Pricing from '@/components/sections/Pricing'
import Feature from '@/components/sections/Feature'
import Header from '@/components/sections/Header'



export default function LandingPage() {
  return (
    <main className='overflow-hidden'>
    <div className="min-h-screen text-p4">
      {/* Navigation */}
      {/* <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Image
                src="/logo-png.png"
                alt="Industry Admin Logo"
                width={32}
                height={32}
                className="h-8 w-auto"
              />
              <span className="ml-2 text-xl font-semibold text-gray-900">Endustry</span>
            </div>
            <Link
              href="/auth/login"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav> */}
      <Header />

      <Hero />
      {/* <Features /> */}
      <Feature />
      <Pricing />
      <CallToAction />
      <Footer />
      

      

      
    </div>
    </main>
  )
}