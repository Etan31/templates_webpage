// Grooming packages. Featured tier is highlighted with a ribbon.
export const packages = [
  {
    name: 'Classic',
    price: 39,
    duration: '≈ 45 minutes',
    featured: false,
    items: [
      { label: 'Signature Haircut', included: true },
      { label: 'Consultation & Wash', included: true },
      { label: 'Hot Towel Finish', included: true },
      { label: 'Beard Trim', included: false },
      { label: 'Scalp Treatment', included: false },
    ],
  },
  {
    name: 'Gentleman',
    price: 69,
    duration: '≈ 75 minutes',
    featured: true,
    ribbon: 'Most Popular',
    items: [
      { label: 'Signature Haircut', included: true },
      { label: 'Beard Sculpting', included: true },
      { label: 'Hot Towel Shave', included: true },
      { label: 'Styling & Product', included: true },
      { label: 'Scalp Treatment', included: false },
    ],
  },
  {
    name: 'Executive',
    price: 99,
    duration: '≈ 110 minutes',
    featured: false,
    items: [
      { label: 'Signature Haircut', included: true },
      { label: 'Beard Sculpting', included: true },
      { label: 'Hot Towel Shave', included: true },
      { label: 'Scalp Treatment', included: true },
      { label: 'Premium Grooming Care', included: true },
    ],
  },
]
