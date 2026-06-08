import Link from 'next/link'
import { Flower2, Instagram, Facebook, Twitter, Mail, MapPin, Phone } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-rose-400 flex items-center justify-center">
                <Flower2 className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-serif text-lg font-medium text-white">Bloom</span>
                <span className="font-script text-xs text-rose-400">& Blossom</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-stone-400">
              Handcrafted bouquets for life's most beautiful moments. Every arrangement is a love story waiting to be told.
            </p>
            
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-white font-serif text-lg mb-6">Shop</h4>
            <ul className="space-y-3">
              {['All Bouquets', 'Wedding', 'Anniversary', 'Birthday', "Mother's Day", "Valentine's Day"].map((item) => (
                <li key={item}>
                  <Link href="/shop" className="text-sm text-stone-400 hover:text-rose-400 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-serif text-lg mb-6">Company</h4>
            <ul className="space-y-3">
              {[
                { label: 'About Us', href: '#' },
                { label: 'Our Story', href: '#' },
                { label: 'Sustainability', href: '#' },
                { label: 'Press', href: '#' },
                { label: 'Careers', href: '#' },
                { label: 'Contact', href: '#' },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm text-stone-400 hover:text-rose-400 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-serif text-lg mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex gap-3 text-sm text-stone-400">
                <MapPin className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <span>Bloemenstraat 12</span>
              </li>
              <li className="flex gap-3 text-sm text-stone-400">
                <Phone className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>+216 20 888 549</span>
              </li>
              <li className="flex gap-3 text-sm text-stone-400">
                <Mail className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>may.amor@bloomblossom.com</span>
              </li>
            </ul>
            <div className="mt-6 p-4 bg-stone-800 rounded-2xl">
              <p className="text-xs text-stone-400 mb-1">Free delivery on orders over</p>
              <p className="text-xl font-serif text-white">€75</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-stone-500">
            © 2026 Bloom & Blossom. All rights reserved. Made with 🌸 .
          </p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
              <Link key={item} href="#" className="text-xs text-stone-500 hover:text-rose-400 transition-colors">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
