import { Element, Link as LinkScroll } from "react-scroll";
import Button from "@/components/ui/custom/button";
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

const features = [
  {
    title: 'Invoice Management',
    description: 'Create, manage, and track professional invoices. Print or download as PDF with a single click.',
    image: '/images/invoice-feature.jpg',
    alt: 'Invoice management interface'
  },
  {
    title: 'Weight Ticket Generation',
    description: 'Generate accurate weight tickets with real-time scale integration. Perfect for manufacturing and logistics.',
    image: '/images/weight-feature.png',
    alt: 'Weight ticket system'
  },
  {
    title: 'Customer Management',
    description: 'Keep track of all your customers and their transactions in one place. Send automated follow up payment reminders and more.',
    image: '/images/customer-features.png',
    alt: 'Customer management dashboard'
  },
  {
    title: 'Productivity Assessment',
    description: 'Monitor workforce efficiency with AI-powered video surveillance that analyzes movement patterns and identifies productivity bottlenecks in real-time.',
    image: '/images/productivity-feature.png',
    alt: 'AI Video Surveillance Productivity Assessment'
  },
  {
    title: 'Automated Production Line',
    description: 'Streamline your manufacturing with intelligent automation that optimizes workflow, reduces errors, and increases throughput.',
    image: '/images/comingsoon.jpg',
    alt: 'Automated Production Line - Image Coming Soon'
  }

]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3
    }
  }
}

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  }
  

const Features = () => {
  return (
    <section className="relative pt-20 pb-20 max-lg:pt-20 max-lg:pb-20 max-md:pt-20 max-md:pb-20">
      <Element name="feature">
      <div className="container">
        {/* Features Section */}
        <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="py-16 bg-none"
            >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-200">Powerful Features for Your Business</h2>
                <p className="mt-4 text-lg text-gray-400">
                Everything you need to manage your industrial operations efficiently
                </p>
            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {features.map((feature, index) => (
                    <motion.div
                    key={feature.title}
                    variants={itemVariants}
                    className="relative border-2 border-s4/25 bg-s4/20 p-4 backdrop-blur-[6px] rounded-lg shadow-md"
                    >
                      
            
                    <div className="h-48 mb-6 relative rounded-lg overflow-hidden">
                    <Image
                        src={feature.image}
                        alt={feature.alt}
                        fill
                        className="object-cover"
                        />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-100">{feature.title}</h3>
                    <p className="mt-2 text-gray-300">{feature.description}</p>
                </motion.div>
                ))}
            </div>
            </div>
        </motion.div>
        </div>
      </Element>
    </section>
  );
};

export default Features;