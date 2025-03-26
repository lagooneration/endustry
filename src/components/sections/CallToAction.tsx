
import { Element, Link as LinkScroll } from "react-scroll";
import Button from "@/components/ui/custom/button";
import { motion } from "framer-motion";
import Link from "next/link";


const CallToAction = () => {
  return (
    <section className="relative pt-60 pb-40 max-lg:pt-52 max-lg:pb-36 max-md:pt-36 max-md:pb-32">
      <Element name="calltoaction">
      <div className="container">
        {/* Call to Action */}
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-none py-16"
            >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white">Ready to Transform Your Business?</h2>
            <p className="mt-4 text-xl text-indigo-100">
                Get custom made manufacturing facility services and more.
            </p>
            <div className="mt-8">
                <Link
                href="/auth/login"
                >
                <Button icon="/images/logos/wa.png">
                Start Now
                </Button>
                </Link>
            </div>
            </div>
        </motion.div>
        </div>
      </Element>
    </section>
  );
};

export default CallToAction;