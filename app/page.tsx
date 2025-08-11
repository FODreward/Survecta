"use client" // Make this a client component

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, Twitter, Facebook, Instagram } from "lucide-react"
import { useState, useRef, useEffect } from "react"

export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false)
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isMobileMenuOpen])

  return (
    <>
      {/* Header */}
      <header className="bg-white shadow-sm py-4">
        <nav className="container mx-auto flex justify-between items-center px-4">
          <Link href="#" className="text-2xl font-bold text-primary-600">
            Reward System
          </Link>
          <ul className="hidden md:flex space-x-6">
            <li>
              <Link href="#features" className="text-gray-600 hover:text-primary-600 transition-colors">
                Features
              </Link>
            </li>
            <li>
              <Link href="#how-it-works" className="text-gray-600 hover:text-primary-600 transition-colors">
                How It Works
              </Link>
            </li>
            <li>
              <Link href="#testimonials" className="text-gray-600 hover:text-primary-600 transition-colors">
                Testimonials
              </Link>
            </li>
            <li>
              <Link href="/contact-us" className="text-gray-600 hover:text-primary-600 transition-colors">
                Contact Us
              </Link>
            </li>
          </ul>
          <div className="space-x-4 hidden md:block">
            <Link href="/login" className="btn btn-secondary">
              Login
            </Link>
            <Link href="/signup" className="btn btn-primary">
              Sign Up
            </Link>
          </div>
          {/* Mobile menu button (hidden on desktop) */}
          <Button
            ref={buttonRef}
            variant="ghost"
            size="icon"
            className="md:hidden text-gray-600 hover:text-primary-600 focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobileMenu"
          >
            <Menu className="w-6 h-6" />
            <span className="sr-only">Toggle Mobile Menu</span>
          </Button>
        </nav>
        {/* Mobile menu (hidden by default, will be handled by JS/React state later) */}
        <div
          ref={menuRef}
          id="mobileMenu"
          className={`md:hidden bg-white py-2 px-4 border-t border-gray-200 transform transition-all duration-300 ease-in-out origin-top ${
            isMobileMenuOpen ? "scale-y-100 opacity-100 data-[state=open]" : "scale-y-95 opacity-0 hidden"
          }`}
          data-state={isMobileMenuOpen ? "open" : "closed"}
        >
          <ul className="flex flex-col space-y-2">
            <li>
              <Link
                href="#features"
                className="block py-2 text-gray-600 hover:text-primary-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Features
              </Link>
            </li>
            <li>
              <Link
                href="#how-it-works"
                className="block py-2 text-gray-600 hover:text-primary-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                How It Works
              </Link>
            </li>
            <li>
              <Link
                href="#testimonials"
                className="block py-2 text-gray-600 hover:text-primary-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Testimonials
              </Link>
            </li>
            <li>
              <Link
                href="/contact-us"
                className="block py-2 text-gray-600 hover:text-primary-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="btn btn-secondary w-full mt-2">
                Login
              </Link>
            </li>
            <li>
              <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)} className="btn btn-primary w-full mt-2">
                Sign Up
              </Link>
            </li>
          </ul>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section
          id="hero"
          className="bg-gradient-to-r from-primary-900 to-primary-400 text-white py-20 md:py-32 text-center"
        >
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Unlock Rewards, Earn Points, Live Better.
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto">
              Join our community and start earning points for everyday activities, surveys, and more. Redeem for
              exciting rewards!
            </p>
            <div className="space-x-4 flex flex-col min-[400px]:flex-row justify-center items-center">
              <Button asChild className="btn-light-primary mb-4 min-[400px]:mb-0">
                <Link href="/signup">Get Started Today</Link>
              </Button>
              {/* Changed this from Button asChild to direct Link with button classes */}
              <Link href="/login" className="btn btn-light-secondary bg-transparent">
                Login
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12">Why Choose Our Reward System?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="feature-card">
                <Image
                  src="/placeholder.svg?height=64&width=64"
                  alt="Earn Points Icon"
                  className="mx-auto mb-4"
                  width={64}
                  height={64}
                />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Effortless Earning</h3>
                <p className="text-gray-600">
                  Complete surveys, engage with content, and participate in activities to quickly accumulate points.
                </p>
              </div>
              <div className="feature-card">
                <Image
                  src="/placeholder.svg?height=64&width=64"
                  alt="Redeem Rewards Icon"
                  className="mx-auto mb-4"
                  width={64}
                  height={64}
                />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Exciting Rewards</h3>
                <p className="text-gray-600">
                  Redeem your hard-earned points for Bitcoin, gift cards, or other valuable incentives.
                </p>
              </div>
              <div className="feature-card">
                <Image
                  src="/placeholder.svg?height=64&width=64"
                  alt="Community Icon"
                  className="mx-auto mb-4"
                  width={64}
                  height={64}
                />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Thriving Community</h3>
                <p className="text-gray-600">Connect with other users, share tips, and grow your rewards together.</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-16 md:py-24 bg-gray-100">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12">Simple Steps to Start Earning</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="step-card">
                <div className="step-number">1</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Sign Up</h3>
                <p className="text-gray-600">Create your free account in minutes. It's quick and easy!</p>
              </div>
              <div className="step-card">
                <div className="step-number">2</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Earn Points</h3>
                <p className="text-gray-600">
                  Participate in surveys, daily tasks, and special offers to accumulate points.
                </p>
              </div>
              <div className="step-card">
                <div className="step-number">3</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Redeem Rewards</h3>
                <p className="text-gray-600">
                  Exchange your points for Bitcoin, gift cards, or other exciting rewards.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12">What Our Users Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="testimonial-card">
                <p className="text-lg italic text-gray-700 mb-4">
                  &quot;This reward system is fantastic! I&apos;ve earned so many points just by doing simple tasks, and
                  redeeming them for gift cards is a breeze. Highly recommend!&quot;
                </p>
                <div className="flex items-center justify-center">
                  <Image
                    src="/placeholder.svg?height=48&width=48"
                    alt="User Avatar"
                    className="w-12 h-12 rounded-full mr-4"
                    width={48}
                    height={48}
                  />
                  <div>
                    <p className="font-semibold text-gray-800">Jane Doe</p>
                    <p className="text-sm text-gray-600">Active User</p>
                  </div>
                </div>
              </div>
              <div className="testimonial-card">
                <p className="text-lg italic text-gray-700 mb-4">
                  &quot;I was skeptical at first, but the points add up quickly, and the Bitcoin redemption option is a
                  game-changer. It&apos;s a legitimate way to earn extra value.&quot;
                </p>
                <div className="flex items-center justify-center">
                  <Image
                    src="/placeholder.svg?height=48&width=48"
                    alt="User Avatar"
                    className="w-12 h-12 rounded-full mr-4"
                    width={48}
                    height={48}
                  />
                  <div>
                    <p className="font-semibold text-gray-800">John Smith</p>
                    <p className="text-sm text-gray-600">Crypto Enthusiast</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section id="cta" className="bg-primary-600 text-white py-16 md:py-24 text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Earning?</h2>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied users who are already benefiting from our rewarding platform.
            </p>
            <Button asChild className="btn-light-primary">
              <Link href="/signup">Sign Up Now</Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-10">
        <div className="container mx-auto px-4 text-center md:text-left grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Reward System</h3>
            <p className="text-sm">Your ultimate platform for earning points and redeeming exciting rewards.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#features" className="hover:text-primary-400 transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#how-it-works" className="hover:text-primary-400 transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="#testimonials" className="hover:text-primary-400 transition-colors">
                  Testimonials
                </Link>
              </li>
              <li>
                <Link href="/about-us" className="hover:text-primary-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" className="hover:text-primary-400 transition-colors">
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-primary-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Connect With Us</h3>
            <div className="flex justify-center md:justify-start space-x-4">
              <Link href="#" className="text-gray-300 hover:text-emerald-400 transition-colors" aria-label="Twitter">
                <Twitter className="w-6 h-6" />
              </Link>
              <Link href="#" className="text-gray-300 hover:text-emerald-400 transition-colors" aria-label="Facebook">
                <Facebook className="w-6 h-6" />
              </Link>
              <Link href="#" className="text-gray-300 hover:text-emerald-400 transition-colors" aria-label="Instagram">
                <Instagram className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-gray-400">
          &copy; {"2025 Reward System. All rights reserved."}
        </div>
      </footer>
    </>
  )
}
