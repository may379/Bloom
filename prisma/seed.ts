import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌸 Seeding Bloom & Blossom database...')

  // ── Categories ────────────────────────────────────────────────────────────
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'wedding' },
      update: {},
      create: {
        name: 'Wedding',
        slug: 'wedding',
        description: 'Exquisite floral arrangements for your perfect wedding day',
        image: '/images/wedding-category.jpg',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'birthday' },
      update: {},
      create: {
        name: 'Birthday',
        slug: 'birthday',
        description: 'Vibrant and joyful bouquets to celebrate life',
        image: '/images/birthday-category.jpg',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'anniversary' },
      update: {},
      create: {
        name: 'Anniversary',
        slug: 'anniversary',
        description: 'Romantic arrangements to celebrate your love story',
        image: '/images/anniversary-category.jpg',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'mothers-day' },
      update: {},
      create: {
        name: "Mother's Day",
        slug: 'mothers-day',
        description: "Show your love with our beautiful Mother's Day collections",
        image: "/images/mothers-day-category.jpg",
      },
    }),
    prisma.category.upsert({
      where: { slug: 'valentines-day' },
      update: {},
      create: {
        name: "Valentine's Day",
        slug: 'valentines-day',
        description: "Express your deepest love with our Valentine's collections",
        image: "/images/valentines-day-category.jpg",
      },
    }),
    prisma.category.upsert({
      where: { slug: 'sympathy' },
      update: {},
      create: {
        name: 'Sympathy',
        slug: 'sympathy',
        description: 'Thoughtful arrangements for moments of comfort',
        image: '/images/sympathy-category.jpg',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'seasonal' },
      update: {},
      create: {
        name: 'Seasonal',
        slug: 'seasonal',
        description: "Fresh seasonal blooms celebrating nature's finest moments",
        image: '/images/seasonal-category.jpg',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'luxury' },
      update: {},
      create: {
        name: 'Luxury Collection',
        slug: 'luxury',
        description: 'Our most exquisite and premium floral masterpieces',
        image: '/images/luxury-collection.jpg',
      },
    }),
  ])

  const [wedding, birthday, anniversary, mothersDay, valentines, sympathy, seasonal, luxury] = categories

  // ── Users ─────────────────────────────────────────────────────────────────
  // Never provision a predictable administrator account in production.
  // Local demo credentials are intentionally limited to non-production seeding.
  if (process.env.NODE_ENV !== 'production') {
    const adminPassword = await bcrypt.hash('Admin123!', 12)
    await prisma.user.upsert({
      where: { email: 'admin@bloomblossom.com' },
      update: {},
      create: {
        email: 'admin@bloomblossom.com',
        name: 'Admin',
        password: adminPassword,
        role: Role.ADMIN,
      },
    })
  }

  // The sample customer is used to attach seeded reviews and an example order.
  // In production, assign an unpredictable password so public demo credentials
  // cannot be used to sign in to the deployed database.
  const userPassword = await bcrypt.hash(
    process.env.NODE_ENV === 'production'
      ? (await import('crypto')).randomBytes(32).toString('hex')
      : 'User123!',
    12
  )
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@bloomblossom.com' },
    // Rotate the demo account password on every production seed run so a
    // previously seeded public demo password cannot remain valid.
    update: { password: userPassword },
    create: {
      email: 'demo@bloomblossom.com',
      name: 'Sophie Laurent',
      password: userPassword,
      role: Role.USER,
    },
  })

  // Production admin access must be provisioned intentionally. Do not create
  // a public demo admin, and never replace an existing admin password with an
  // undisclosed random value that would lock the owner out.
  if (process.env.NODE_ENV === 'production' && process.env.SEED_ADMIN_PASSWORD) {
    const admin = await prisma.user.findUnique({
      where: { email: 'admin@bloomblossom.com' },
      select: { id: true },
    })
    if (admin) {
      await prisma.user.update({
        where: { id: admin.id },
        data: { password: await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD, 12) },
      })
    } else {
      console.warn('SEED_ADMIN_PASSWORD is set, but no seeded admin exists; create the production admin through a controlled setup process.')
    }
  } else if (process.env.NODE_ENV === 'production') {
    console.warn('Production seed skipped admin provisioning. Configure administrator access through a controlled setup process.')
  }

  // ── Flowers (30 products with multiple images each) ────────────────────────
  const flowersData = [

    // ═══════════════════════════════════════════
    //  ROSES
    // ═══════════════════════════════════════════
    {
      name: 'Eternal Rose Bouquet',
      slug: 'eternal-rose-bouquet',
      description: "A breathtaking arrangement of 24 long-stem red roses, symbolizing eternal love and devotion. Each rose is hand-selected for perfect bloom and wrapped in premium silk ribbon with a touch of baby's breath. The deep crimson petals carry a rich, intoxicating fragrance that fills the room with romance.",
      price: 89.99, comparePrice: 119.99, stock: 25,
      categoryId: valentines.id, featured: true, bestseller: true, isNew: false,
      occasion: ["Valentine's Day", 'Anniversary', 'Romance'],
      colors: ['Red', 'White'],
      tags: ['roses', 'romantic', 'luxury', 'bestseller', 'red roses'],
      images: [
        { url: '/images/eternal-rose-bouquet.jpg', alt: 'Eternal Rose Bouquet', isPrimary: true },
        { url: '/images/rose-detail-close-up.jpg', alt: 'Rose detail close-up', isPrimary: false },
        { url: '/images/bouquet-packaging.jpg', alt: 'Bouquet packaging', isPrimary: false },
      ],
    },
    {
      name: 'Scarlet Passion Roses',
      slug: 'scarlet-passion-roses',
      description: 'Fifty premium scarlet roses arranged in a lavish dome bouquet, creating a breathtaking display of opulence and romance. Each stem is stripped of thorns and carefully hydrated for maximum longevity. A truly unforgettable grand gesture.',
      price: 159.99, comparePrice: 199.99, stock: 10,
      categoryId: luxury.id, featured: true, bestseller: false, isNew: true,
      occasion: ["Valentine's Day", 'Anniversary', 'Proposal'],
      colors: ['Red', 'Scarlet'],
      tags: ['roses', 'luxury', 'grand', '50 roses', 'proposal'],
      images: [
        { url: '/images/scarlet-passion-roses.jpg', alt: 'Scarlet Passion Roses', isPrimary: true },
        { url: '/images/rose-arrangement-detail.jpg', alt: 'Rose arrangement detail', isPrimary: false },
        { url: '/images/luxury-packaging.jpg', alt: 'Luxury packaging', isPrimary: false },
      ],
    },
    {
      name: 'Blush Garden Roses',
      slug: 'blush-garden-roses',
      description: 'Delicate blush and cream garden roses arranged with gypsophila and soft eucalyptus. This romantic bouquet captures the timeless beauty of an English cottage garden in full bloom, evoking warmth, softness, and pure romance.',
      price: 64.99, comparePrice: null, stock: 30,
      categoryId: anniversary.id, featured: false, bestseller: true, isNew: false,
      occasion: ['Anniversary', 'Wedding', 'Birthday'],
      colors: ['Blush', 'Cream', 'Pink'],
      tags: ['garden roses', 'romantic', 'cottage', 'blush'],
      images: [
        { url: '/images/blush-garden-roses.jpg', alt: 'Blush Garden Roses', isPrimary: true },
        { url: '/images/garden-roses-close-up.jpg', alt: 'Garden roses close-up', isPrimary: false },
        { url: '/images/blush-tones-detail.jpg', alt: 'Blush tones detail', isPrimary: false },
      ],
    },
    {
      name: 'Midnight Black Rose',
      slug: 'midnight-black-rose',
      description: 'Dramatically stunning deep burgundy and almost-black roses arranged with dark foliage and black calla lilies. This avant-garde bouquet makes a powerful, mysterious statement — love at its most intense and passionate.',
      price: 99.99, comparePrice: null, stock: 8,
      categoryId: luxury.id, featured: true, bestseller: false, isNew: true,
      occasion: ["Valentine's Day", 'Anniversary', 'Romance'],
      colors: ['Black', 'Burgundy', 'Dark'],
      tags: ['roses', 'dramatic', 'luxury', 'dark', 'unique'],
      images: [
        { url: '/images/midnight-black-rose.jpg', alt: 'Midnight Black Rose', isPrimary: true },
        { url: '/images/dark-rose-detail.jpg', alt: 'Dark rose detail', isPrimary: false },
        { url: '/images/black-rose-arrangement.jpg', alt: 'Black rose arrangement', isPrimary: false },
      ],
    },
    {
      name: 'Rainbow Rose Fantasy',
      slug: 'rainbow-rose-fantasy',
      description: 'A spectacular arrangement featuring roses in every shade — from coral to lavender, hot pink to peach, and everything in between. This joyful, playful bouquet celebrates colour, life, and happiness in its most beautiful form.',
      price: 74.99, comparePrice: 89.99, stock: 20,
      categoryId: birthday.id, featured: false, bestseller: true, isNew: false,
      occasion: ['Birthday', 'Celebration', 'Just Because'],
      colors: ['Mixed', 'Pink', 'Coral', 'Lavender', 'Peach'],
      tags: ['roses', 'colorful', 'rainbow', 'birthday', 'joyful'],
      images: [
        { url: '/images/rainbow-rose-fantasy.jpg', alt: 'Rainbow Rose Fantasy', isPrimary: true },
        { url: '/images/colorful-roses-detail.jpg', alt: 'Colorful roses detail', isPrimary: false },
        { url: '/images/mixed-rose-colors.jpg', alt: 'Mixed rose colors', isPrimary: false },
      ],
    },

    // ═══════════════════════════════════════════
    //  PEONIES
    // ═══════════════════════════════════════════
    {
      name: 'Blush Peony Dreams',
      slug: 'blush-peony-dreams',
      description: 'Soft blush peonies cascading beautifully with garden roses and eucalyptus. This romantic arrangement evokes the feeling of a sun-drenched garden in full bloom. Each peony is a masterpiece of nature — layered, lush, and utterly breathtaking.',
      price: 74.99, comparePrice: null, stock: 18,
      categoryId: anniversary.id, featured: true, bestseller: false, isNew: true,
      occasion: ['Anniversary', 'Wedding', 'Romance'],
      colors: ['Pink', 'Blush', 'Green'],
      tags: ['peonies', 'romantic', 'garden', 'blush'],
      images: [
        { url: '/images/blush-peony-dreams.jpg', alt: 'Blush Peony Dreams', isPrimary: true },
        { url: '/images/peony-close-up.jpg', alt: 'Peony close-up', isPrimary: false },
        { url: '/images/peony-bouquet-detail.jpg', alt: 'Peony bouquet detail', isPrimary: false },
      ],
    },
    {
      name: "Mum's Favourite Peonies",
      slug: 'mums-favourite-peonies',
      description: 'A warm and heartfelt arrangement of pink and cream peonies, soft roses, and wisteria. Designed with mothers in mind, this bouquet captures everything she is — warm, beautiful, strong, and endlessly loving.',
      price: 69.99, comparePrice: 89.99, stock: 32,
      categoryId: mothersDay.id, featured: true, bestseller: true, isNew: false,
      occasion: ["Mother's Day", 'Birthday', 'Appreciation'],
      colors: ['Pink', 'Cream', 'Lavender'],
      tags: ['mothers day', 'peonies', 'warm', 'heartfelt'],
      images: [
        { url: "/images/mums-favourite-peonies.jpg", alt: "Mum's Favourite Peonies", isPrimary: true },
        { url: '/images/pink-peonies-detail.jpg', alt: 'Pink peonies detail', isPrimary: false },
        { url: '/images/peony-arrangement.jpg', alt: 'Peony arrangement', isPrimary: false },
      ],
    },
    {
      name: 'Coral Peony Sunrise',
      slug: 'coral-peony-sunrise',
      description: 'Vibrant coral peonies mixed with apricot ranunculus and golden freesias, evoking the warm glow of a summer sunrise. This uplifting arrangement radiates joy, energy, and optimism — perfect for celebrating new beginnings.',
      price: 79.99, comparePrice: null, stock: 15,
      categoryId: birthday.id, featured: false, bestseller: false, isNew: true,
      occasion: ['Birthday', 'Celebration', 'New Beginnings'],
      colors: ['Coral', 'Orange', 'Apricot', 'Gold'],
      tags: ['peonies', 'coral', 'sunrise', 'vibrant'],
      images: [
        { url: '/images/coral-peony-sunrise.jpg', alt: 'Coral Peony Sunrise', isPrimary: true },
        { url: '/images/coral-tones-detail.jpg', alt: 'Coral tones detail', isPrimary: false },
        { url: '/images/sunrise-arrangement.jpg', alt: 'Sunrise arrangement', isPrimary: false },
      ],
    },

    // ═══════════════════════════════════════════
    //  TULIPS
    // ═══════════════════════════════════════════
    {
      name: 'Dutch Tulip Symphony',
      slug: 'dutch-tulip-symphony',
      description: 'A magnificent arrangement of 30 premium Dutch tulips in a harmonious blend of pink, white, and purple — a true celebration of Dutch floral mastery. Straight, elegant stems and vibrant cup-shaped blooms make this arrangement effortlessly sophisticated.',
      price: 54.99, comparePrice: 69.99, stock: 40,
      categoryId: seasonal.id, featured: true, bestseller: true, isNew: false,
      occasion: ['Birthday', "Mother's Day", 'Spring', 'Just Because'],
      colors: ['Pink', 'White', 'Purple', 'Mixed'],
      tags: ['tulips', 'dutch', 'spring', 'elegant'],
      images: [
        { url: '/images/dutch-tulip-symphony.jpg', alt: 'Dutch Tulip Symphony', isPrimary: true },
        { url: '/images/tulip-close-up.jpg', alt: 'Tulip close-up', isPrimary: false },
        { url: '/images/tulip-arrangement.jpg', alt: 'Tulip arrangement', isPrimary: false },
      ],
    },
    {
      name: 'Scarlet Tulip Passion',
      slug: 'scarlet-tulip-passion',
      description: 'Forty fiery red and orange tulips arranged in a bold, dramatic display of passionate love. These flame-colored beauties burn with intensity — a modern, striking alternative to roses for those who dare to be different.',
      price: 59.99, comparePrice: null, stock: 22,
      categoryId: valentines.id, featured: false, bestseller: false, isNew: true,
      occasion: ["Valentine's Day", 'Anniversary', 'Romance'],
      colors: ['Red', 'Orange', 'Scarlet'],
      tags: ['tulips', 'passionate', 'dramatic', 'red'],
      images: [
        { url: '/images/scarlet-tulip-passion.jpg', alt: 'Scarlet Tulip Passion', isPrimary: true },
        { url: '/images/red-tulip-detail.jpg', alt: 'Red tulip detail', isPrimary: false },
        { url: '/images/tulip-bouquet.jpg', alt: 'Tulip bouquet', isPrimary: false },
      ],
    },
    {
      name: 'Purple Parrot Tulips',
      slug: 'purple-parrot-tulips',
      description: "Exotic parrot tulips in deep purple and violet with their uniquely ruffled, feather-like petals create a truly theatrical arrangement. These rare blooms are nature's most dramatic tulip variety, prized by collectors and flower lovers alike.",
      price: 67.99, comparePrice: null, stock: 12,
      categoryId: luxury.id, featured: false, bestseller: false, isNew: true,
      occasion: ['Birthday', 'Anniversary', 'Just Because'],
      colors: ['Purple', 'Violet', 'Mauve'],
      tags: ['tulips', 'parrot', 'exotic', 'rare', 'purple'],
      images: [
        { url: '/images/purple-parrot-tulips.jpg', alt: 'Purple Parrot Tulips', isPrimary: true },
        { url: '/images/parrot-tulip-detail.jpg', alt: 'Parrot tulip detail', isPrimary: false },
        { url: '/images/exotic-tulip-arrangement.jpg', alt: 'Exotic tulip arrangement', isPrimary: false },
      ],
    },

    // ═══════════════════════════════════════════
    //  ORCHIDS
    // ═══════════════════════════════════════════
    {
      name: 'White Orchid Elegance',
      slug: 'white-orchid-elegance',
      description: 'Cascading white phalaenopsis orchids arranged with tropical leaves and air plants. This architectural floral sculpture embodies pure sophistication and timeless elegance. Orchids symbolize love, luxury, beauty, and strength — a gift that endures.',
      price: 119.99, comparePrice: 149.99, stock: 10,
      categoryId: luxury.id, featured: true, bestseller: false, isNew: false,
      occasion: ['Anniversary', 'Wedding', 'Luxury Gift'],
      colors: ['White', 'Ivory'],
      tags: ['orchids', 'luxury', 'elegant', 'white', 'sophisticated'],
      images: [
        { url: '/images/white-orchid-elegance.jpg', alt: 'White Orchid Elegance', isPrimary: true },
        { url: '/images/orchid-close-up.jpg', alt: 'Orchid close-up', isPrimary: false },
        { url: '/images/orchid-arrangement-detail.jpg', alt: 'Orchid arrangement detail', isPrimary: false },
      ],
    },
    {
      name: 'Pink Orchid Paradise',
      slug: 'pink-orchid-paradise',
      description: 'Soft pink dendrobium orchids cascading with deep purple mokara orchids and tropical greenery. This exotic arrangement transports you to a lush tropical paradise where beauty knows no bounds.',
      price: 109.99, comparePrice: null, stock: 8,
      categoryId: luxury.id, featured: false, bestseller: false, isNew: true,
      occasion: ["Mother's Day", 'Anniversary', 'Luxury Gift'],
      colors: ['Pink', 'Purple', 'Green'],
      tags: ['orchids', 'tropical', 'exotic', 'pink', 'luxury'],
      images: [
        { url: '/images/pink-orchid-paradise.jpg', alt: 'Pink Orchid Paradise', isPrimary: true },
        { url: '/images/pink-orchid-detail.jpg', alt: 'Pink orchid detail', isPrimary: false },
        { url: '/images/orchid-paradise-arrangement.jpg', alt: 'Orchid paradise arrangement', isPrimary: false },
      ],
    },

    // ═══════════════════════════════════════════
    //  SUNFLOWERS
    // ═══════════════════════════════════════════
    {
      name: 'Sunshine Garden Burst',
      slug: 'sunshine-garden-burst',
      description: 'A vibrant explosion of sunflowers, yellow tulips, and gerbera daisies that brings pure joy and warmth. Every petal radiates happiness like rays of sunshine — this bouquet literally brightens any room and lifts any spirit.',
      price: 49.99, comparePrice: 64.99, stock: 40,
      categoryId: birthday.id, featured: true, bestseller: true, isNew: false,
      occasion: ['Birthday', 'Celebration', 'Thank You'],
      colors: ['Yellow', 'Orange', 'Gold'],
      tags: ['sunflowers', 'cheerful', 'vibrant', 'birthday', 'yellow'],
      images: [
        { url: '/images/sunshine-garden-burst.jpg', alt: 'Sunshine Garden Burst', isPrimary: true },
        { url: '/images/sunflower-close-up.jpg', alt: 'Sunflower close-up', isPrimary: false },
        { url: '/images/yellow-bouquet-detail.jpg', alt: 'Yellow bouquet detail', isPrimary: false },
      ],
    },
    {
      name: 'Giant Sunflower Harvest',
      slug: 'giant-sunflower-harvest',
      description: 'Twelve giant sunflowers — each face as wide as your palm — arranged with rustic wheat stalks, dried cotton, and orange dahlias. This bold, dramatic arrangement commands attention and fills any space with warmth and abundance.',
      price: 57.99, comparePrice: null, stock: 25,
      categoryId: seasonal.id, featured: false, bestseller: false, isNew: false,
      occasion: ['Birthday', 'Thanksgiving', 'Autumn', 'Just Because'],
      colors: ['Yellow', 'Gold', 'Orange', 'Brown'],
      tags: ['sunflowers', 'harvest', 'rustic', 'autumn', 'giant'],
      images: [
        { url: '/images/giant-sunflower-harvest.jpg', alt: 'Giant Sunflower Harvest', isPrimary: true },
        { url: '/images/sunflower-harvest-detail.jpg', alt: 'Sunflower harvest detail', isPrimary: false },
        { url: '/images/rustic-sunflower-arrangement.jpg', alt: 'Rustic sunflower arrangement', isPrimary: false },
      ],
    },

    // ═══════════════════════════════════════════
    //  WILDFLOWERS & MEADOW
    // ═══════════════════════════════════════════
    {
      name: 'Wildflower Meadow',
      slug: 'wildflower-meadow',
      description: 'A charming hand-tied bouquet of mixed wildflowers including cosmos, cornflowers, poppies, and sweet williams. Rustic, free-spirited, and full of personality — like picking flowers from a summer meadow at golden hour.',
      price: 44.99, comparePrice: null, stock: 45,
      categoryId: birthday.id, featured: false, bestseller: true, isNew: false,
      occasion: ['Birthday', 'Just Because', 'Thank You'],
      colors: ['Mixed', 'Blue', 'Pink', 'White', 'Purple'],
      tags: ['wildflowers', 'rustic', 'meadow', 'charming', 'natural'],
      images: [
        { url: '/images/wildflower-meadow.jpg', alt: 'Wildflower Meadow', isPrimary: true },
        { url: '/images/wildflower-detail.jpg', alt: 'Wildflower detail', isPrimary: false },
        { url: '/images/meadow-arrangement.jpg', alt: 'Meadow arrangement', isPrimary: false },
      ],
    },
    {
      name: 'Boho Wildflower Wreath',
      slug: 'boho-wildflower-wreath',
      description: 'A beautiful loose arrangement of dried pampas grass, lunaria, lavender, and dried wildflowers. Earthy, bohemian, and timelessly beautiful — this arrangement never wilts and grows more beautiful with age.',
      price: 62.99, comparePrice: null, stock: 20,
      categoryId: seasonal.id, featured: false, bestseller: false, isNew: true,
      occasion: ['Birthday', 'Housewarming', 'Just Because'],
      colors: ['Beige', 'Cream', 'Lavender', 'Natural'],
      tags: ['dried flowers', 'boho', 'pampas', 'lavender', 'rustic'],
      images: [
        { url: '/images/boho-wildflower-wreath.jpg', alt: 'Boho Wildflower Wreath', isPrimary: true },
        { url: '/images/dried-flower-detail.jpg', alt: 'Dried flower detail', isPrimary: false },
        { url: '/images/boho-arrangement.jpg', alt: 'Boho arrangement', isPrimary: false },
      ],
    },

    // ═══════════════════════════════════════════
    //  LAVENDER & HERBS
    // ═══════════════════════════════════════════
    {
      name: 'Lavender Whisper',
      slug: 'lavender-whisper',
      description: 'A calming and elegant arrangement featuring French lavender, white ranunculus, and silver dusty miller. The intoxicating scent of Provence fills the room instantly. This arrangement brings tranquility, calm, and the romantic spirit of southern France.',
      price: 59.99, comparePrice: null, stock: 30,
      categoryId: mothersDay.id, featured: false, bestseller: false, isNew: true,
      occasion: ["Mother's Day", 'Birthday', 'Thank You', 'Relaxation'],
      colors: ['Lavender', 'Purple', 'White', 'Silver'],
      tags: ['lavender', 'calming', 'elegant', 'provence', 'fragrant'],
      images: [
        { url: '/images/lavender-whisper.jpg', alt: 'Lavender Whisper', isPrimary: true },
        { url: '/images/lavender-close-up.jpg', alt: 'Lavender close-up', isPrimary: false },
        { url: '/images/lavender-arrangement.jpg', alt: 'Lavender arrangement', isPrimary: false },
      ],
    },

    // ═══════════════════════════════════════════
    //  WEDDING
    // ═══════════════════════════════════════════
    {
      name: 'White Wedding Cascade',
      slug: 'white-wedding-cascade',
      description: 'An exquisite cascading bridal bouquet featuring ivory garden roses, white orchids, and delicate stephanotis. Each bloom represents purity and new beginnings, making it the perfect companion for your walk down the aisle. Finished with ivory ribbon and pearl-headed pins.',
      price: 149.99, comparePrice: 199.99, stock: 15,
      categoryId: wedding.id, featured: true, bestseller: false, isNew: false,
      occasion: ['Wedding', 'Bridal'],
      colors: ['White', 'Ivory', 'Cream'],
      tags: ['wedding', 'bridal', 'luxury', 'orchids', 'cascade'],
      images: [
        { url: '/images/white-wedding-cascade.jpg', alt: 'White Wedding Cascade', isPrimary: true },
        { url: '/images/bridal-bouquet-detail.jpg', alt: 'Bridal bouquet detail', isPrimary: false },
        { url: '/images/wedding-flowers.jpg', alt: 'Wedding flowers', isPrimary: false },
      ],
    },
    {
      name: 'Romantic Blush Bridal',
      slug: 'romantic-blush-bridal',
      description: 'A dreamy bridal bouquet combining blush garden roses, soft pink peonies, white sweet peas, and delicate gypsophila. Loose and flowing in style, this arrangement captures romance at its most authentic and natural.',
      price: 129.99, comparePrice: null, stock: 12,
      categoryId: wedding.id, featured: false, bestseller: true, isNew: false,
      occasion: ['Wedding', 'Bridal', 'Engagement'],
      colors: ['Blush', 'Pink', 'White'],
      tags: ['wedding', 'bridal', 'romantic', 'blush', 'peonies'],
      images: [
        { url: '/images/romantic-blush-bridal.jpg', alt: 'Romantic Blush Bridal', isPrimary: true },
        { url: '/images/blush-bridal-detail.jpg', alt: 'Blush bridal detail', isPrimary: false },
        { url: '/images/bridal-bouquet.jpg', alt: 'Bridal bouquet', isPrimary: false },
      ],
    },
    {
      name: 'Bridal Party Harmony',
      slug: 'bridal-party-harmony',
      description: 'Coordinated bridesmaid bouquets featuring blush roses, dusty miller, and eucalyptus. Available as a set of four, these arrangements create a cohesive and elegant look for your entire bridal party. Each bouquet is individually wrapped with matching ribbon.',
      price: 199.99, comparePrice: 249.99, stock: 10,
      categoryId: wedding.id, featured: false, bestseller: false, isNew: false,
      occasion: ['Wedding', 'Bridal'],
      colors: ['Blush', 'Pink', 'Green', 'Silver'],
      tags: ['wedding', 'bridesmaid', 'set', 'luxury', 'coordinated'],
      images: [
        { url: '/images/bridal-party-harmony.jpg', alt: 'Bridal Party Harmony', isPrimary: true },
        { url: '/images/bridesmaid-bouquet-detail.jpg', alt: 'Bridesmaid bouquet detail', isPrimary: false },
        { url: '/images/wedding-party-flowers.jpg', alt: 'Wedding party flowers', isPrimary: false },
      ],
    },

    // ═══════════════════════════════════════════
    //  LILIES
    // ═══════════════════════════════════════════
    {
      name: 'Stargazer Lily Drama',
      slug: 'stargazer-lily-drama',
      description: "Bold, fragrant stargazer lilies in deep pink and white arranged with baby's breath and lush greenery. The stargazer's intoxicating perfume fills the entire room the moment it enters. A show-stopping arrangement that demands attention.",
      price: 67.99, comparePrice: 84.99, stock: 18,
      categoryId: birthday.id, featured: false, bestseller: true, isNew: false,
      occasion: ['Birthday', 'Anniversary', 'Celebration'],
      colors: ['Pink', 'White', 'Magenta'],
      tags: ['lilies', 'stargazer', 'fragrant', 'dramatic', 'pink'],
      images: [
        { url: '/images/stargazer-lily-drama.jpg', alt: 'Stargazer Lily Drama', isPrimary: true },
        { url: '/images/stargazer-lily-close-up.jpg', alt: 'Stargazer lily close-up', isPrimary: false },
        { url: '/images/lily-arrangement.jpg', alt: 'Lily arrangement', isPrimary: false },
      ],
    },
    {
      name: 'White Calla Lily Grace',
      slug: 'white-calla-lily-grace',
      description: "Sculptural white calla lilies arranged in a minimalist, architectural style with dark tropical leaves. The calla lily's clean lines and pure white form embody grace, sophistication, and timeless beauty. Modern. Elegant. Unforgettable.",
      price: 84.99, comparePrice: null, stock: 14,
      categoryId: luxury.id, featured: false, bestseller: false, isNew: true,
      occasion: ['Wedding', 'Anniversary', 'Sympathy', 'Luxury Gift'],
      colors: ['White', 'Ivory', 'Green'],
      tags: ['calla lily', 'minimalist', 'architectural', 'elegant', 'white'],
      images: [
        { url: '/images/white-calla-lily-grace.jpg', alt: 'White Calla Lily Grace', isPrimary: true },
        { url: '/images/calla-lily-detail.jpg', alt: 'Calla lily detail', isPrimary: false },
        { url: '/images/minimalist-lily-arrangement.jpg', alt: 'Minimalist lily arrangement', isPrimary: false },
      ],
    },
    {
      name: 'Soft Sympathy Lilies',
      slug: 'soft-sympathy-lilies',
      description: 'A gentle and dignified arrangement of white lilies, soft blue hydrangeas, and green foliage. This thoughtful bouquet offers comfort and peace during difficult times, with understated elegance that speaks the words we struggle to say.',
      price: 79.99, comparePrice: null, stock: 20,
      categoryId: sympathy.id, featured: false, bestseller: false, isNew: false,
      occasion: ['Sympathy', 'Funeral', 'Comfort'],
      colors: ['White', 'Blue', 'Green'],
      tags: ['sympathy', 'lilies', 'peaceful', 'white', 'comfort'],
      images: [
        { url: '/images/soft-sympathy-lilies.jpg', alt: 'Soft Sympathy Lilies', isPrimary: true },
        { url: '/images/white-lily.jpg', alt: 'White lily detail', isPrimary: false },
        { url: '/images/sympathy-arrangement.jpg', alt: 'Sympathy arrangement', isPrimary: false },
      ],
    },

    // ═══════════════════════════════════════════
    //  HYDRANGEAS
    // ═══════════════════════════════════════════
    {
      name: 'Blue Hydrangea Cloud',
      slug: 'blue-hydrangea-cloud',
      description: 'Voluminous French hydrangeas in shades of sky blue, lilac, and white create a dreamy, cloud-like arrangement. These lush blooms fill the room with a soft, romantic presence — like holding a piece of a perfect summer sky.',
      price: 72.99, comparePrice: 89.99, stock: 22,
      categoryId: anniversary.id, featured: false, bestseller: false, isNew: false,
      occasion: ['Anniversary', "Mother's Day", 'Just Because'],
      colors: ['Blue', 'Lilac', 'White', 'Purple'],
      tags: ['hydrangeas', 'cloud', 'voluminous', 'blue', 'dreamy'],
      images: [
        { url: '/images/blue-hydrangea-cloud.jpg', alt: 'Blue Hydrangea Cloud', isPrimary: true },
        { url: '/images/hydrangea-close-up.jpg', alt: 'Hydrangea close-up', isPrimary: false },
        { url: '/images/blue-floral-cloud.jpg', alt: 'Blue floral cloud', isPrimary: false },
      ],
    },
    {
      name: 'Pink Hydrangea Garden',
      slug: 'pink-hydrangea-garden',
      description: 'Oversized pink and blush hydrangea blooms arranged with garden roses and sweet peas. Each hydrangea head contains hundreds of tiny florets creating a lush, full, incredibly romantic display perfect for any celebratory occasion.',
      price: 67.99, comparePrice: null, stock: 28,
      categoryId: mothersDay.id, featured: false, bestseller: true, isNew: false,
      occasion: ["Mother's Day", 'Birthday', 'Anniversary'],
      colors: ['Pink', 'Blush', 'Rose'],
      tags: ['hydrangeas', 'pink', 'lush', 'romantic', 'full'],
      images: [
        { url: '/images/pink-hydrangea-garden.jpg', alt: 'Pink Hydrangea Garden', isPrimary: true },
        { url: '/images/pink-hydrangea-detail.jpg', alt: 'Pink hydrangea detail', isPrimary: false },
        { url: '/images/hydrangea-garden-arrangement.jpg', alt: 'Hydrangea garden arrangement', isPrimary: false },
      ],
    },

    // ═══════════════════════════════════════════
    //  DAHLIAS
    // ═══════════════════════════════════════════
    {
      name: 'Autumn Dahlia Harvest',
      slug: 'autumn-dahlia-harvest',
      description: "Rich café au lait dahlias, burnt orange roses, and deep burgundy chrysanthemums arranged with dried cotton and wheat. A celebration of the season's abundance — warm, earthy, and deeply beautiful like autumn itself.",
      price: 72.99, comparePrice: null, stock: 18,
      categoryId: seasonal.id, featured: false, bestseller: false, isNew: false,
      occasion: ['Birthday', 'Thanksgiving', 'Autumn', 'Housewarming'],
      colors: ['Orange', 'Burgundy', 'Rust', 'Gold', 'Caramel'],
      tags: ['dahlias', 'autumn', 'harvest', 'seasonal', 'warm tones'],
      images: [
        { url: '/images/autumn-dahlia-harvest.jpg', alt: 'Autumn Dahlia Harvest', isPrimary: true },
        { url: '/images/dahlia-close-up.jpg', alt: 'Dahlia close-up', isPrimary: false },
        { url: '/images/autumn-floral-harvest.jpg', alt: 'Autumn floral harvest', isPrimary: false },
      ],
    },
    {
      name: 'Café au Lait Dahlia',
      slug: 'cafe-au-lait-dahlia',
      description: 'The most coveted dahlia variety in the world — café au lait dahlias in their signature blend of creamy caramel, apricot, and peach. These dinner-plate sized blooms are simply breathtaking, each one more beautiful than the last.',
      price: 89.99, comparePrice: 109.99, stock: 10,
      categoryId: luxury.id, featured: true, bestseller: false, isNew: true,
      occasion: ['Anniversary', 'Birthday', 'Luxury Gift'],
      colors: ['Caramel', 'Apricot', 'Peach', 'Cream'],
      tags: ['dahlias', 'cafe au lait', 'luxury', 'coveted', 'rare'],
      images: [
        { url: '/images/cafe-au-lait-dahlia.jpg', alt: 'Café au Lait Dahlia', isPrimary: true },
        { url: '/images/dahlia-detail.jpg', alt: 'Dahlia detail', isPrimary: false },
        { url: '/images/luxury-dahlia-arrangement.jpg', alt: 'Luxury dahlia arrangement', isPrimary: false },
      ],
    },

    // ═══════════════════════════════════════════
    //  SPRING & SEASONAL
    // ═══════════════════════════════════════════
    {
      name: 'Spring Cherry Blossom',
      slug: 'spring-cherry-blossom',
      description: 'Delicate cherry blossom branches artfully arranged with pink sweet peas and white ranunculus. This arrangement captures the fleeting, poignant beauty of spring — a reminder to cherish every precious, beautiful moment life offers.',
      price: 65.99, comparePrice: null, stock: 20,
      categoryId: seasonal.id, featured: false, bestseller: true, isNew: false,
      occasion: ['Birthday', "Mother's Day", 'Spring', 'Just Because'],
      colors: ['Pink', 'White', 'Blush'],
      tags: ['cherry blossom', 'spring', 'delicate', 'japanese', 'seasonal'],
      images: [
        { url: '/images/spring-cherry-blossom.jpg', alt: 'Spring Cherry Blossom', isPrimary: true },
        { url: '/images/cherry-blossom-detail.jpg', alt: 'Cherry blossom detail', isPrimary: false },
        { url: '/images/spring-arrangement.jpg', alt: 'Spring arrangement', isPrimary: false },
      ],
    },
    {
      name: 'Celestial Blue Iris',
      slug: 'celestial-blue-iris',
      description: 'An ethereal arrangement of blue irises, white freesias, and delicate blue delphiniums. This arrangement evokes the vastness of a clear sky and the wonder of starlit nights — truly celestial in its beauty and grace.',
      price: 62.99, comparePrice: null, stock: 16,
      categoryId: mothersDay.id, featured: false, bestseller: false, isNew: true,
      occasion: ["Mother's Day", 'Birthday', 'Just Because'],
      colors: ['Blue', 'Purple', 'White'],
      tags: ['iris', 'blue', 'ethereal', 'celestial', 'delicate'],
      images: [
        { url: '/images/celestial-blue-iris.jpg', alt: 'Celestial Blue Iris', isPrimary: true },
        { url: '/images/iris-close-up.jpg', alt: 'Iris close-up', isPrimary: false },
        { url: '/images/blue-iris-arrangement.jpg', alt: 'Blue iris arrangement', isPrimary: false },
      ],
    },

    // ═══════════════════════════════════════════
    //  ANNIVERSARY & LUXURY
    // ═══════════════════════════════════════════
    {
      name: 'Golden Anniversary',
      slug: 'golden-anniversary',
      description: 'A luxurious arrangement of golden yellow roses, amber chrysanthemums, and warm-toned dahlias. Adorned with gold-dipped leaf accents and premium packaging, this bouquet celebrates fifty years of beautiful love with the opulence it deserves.',
      price: 129.99, comparePrice: 159.99, stock: 8,
      categoryId: anniversary.id, featured: false, bestseller: false, isNew: false,
      occasion: ['Anniversary', 'Celebration', '50th Anniversary'],
      colors: ['Gold', 'Yellow', 'Amber'],
      tags: ['anniversary', 'golden', 'luxury', 'dahlias', '50 years'],
      images: [
        { url: '/images/golden-anniversary.jpg', alt: 'Golden Anniversary', isPrimary: true },
        { url: '/images/gold-floral-detail.jpg', alt: 'Gold floral detail', isPrimary: false },
        { url: '/images/anniversary-arrangement.jpg', alt: 'Anniversary arrangement', isPrimary: false },
      ],
    },
    {
      name: 'Eucalyptus & White Minimal',
      slug: 'eucalyptus-and-white',
      description: 'A minimalist yet breathtaking arrangement of white spray roses, lisianthus, and abundant eucalyptus. Clean, fresh, and modern — this arrangement suits contemporary interiors and makes an effortlessly sophisticated gift for anyone who appreciates understated beauty.',
      price: 57.99, comparePrice: null, stock: 38,
      categoryId: anniversary.id, featured: false, bestseller: false, isNew: false,
      occasion: ['Anniversary', 'Housewarming', 'Just Because'],
      colors: ['White', 'Green', 'Silver'],
      tags: ['eucalyptus', 'minimalist', 'modern', 'white', 'fresh'],
      images: [
        { url: '/images/eucalyptus-and-white-minimal.jpg', alt: 'Eucalyptus & White Minimal', isPrimary: true },
        { url: '/images/eucalyptus-detail.jpg', alt: 'Eucalyptus detail', isPrimary: false },
        { url: '/images/minimalist-white-arrangement.jpg', alt: 'Minimalist white arrangement', isPrimary: false },
      ],
    },
    {
      name: 'Pink Princess Bouquet',
      slug: 'pink-princess-bouquet',
      description: 'A dreamy cascade of pink and blush roses, fluffy pink carnations, and pink gypsophila. Whimsical, feminine, and utterly enchanting — the bouquet every princess deserves, at any age.',
      price: 52.99, comparePrice: 67.99, stock: 42,
      categoryId: birthday.id, featured: false, bestseller: true, isNew: false,
      occasion: ['Birthday', 'Celebration', 'Just Because'],
      colors: ['Pink', 'Blush', 'Light Pink'],
      tags: ['pink', 'feminine', 'dreamy', 'roses', 'princess'],
      images: [
        { url: '/images/pink-princess-bouquet.jpg', alt: 'Pink Princess Bouquet', isPrimary: true },
        { url: '/images/pink-bouquet-detail.jpg', alt: 'Pink bouquet detail', isPrimary: false },
        { url: '/images/princess-arrangement.jpg', alt: 'Princess arrangement', isPrimary: false },
      ],
    },
    {
      name: 'Tropical Paradise',
      slug: 'tropical-paradise',
      description: 'An exotic arrangement of bird of paradise, tropical leaves, anthurium, and orchids that transports you to a lush tropical paradise. Bold, vibrant, and utterly unforgettable — for those who want to make the most dramatic impression possible.',
      price: 99.99, comparePrice: null, stock: 10,
      categoryId: birthday.id, featured: false, bestseller: false, isNew: true,
      occasion: ['Birthday', 'Celebration', 'Summer', 'Anniversary'],
      colors: ['Orange', 'Red', 'Yellow', 'Green'],
      tags: ['tropical', 'exotic', 'bold', 'orchids', 'bird of paradise'],
      images: [
        { url: '/images/tropical-paradise.jpg', alt: 'Tropical Paradise', isPrimary: true },
        { url: '/images/tropical-flowers-detail.jpg', alt: 'Tropical flowers detail', isPrimary: false },
        { url: '/images/exotic-tropical-arrangement.jpg', alt: 'Exotic tropical arrangement', isPrimary: false },
      ],
    },
  ]

  // ── Insert flowers ────────────────────────────────────────────────────────
  console.log(`🌹 Seeding ${flowersData.length} flowers...`)

  for (const flowerData of flowersData) {
    const { images, ...data } = flowerData
    const flower = await prisma.flower.upsert({
      where: { slug: data.slug },
      update: {
        name: data.name,
        description: data.description,
        price: data.price,
        comparePrice: data.comparePrice ?? null,
        stock: data.stock,
        featured: data.featured,
        bestseller: data.bestseller,
        isNew: data.isNew,
        occasion: data.occasion,
        colors: data.colors,
        tags: data.tags,
      },
      create: {
        ...data,
        price: data.price,
        comparePrice: data.comparePrice ?? null,
      },
    })

    // Refresh images
    await prisma.productImage.deleteMany({ where: { flowerId: flower.id } })
    for (let i = 0; i < images.length; i++) {
      await prisma.productImage.create({
        data: { ...images[i], flowerId: flower.id, order: i },
      })
    }
    process.stdout.write('.')
  }
  console.log('\n')

  // ── Reviews ───────────────────────────────────────────────────────────────
  const allFlowers = await prisma.flower.findMany({ take: 12 })
  const reviewsData = [
    { rating: 5, title: 'Absolutely breathtaking!', body: 'I ordered these for my anniversary and my partner was in tears of joy. The flowers arrived fresh and beautifully arranged. Will definitely order again!' },
    { rating: 5, title: 'Perfect in every way', body: 'The quality is exceptional. These are not your typical supermarket flowers — every petal was perfect and the fragrance was divine.' },
    { rating: 5, title: 'Stunning arrangement', body: 'Really beautiful and arrived on time. The packaging was premium too. Slight delay in delivery but overall a wonderful experience.' },
    { rating: 5, title: 'Made her day!', body: "Ordered for my mum's birthday. She called me crying happy tears. The flowers lasted over two weeks! Incredibly impressed." },
    { rating: 5, title: 'Luxury quality', body: 'You can truly feel the premium quality. The arrangement was exactly as shown. Bloom & Blossom has become my go-to for special occasions.' },
    { rating: 4, title: 'Beautiful and fresh', body: 'Very impressed with the freshness and quality. The packaging felt very premium. My girlfriend loved every petal.' },
    { rating: 5, title: 'Wedding perfection', body: 'Used these for our wedding and received so many compliments. The florists at Bloom & Blossom are true artists.' },
    { rating: 5, title: 'Exceeded expectations', body: 'I was skeptical ordering flowers online but these completely changed my mind. The quality surpassed any florist I have visited in person.' },
    { rating: 5, title: 'Romantic and beautiful', body: 'Sent these to my wife and she was completely overwhelmed. The roses were enormous and the scent filled the whole house. Magnificent.' },
    { rating: 4, title: 'Great birthday gift', body: 'My friend absolutely loved the wildflower bouquet. Very unique and different from the usual roses. Will order again for sure.' },
    { rating: 5, title: 'Delivery was perfect', body: 'Arrived exactly on time, beautifully packaged, and looking absolutely fresh. The flowers lasted three weeks. Outstanding service.' },
    { rating: 5, title: 'Best flowers I ever bought', body: 'I have been ordering from Bloom & Blossom for a year now and every single order has been perfect. The tulips this time were absolutely glorious.' },
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

  // ── Sample order ──────────────────────────────────────────────────────────
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
          shipping: 0,
          tax: 34.65,
          total: 199.63,
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
              { flowerId: flower1.id, quantity: 1, price: flower1.price, name: flower1.name, image: '/images/eternal-rose-bouquet.jpg' },
              { flowerId: flower2.id, quantity: 1, price: flower2.price, name: flower2.name, image: '/images/blush-peony-dreams.jpg' },
            ],
          },
        },
      })
    }
  }

  // ── Newsletter ────────────────────────────────────────────────────────────
  await prisma.newsletterSubscriber.upsert({
    where: { email: 'newsletter@example.com' },
    update: {},
    create: { email: 'newsletter@example.com' },
  })

  console.log('✅ Database seeded successfully!')
  console.log(`\n  📦 ${flowersData.length} flowers with 3 images each
  🗂️  8 categories
  `)
  if (process.env.NODE_ENV !== 'production') {
    console.log('  📧 Local admin: admin@bloomblossom.com / Admin123!')
    console.log('  👤 Local demo:  demo@bloomblossom.com / User123!')
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
