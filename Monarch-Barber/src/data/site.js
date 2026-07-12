// Single source of truth for brand and site-wide content. Drives the rebrand.
export const brand = { name: 'Monarch', sub: 'Barber Shop' }

export const tagline =
  'Classic cuts, modern style, premium experience. Redefining confidence, one cut at a time.'

export const contact = {
  addressLines: ['123 Barber Street', 'New York, NY 10001'],
  phone: '(212) 555-7890',
  phoneHref: 'tel:+12125557890',
  email: 'hello@monarchbarber.com',
  emailHref: 'mailto:hello@monarchbarber.com',
  hours: 'Mon–Sat · 9AM – 8PM',
}

export const navItems = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Packages', to: '/packages' },
  { label: 'Contact', to: '/contact' },
]

export const socials = [
  { label: 'Instagram', icon: 'instagram', href: '#' },
  { label: 'Facebook', icon: 'facebook', href: '#' },
  { label: 'X', icon: 'x', href: '#' },
  { label: 'TikTok', icon: 'tiktok', href: '#' },
]

export const footerLinks = {
  quick: [
    { label: 'Home', to: '/' },
    { label: 'About Us', to: '/about' },
    { label: 'Services', to: '/services' },
    { label: 'Packages', to: '/packages' },
    { label: 'Contact', to: '/contact' },
  ],
  services: [
    'Signature Haircut',
    'Beard Sculpting',
    'Hot Towel Shave',
    'Hair Styling',
    'Grooming Care',
  ],
}
