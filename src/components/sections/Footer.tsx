import { Element } from "react-scroll";
import { motion } from "framer-motion";
import Link from "next/link";

const Footer = () => {
  return (
    <motion.footer 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-gray-900 py-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Endustry</h3>
            <p className="text-gray-400">
              Streamlining manufacturing operations with powerful software solutions.
            </p>
          </div>
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-white transition">Home</Link></li>
              <li><Link href="/features" className="text-gray-400 hover:text-white transition">Features</Link></li>
              <li><Link href="/auth/login" className="text-gray-400 hover:text-white transition">Sign In</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Contact</h3>
            <p className="text-gray-400">
              Email: info@endustry.com<br />
            </p>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Endustry. All rights reserved.</p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;