import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌸 Seeding Bloom & Blossom database...')

  // --- Categories ---
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'wedding' },
      update: {},
      create: {
        name: 'Wedding',
        slug: 'wedding',
        description: 'Exquisite floral arrangements for your perfect wedding day',
        image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'birthday' },
      update: {},
      create: {
        name: 'Birthday',
        slug: 'birthday',
        description: 'Vibrant and joyful bouquets to celebrate life',
        image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=600',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'anniversary' },
      update: {},
      create: {
        name: 'Anniversary',
        slug: 'anniversary',
        description: 'Romantic arrangements to celebrate your love story',
        image: 'https://images.unsplash.com/photo-1548094990-c16ca90f1f0d?w=600',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'mothers-day' },
      update: {},
      create: {
        name: "Mother's Day",
        slug: 'mothers-day',
        description: 'Show your love with our beautiful Mother\'s Day collections',
        image: 'https://images.unsplash.com/photo-1490750967868-88df5691cc12?w=600',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'valentines-day' },
      update: {},
      create: {
        name: "Valentine's Day",
        slug: 'valentines-day',
        description: 'Express your deepest love with our Valentine\'s collections',
        image: 'https://images.unsplash.com/photo-1518895312237-a9e23508077d?w=600',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'sympathy' },
      update: {},
      create: {
        name: 'Sympathy',
        slug: 'sympathy',
        description: 'Thoughtful arrangements for moments of comfort',
        image: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=600',
      },
    }),
  ])

  const [wedding, birthday, anniversary, mothersDay, valentines, sympathy] = categories

  // --- Admin User ---
  const adminPassword = await bcrypt.hash('Admin123!', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@bloomblossom.com' },
    update: {},
    create: {
      email: 'admin@bloomblossom.com',
      name: 'Admin',
      password: adminPassword,
      role: Role.ADMIN,
    },
  })

  // --- Demo User ---
  const userPassword = await bcrypt.hash('User123!', 12)
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@bloomblossom.com' },
    update: {},
    create: {
      email: 'demo@bloomblossom.com',
      name: 'Sophie Laurent',
      password: userPassword,
      role: Role.USER,
      phone: '+31 6 12345678',
    },
  })

  // --- Flowers ---
  const flowersData = [
    {
      name: 'Eternal Rose Bouquet',
      slug: 'eternal-rose-bouquet',
      description: 'A breathtaking arrangement of 24 long-stem red roses, symbolizing eternal love and devotion. Each rose is hand-selected for perfect bloom and wrapped in premium silk ribbon with a touch of baby\'s breath.',
      price: 89.99,
      comparePrice: 119.99,
      stock: 25,
      categoryId: valentines.id,
      featured: true,
      bestseller: true,
      isNew: false,
      occasion: ['Valentine\'s Day', 'Anniversary', 'Romance'],
      colors: ['Red', 'White'],
      tags: ['roses', 'romantic', 'luxury', 'bestseller'],
      images: [
        { url: 'https://images.unsplash.com/photo-1548094990-c16ca90f1f0d?w=800', alt: 'Eternal Rose Bouquet', isPrimary: true },
        { url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800', alt: 'Rose detail', isPrimary: false },
      ],
    },
    {
      name: 'Blush Peony Dreams',
      slug: 'blush-peony-dreams',
      description: 'Soft blush peonies cascading beautifully with garden roses and eucalyptus. This romantic arrangement evokes the feeling of a sun-drenched garden in full bloom, perfect for celebrating love milestones.',
      price: 74.99,
      comparePrice: null,
      stock: 18,
      categoryId: anniversary.id,
      featured: true,
      bestseller: false,
      isNew: true,
      occasion: ['Anniversary', 'Wedding', 'Romance'],
      colors: ['Pink', 'Blush', 'Green'],
      tags: ['peonies', 'romantic', 'garden'],
      images: [
        { url: 'https://images.unsplash.com/photo-1490750967868-88df5691cc12?w=800', alt: 'Blush Peony Dreams', isPrimary: true },
      ],
    },
    {
      name: 'Lavender Whisper',
      slug: 'lavender-whisper',
      description: 'A calming and elegant arrangement featuring French lavender, white ranunculus, and silver dusty miller. This arrangement brings tranquility and a touch of Provence to any space.',
      price: 59.99,
      comparePrice: null,
      stock: 30,
      categoryId: mothersDay.id,
      featured: false,
      bestseller: false,
      isNew: true,
      occasion: ['Mother\'s Day', 'Birthday', 'Thank You'],
      colors: ['Lavender', 'Purple', 'White'],
      tags: ['lavender', 'calming', 'elegant'],
      images: [
        { url: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=800', alt: 'Lavender Whisper', isPrimary: true },
      ],
    },
    {
      name: 'Sunshine Garden Burst',
      slug: 'sunshine-garden-burst',
      description: 'A vibrant explosion of sunflowers, yellow tulips, and gerbera daisies that brings pure joy and warmth. Perfect for birthdays and celebrations that call for cheerful, bright energy.',
      price: 49.99,
      comparePrice: 64.99,
      stock: 40,
      categoryId: birthday.id,
      featured: true,
      bestseller: true,
      isNew: false,
      occasion: ['Birthday', 'Celebration', 'Thank You'],
      colors: ['Yellow', 'Orange', 'Gold'],
      tags: ['sunflowers', 'cheerful', 'vibrant', 'birthday'],
      images: [
        { url: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=800', alt: 'Sunshine Garden Burst', isPrimary: true },
      ],
    },
    {
      name: 'White Wedding Cascade',
      slug: 'white-wedding-cascade',
      description: 'An exquisite cascading bridal bouquet featuring ivory garden roses, white orchids, and delicate stephanotis. Each bloom represents purity and new beginnings, making it the perfect companion for your walk down the aisle.',
      price: 149.99,
      comparePrice: 199.99,
      stock: 15,
      categoryId: wedding.id,
      featured: true,
      bestseller: false,
      isNew: false,
      occasion: ['Wedding', 'Bridal'],
      colors: ['White', 'Ivory', 'Cream'],
      tags: ['wedding', 'bridal', 'luxury', 'orchids'],
      images: [
        { url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800', alt: 'White Wedding Cascade', isPrimary: true },
      ],
    },
    {
      name: 'Midnight Velvet Roses',
      slug: 'midnight-velvet-roses',
      description: 'Deep burgundy and dark purple roses arranged with black calla lilies and dark foliage. This dramatic, sophisticated bouquet makes a powerful statement of deep, passionate love.',
      price: 95.99,
      comparePrice: null,
      stock: 12,
      categoryId: valentines.id,
      featured: false,
      bestseller: false,
      isNew: true,
      occasion: ['Valentine\'s Day', 'Anniversary', 'Romance'],
      colors: ['Burgundy', 'Purple', 'Black'],
      tags: ['roses', 'dramatic', 'luxury', 'dark'],
      images: [
        { url: 'https://images.unsplash.com/photo-1518895312237-a9e23508077d?w=800', alt: 'Midnight Velvet Roses', isPrimary: true },
      ],
    },
    {
      name: 'Spring Cherry Blossom',
      slug: 'spring-cherry-blossom',
      description: 'Delicate cherry blossom branches artfully arranged with pink sweet peas and white ranunculus. This arrangement captures the fleeting beauty of spring, a reminder to cherish every precious moment.',
      price: 65.99,
      comparePrice: null,
      stock: 20,
      categoryId: birthday.id,
      featured: false,
      bestseller: true,
      isNew: false,
      occasion: ['Birthday', 'Mother\'s Day', 'Spring'],
      colors: ['Pink', 'White', 'Blush'],
      tags: ['cherry blossom', 'spring', 'delicate'],
      images: [
        { url: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800', alt: 'Spring Cherry Blossom', isPrimary: true },
      ],
    },
    {
      name: 'Golden Anniversary',
      slug: 'golden-anniversary',
      description: 'A luxurious arrangement of golden yellow roses, amber chrysanthemums, and warm-toned dahlias. Adorned with gold-dipped accents and premium packaging, this bouquet celebrates 50 years of beautiful love.',
      price: 129.99,
      comparePrice: 159.99,
      stock: 8,
      categoryId: anniversary.id,
      featured: false,
      bestseller: false,
      isNew: false,
      occasion: ['Anniversary', 'Celebration'],
      colors: ['Gold', 'Yellow', 'Amber'],
      tags: ['anniversary', 'golden', 'luxury', 'dahlias'],
      images: [
        { url: 'https://images.unsplash.com/photo-1548094990-c16ca90f1f0d?w=800', alt: 'Golden Anniversary', isPrimary: true },
      ],
    },
    {
      name: 'Garden Rose Medley',
      slug: 'garden-rose-medley',
      description: 'A stunning mix of garden roses in shades of peach, coral, and soft apricot with lush greenery. This loose, romantic arrangement brings the charm of a cottage garden into your home.',
      price: 69.99,
      comparePrice: null,
      stock: 35,
      categoryId: mothersDay.id,
      featured: true,
      bestseller: true,
      isNew: false,
      occasion: ['Mother\'s Day', 'Birthday', 'Just Because'],
      colors: ['Peach', 'Coral', 'Apricot'],
      tags: ['garden roses', 'romantic', 'cottage', 'bestseller'],
      images: [
        { url: 'https://images.unsplash.com/photo-1490750967868-88df5691cc12?w=800', alt: 'Garden Rose Medley', isPrimary: true },
      ],
    },
    {
      name: 'Tropical Paradise',
      slug: 'tropical-paradise',
      description: 'An exotic arrangement of bird of paradise, tropical leaves, anthurium, and orchids that transports you to a lush tropical paradise. Bold, vibrant, and utterly unforgettable.',
      price: 99.99,
      comparePrice: null,
      stock: 10,
      categoryId: birthday.id,
      featured: false,
      bestseller: false,
      isNew: true,
      occasion: ['Birthday', 'Celebration', 'Summer'],
      colors: ['Orange', 'Red', 'Yellow', 'Green'],
      tags: ['tropical', 'exotic', 'bold', 'orchids'],
      images: [
        { url: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=800', alt: 'Tropical Paradise', isPrimary: true },
      ],
    },
    {
      name: 'Soft Sympathy Wreath',
      slug: 'soft-sympathy-wreath',
      description: 'A gentle and dignified arrangement of white lilies, soft blue hydrangeas, and green foliage. This thoughtful bouquet offers comfort and peace during difficult times with understated elegance.',
      price: 79.99,
      comparePrice: null,
      stock: 20,
      categoryId: sympathy.id,
      featured: false,
      bestseller: false,
      isNew: false,
      occasion: ['Sympathy', 'Funeral', 'Comfort'],
      colors: ['White', 'Blue', 'Green'],
      tags: ['sympathy', 'lilies', 'peaceful', 'white'],
      images: [
        { url: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=800', alt: 'Soft Sympathy Wreath', isPrimary: true },
      ],
    },
    {
      name: 'Wildflower Meadow',
      slug: 'wildflower-meadow',
      description: 'A charming hand-tied bouquet of mixed wildflowers including cosmos, cornflowers, poppies, and sweet williams. Rustic, free-spirited, and full of personality — like picking flowers from a summer meadow.',
      price: 44.99,
      comparePrice: null,
      stock: 45,
      categoryId: birthday.id,
      featured: false,
      bestseller: true,
      isNew: false,
      occasion: ['Birthday', 'Just Because', 'Thank You'],
      colors: ['Mixed', 'Blue', 'Pink', 'White'],
      tags: ['wildflowers', 'rustic', 'meadow', 'charming'],
      images: [
        { url: 'https://images.unsplash.com/photo-1518895312237-a9e23508077d?w=800', alt: 'Wildflower Meadow', isPrimary: true },
      ],
    },
    {
      name: 'Bridal Party Harmony',
      slug: 'bridal-party-harmony',
      description: 'Coordinated bridesmaid bouquets featuring blush roses, dusty miller, and eucalyptus. Available as a set of four, these arrangements create a cohesive and elegant look for your entire bridal party.',
      price: 199.99,
      comparePrice: 249.99,
      stock: 10,
      categoryId: wedding.id,
      featured: false,
      bestseller: false,
      isNew: false,
      occasion: ['Wedding', 'Bridal'],
      colors: ['Blush', 'Pink', 'Green'],
      tags: ['wedding', 'bridesmaid', 'set', 'luxury'],
      images: [
        { url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800', alt: 'Bridal Party Harmony', isPrimary: true },
      ],
    },
    {
      name: 'Sweet Sixteen Surprise',
      slug: 'sweet-sixteen-surprise',
      description: 'A playful and vibrant arrangement of hot pink gerberas, purple lisianthus, and mint green button mums. Fun, youthful, and full of energy — the perfect gift for a milestone birthday.',
      price: 54.99,
      comparePrice: null,
      stock: 28,
      categoryId: birthday.id,
      featured: false,
      bestseller: false,
      isNew: true,
      occasion: ['Birthday', 'Sweet 16', 'Celebration'],
      colors: ['Pink', 'Purple', 'Green'],
      tags: ['birthday', 'youthful', 'vibrant', 'gerberas'],
      images: [
        { url: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800', alt: 'Sweet Sixteen Surprise', isPrimary: true },
      ],
    },
    {
      name: 'Mum\'s Favourite',
      slug: 'mums-favourite',
      description: 'A warm and heartfelt arrangement of pink and cream peonies, soft roses, and wisteria. Designed with mothers in mind, this bouquet says everything words sometimes cannot.',
      price: 69.99,
      comparePrice: 89.99,
      stock: 32,
      categoryId: mothersDay.id,
      featured: true,
      bestseller: true,
      isNew: false,
      occasion: ['Mother\'s Day', 'Birthday', 'Appreciation'],
      colors: ['Pink', 'Cream', 'Lavender'],
      tags: ['mothers day', 'peonies', 'warm', 'heartfelt'],
      images: [
        { url: 'https://images.unsplash.com/photo-1490750967868-88df5691cc12?w=800', alt: 'Mum\'s Favourite', isPrimary: true },
      ],
    },
    {
      name: 'Scarlet Passion',
      slug: 'scarlet-passion',
      description: 'Bold red tulips and scarlet anemones arranged with dark foliage create a passionate and dramatic statement. This arrangement burns with intensity and desire — love at its most vivid.',
      price: 64.99,
      comparePrice: null,
      stock: 22,
      categoryId: valentines.id,
      featured: false,
      bestseller: false,
      isNew: false,
      occasion: ['Valentine\'s Day', 'Anniversary', 'Romance'],
      colors: ['Red', 'Scarlet', 'Dark'],
      tags: ['tulips', 'passionate', 'dramatic', 'red'],
      images: [
        { url: 'https://images.unsplash.com/photo-1548094990-c16ca90f1f0d?w=800', alt: 'Scarlet Passion', isPrimary: true },
      ],
    },
    {
      name: 'Eucalyptus & White',
      slug: 'eucalyptus-and-white',
      description: 'A minimalist yet breathtaking arrangement of white spray roses, lisianthus, and abundant eucalyptus. Clean, fresh, and modern — this arrangement suits contemporary interiors and makes a sophisticated gift.',
      price: 57.99,
      comparePrice: null,
      stock: 38,
      categoryId: anniversary.id,
      featured: false,
      bestseller: false,
      isNew: false,
      occasion: ['Anniversary', 'Housewarming', 'Just Because'],
      colors: ['White', 'Green'],
      tags: ['eucalyptus', 'minimalist', 'modern', 'white'],
      images: [
        { url: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=800', alt: 'Eucalyptus & White', isPrimary: true },
      ],
    },
    {
      name: 'Pink Princess',
      slug: 'pink-princess',
      description: 'A dreamy cascade of pink and blush roses, fluffy pink carnations, and pink gypsophila. Whimsical, feminine, and utterly enchanting — the bouquet every little girl and grown woman deserves.',
      price: 52.99,
      comparePrice: 67.99,
      stock: 42,
      categoryId: birthday.id,
      featured: false,
      bestseller: true,
      isNew: false,
      occasion: ['Birthday', 'Celebration', 'Girls'],
      colors: ['Pink', 'Blush', 'Light Pink'],
      tags: ['pink', 'feminine', 'dreamy', 'roses'],
      images: [
        { url: 'https://images.unsplash.com/photo-1518895312237-a9e23508077d?w=800', alt: 'Pink Princess', isPrimary: true },
      ],
    },
    {
      name: 'Autumn Harvest',
      slug: 'autumn-harvest',
      description: 'Rich dahlias, burnt orange roses, and deep burgundy chrysanthemums arranged with dried cotton and wheat. A celebration of the season\'s abundance, warmth, and earthy beauty.',
      price: 72.99,
      comparePrice: null,
      stock: 18,
      categoryId: birthday.id,
      featured: false,
      bestseller: false,
      isNew: false,
      occasion: ['Birthday', 'Thanksgiving', 'Autumn'],
      colors: ['Orange', 'Burgundy', 'Rust', 'Gold'],
      tags: ['autumn', 'dahlias', 'harvest', 'seasonal'],
      images: [
        { url: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=800', alt: 'Autumn Harvest', isPrimary: true },
      ],
    },
    {
      name: 'Celestial Blue Iris',
      slug: 'celestial-blue-iris',
      description: 'An ethereal arrangement of blue irises, white freesias, and delicate blue delphiniums. This arrangement evokes the vastness of a clear sky and the wonder of starlit nights — truly celestial.',
      price: 62.99,
      comparePrice: null,
      stock: 16,
      categoryId: mothersDay.id,
      featured: false,
      bestseller: false,
      isNew: true,
      occasion: ['Mother\'s Day', 'Birthday', 'Just Because'],
      colors: ['Blue', 'Purple', 'White'],
      tags: ['iris', 'blue', 'ethereal', 'celestial'],
      images: [
        { url: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800', alt: 'Celestial Blue Iris', isPrimary: true },
      ],
    },
  ]

  for (const flowerData of flowersData) {
    const { images, ...data } = flowerData
    const flower = await prisma.flower.upsert({
      where: { slug: data.slug },
      update: {},
      create: {
        ...data,
        price: data.price,
        comparePrice: data.comparePrice ?? undefined,
      },
    })

    // Delete existing images and recreate
    await prisma.productImage.deleteMany({ where: { flowerId: flower.id } })
    for (let i = 0; i < images.length; i++) {
      await prisma.productImage.create({
        data: { ...images[i], flowerId: flower.id, order: i },
      })
    }
  }

  // --- Sample Reviews ---
  const allFlowers = await prisma.flower.findMany({ take: 8 })
  const reviewsData = [
    { rating: 5, title: 'Absolutely breathtaking!', body: 'I ordered these for my anniversary and my partner was in tears of joy. The flowers arrived fresh and beautifully arranged. Will definitely order again!' },
    { rating: 5, title: 'Perfect in every way', body: 'The quality is exceptional. These are not your typical supermarket flowers — every petal was perfect and the fragrance was divine.' },
    { rating: 4, title: 'Stunning arrangement', body: 'Really beautiful and arrived on time. The packaging was premium too. Slight delay in delivery but overall a wonderful experience.' },
    { rating: 5, title: 'Made her day!', body: 'Ordered for my mum\'s birthday. She called me crying happy tears. The flowers lasted over two weeks! Incredibly impressed.' },
    { rating: 5, title: 'Luxury quality', body: 'You can truly feel the premium quality. The arrangement was exactly as shown. Bloom & Blossom has become my go-to for special occasions.' },
    { rating: 4, title: 'Beautiful and fresh', body: 'Very impressed with the freshness and quality. The packaging felt very premium. My girlfriend loved every petal.' },
    { rating: 5, title: 'Wedding perfection', body: 'Used these for our wedding and received so many compliments. The florists at Bloom & Blossom are true artists.' },
    { rating: 5, title: 'Exceeded expectations', body: 'I was skeptical ordering flowers online but these completely changed my mind. The quality and arrangement surpassed any florist I\'ve visited in person.' },
  ]

  for (let i = 0; i < Math.min(allFlowers.length, reviewsData.length); i++) {
    await prisma.review.upsert({
      where: { flowerId_userId: { flowerId: allFlowers[i].id, userId: demoUser.id } },
      update: {},
      create: {
        flowerId: allFlowers[i].id,
        userId: demoUser.id,
        ...reviewsData[i],
        verified: true,
      },
    })
  }

  // --- Sample Order ---
  const flower1 = await prisma.flower.findFirst({ where: { slug: 'eternal-rose-bouquet' } })
  const flower2 = await prisma.flower.findFirst({ where: { slug: 'blush-peony-dreams' } })

  if (flower1 && flower2) {
    const existingOrder = await prisma.order.findFirst({ where: { userId: demoUser.id } })
    if (!existingOrder) {
      await prisma.order.create({
        data: {
          userId: demoUser.id,
          status: 'DELIVERED',
          subtotal: 164.98,
          shipping: 9.99,
          tax: 17.50,
          total: 192.47,
          firstName: 'Sophie',
          lastName: 'Laurent',
          email: 'demo@bloomblossom.com',
          phone: '+31 6 12345678',
          address: '45 Bloemenstraat',
          city: 'Amsterdam',
          country: 'Netherlands',
          postalCode: '1012 AB',
          trackingNumber: 'BB-2024-001234',
          estimatedDelivery: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          items: {
            create: [
              {
                flowerId: flower1.id,
                quantity: 1,
                price: flower1.price,
                name: flower1.name,
                image: 'https://images.unsplash.com/photo-1548094990-c16ca90f1f0d?w=400',
              },
              {
                flowerId: flower2.id,
                quantity: 1,
                price: flower2.price,
                name: flower2.name,
                image: 'https://images.unsplash.com/photo-1490750967868-88df5691cc12?w=400',
              },
            ],
          },
        },
      })
    }
  }

  // Newsletter subscribers
  await prisma.newsletterSubscriber.upsert({
    where: { email: 'newsletter@example.com' },
    update: {},
    create: { email: 'newsletter@example.com' },
  })

  console.log('✅ Database seeded successfully!')
  console.log(`
  📧 Admin: admin@bloomblossom.com / Admin123!
  👤 Demo User: demo@bloomblossom.com / User123!
  `)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
