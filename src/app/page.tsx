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
import Faq from '@/components/sections/Faq'
import Download from '@/components/sections/Download'



export default function LandingPage() {
  return (
    <main className='overflow-hidden'>
    <div className="min-h-screen text-p4">
      {/* Navigation */}
      <Header />

      <Hero />
      {/* <Features /> */}
      <Feature />
      <Pricing />
      <Faq />
      <Download />
      <CallToAction />
      <Footer />
      

      

      
    </div>
    </main>
  )
}