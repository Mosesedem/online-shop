import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "electronics" },
      update: {},
      create: {
        name: "Electronics",
        slug: "electronics",
        image:
          "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400",
      },
    }),
    prisma.category.upsert({
      where: { slug: "fashion" },
      update: {},
      create: {
        name: "Fashion",
        slug: "fashion",
        image:
          "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400",
      },
    }),
    prisma.category.upsert({
      where: { slug: "home-living" },
      update: {},
      create: {
        name: "Home & Living",
        slug: "home-living",
        image:
          "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400",
      },
    }),
    prisma.category.upsert({
      where: { slug: "beauty-health" },
      update: {},
      create: {
        name: "Beauty & Health",
        slug: "beauty-health",
        image:
          "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400",
      },
    }),
    prisma.category.upsert({
      where: { slug: "sports-outdoors" },
      update: {},
      create: {
        name: "Sports & Outdoors",
        slug: "sports-outdoors",
        image:
          "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400",
      },
    }),
  ]);

  console.log(`✅ Created ${categories.length} categories`);

  // Create products
  const products = [
    // Electronics (5 products)
    {
      name: "Wireless Bluetooth Headphones",
      slug: "wireless-bluetooth-headphones",
      description:
        "Premium noise-cancelling wireless headphones with 30-hour battery life and superior sound quality. Perfect for music lovers and professionals.",
      price: 89.99,
      stock: 45,
      ageCategory: "ADULT_18" as const,
      categoryId: categories[0].id,
      images: [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
      ],
      publicThumbnail:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
      sku: "ELEC-001",
    },
    {
      name: "Smart Watch Pro",
      slug: "smart-watch-pro",
      description:
        "Advanced fitness tracking, heart rate monitoring, GPS, and smartphone notifications. Water-resistant up to 50m.",
      price: 249.99,
      stock: 30,
      ageCategory: "ADULT_18" as const,
      categoryId: categories[0].id,
      images: [
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
      ],
      publicThumbnail:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
      sku: "ELEC-002",
    },
    {
      name: "USB-C Hub 7-in-1",
      slug: "usb-c-hub-7-in-1",
      description:
        "Multi-port adapter with HDMI, USB 3.0, SD card reader, and USB-C power delivery. Essential for laptops and tablets.",
      price: 39.99,
      stock: 100,
      ageCategory: "ADULT_18" as const,
      categoryId: categories[0].id,
      images: [
        "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=800",
      ],
      publicThumbnail:
        "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400",
      sku: "ELEC-003",
    },
    {
      name: "Mechanical Gaming Keyboard",
      slug: "mechanical-gaming-keyboard",
      description:
        "RGB backlit mechanical keyboard with customizable keys, anti-ghosting, and ergonomic wrist rest.",
      price: 129.99,
      stock: 25,
      ageCategory: "ADULT_18" as const,
      categoryId: categories[0].id,
      images: [
        "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800",
      ],
      publicThumbnail:
        "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400",
      sku: "ELEC-004",
    },
    {
      name: "Portable Power Bank 20000mAh",
      slug: "portable-power-bank-20000mah",
      description:
        "High-capacity power bank with fast charging, dual USB ports, and LED display. Compatible with all devices.",
      price: 34.99,
      stock: 80,
      ageCategory: "ADULT_18" as const,
      categoryId: categories[0].id,
      images: [
        "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800",
      ],
      publicThumbnail:
        "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400",
      sku: "ELEC-005",
    },

    // Fashion (5 products)
    {
      name: "Premium Leather Jacket",
      slug: "premium-leather-jacket",
      description:
        "Genuine leather jacket with quilted lining, multiple pockets, and classic design. Available in black and brown.",
      price: 299.99,
      stock: 15,
      ageCategory: "ADULT_18" as const,
      categoryId: categories[1].id,
      images: [
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800",
      ],
      publicThumbnail:
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400",
      sku: "FASH-001",
    },
    {
      name: "Classic Denim Jeans",
      slug: "classic-denim-jeans",
      description:
        "Comfortable stretch denim with modern fit. Durable and stylish for everyday wear.",
      price: 59.99,
      stock: 60,
      ageCategory: "ADULT_18" as const,
      categoryId: categories[1].id,
      images: [
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800",
      ],
      publicThumbnail:
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400",
      sku: "FASH-002",
    },
    {
      name: "Designer Sunglasses",
      slug: "designer-sunglasses",
      description:
        "UV400 protection polarized lenses with metal frame. Timeless style meets modern protection.",
      price: 79.99,
      stock: 40,
      ageCategory: "ADULT_18" as const,
      categoryId: categories[1].id,
      images: [
        "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800",
      ],
      publicThumbnail:
        "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400",
      sku: "FASH-003",
    },
    {
      name: "Wool Blend Scarf",
      slug: "wool-blend-scarf",
      description:
        "Soft and warm winter scarf in multiple colors. Perfect accessory for cold weather.",
      price: 29.99,
      stock: 70,
      ageCategory: "ADULT_18" as const,
      categoryId: categories[1].id,
      images: [
        "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=800",
      ],
      publicThumbnail:
        "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=400",
      sku: "FASH-004",
    },
    {
      name: "Leather Crossbody Bag",
      slug: "leather-crossbody-bag",
      description:
        "Compact and elegant crossbody bag with adjustable strap. Multiple compartments for organization.",
      price: 89.99,
      stock: 35,
      ageCategory: "ADULT_18" as const,
      categoryId: categories[1].id,
      images: [
        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800",
      ],
      publicThumbnail:
        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400",
      sku: "FASH-005",
    },

    // Home & Living (5 products)
    {
      name: "Aromatherapy Diffuser",
      slug: "aromatherapy-diffuser",
      description:
        "Ultrasonic essential oil diffuser with 7-color LED lights and auto shut-off. Creates a relaxing atmosphere.",
      price: 34.99,
      stock: 50,
      ageCategory: "ADULT_18" as const,
      categoryId: categories[2].id,
      images: [
        "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800",
      ],
      publicThumbnail:
        "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400",
      sku: "HOME-001",
    },
    {
      name: "Memory Foam Pillow Set",
      slug: "memory-foam-pillow-set",
      description:
        "Pack of 2 premium memory foam pillows with cooling gel and hypoallergenic cover. Perfect for all sleeping positions.",
      price: 79.99,
      stock: 40,
      ageCategory: "ADULT_18" as const,
      categoryId: categories[2].id,
      images: [
        "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800",
      ],
      publicThumbnail:
        "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=400",
      sku: "HOME-002",
    },
    {
      name: "Ceramic Plant Pot Set",
      slug: "ceramic-plant-pot-set",
      description:
        "Set of 3 modern ceramic planters with drainage holes and saucers. Perfect for succulents and small plants.",
      price: 44.99,
      stock: 55,
      ageCategory: "ADULT_18" as const,
      categoryId: categories[2].id,
      images: [
        "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800",
      ],
      publicThumbnail:
        "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400",
      sku: "HOME-003",
    },
    {
      name: "LED String Lights",
      slug: "led-string-lights",
      description:
        "33ft waterproof fairy lights with remote control and 8 lighting modes. Perfect for bedroom, patio, or party.",
      price: 19.99,
      stock: 90,
      ageCategory: "ADULT_18" as const,
      categoryId: categories[2].id,
      images: [
        "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800",
      ],
      publicThumbnail:
        "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400",
      sku: "HOME-004",
    },
    {
      name: "Bamboo Kitchen Utensil Set",
      slug: "bamboo-kitchen-utensil-set",
      description:
        "6-piece eco-friendly bamboo cooking utensils with holder. Heat-resistant and non-scratch.",
      price: 29.99,
      stock: 65,
      ageCategory: "ADULT_18" as const,
      categoryId: categories[2].id,
      images: [
        "https://images.unsplash.com/photo-1556910110-a5a63dfd393c?w=800",
      ],
      publicThumbnail:
        "https://images.unsplash.com/photo-1556910110-a5a63dfd393c?w=400",
      sku: "HOME-005",
    },

    // Beauty & Health (3 products)
    {
      name: "Facial Cleansing Brush",
      slug: "facial-cleansing-brush",
      description:
        "Waterproof sonic facial brush with 3 speeds and multiple brush heads. Deep cleansing for all skin types.",
      price: 49.99,
      stock: 45,
      ageCategory: "ADULT_18" as const,
      categoryId: categories[3].id,
      images: [
        "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800",
      ],
      publicThumbnail:
        "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400",
      sku: "BEAU-001",
    },
    {
      name: "Vitamin C Serum",
      slug: "vitamin-c-serum",
      description:
        "20% Vitamin C serum with hyaluronic acid and vitamin E. Brightens skin and reduces signs of aging.",
      price: 24.99,
      stock: 75,
      ageCategory: "ADULT_18" as const,
      categoryId: categories[3].id,
      images: [
        "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800",
      ],
      publicThumbnail:
        "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400",
      sku: "BEAU-002",
    },
    {
      name: "Massage Gun",
      slug: "massage-gun",
      description:
        "Deep tissue percussion massager with 6 speeds and 4 massage heads. Relieves muscle tension and soreness.",
      price: 99.99,
      stock: 30,
      ageCategory: "ADULT_18" as const,
      categoryId: categories[3].id,
      images: [
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800",
      ],
      publicThumbnail:
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400",
      sku: "BEAU-003",
    },

    // Sports & Outdoors (2 products)
    {
      name: "Yoga Mat with Alignment Lines",
      slug: "yoga-mat-alignment-lines",
      description:
        "Premium non-slip yoga mat with body alignment system. Extra thick cushioning for comfort.",
      price: 39.99,
      stock: 55,
      ageCategory: "ADULT_18" as const,
      categoryId: categories[4].id,
      images: [
        "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800",
      ],
      publicThumbnail:
        "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400",
      sku: "SPOR-001",
    },
    {
      name: "Insulated Water Bottle 32oz",
      slug: "insulated-water-bottle-32oz",
      description:
        "Stainless steel vacuum-insulated bottle keeps drinks cold for 24 hours or hot for 12 hours. BPA-free.",
      price: 29.99,
      stock: 85,
      ageCategory: "ADULT_18" as const,
      categoryId: categories[4].id,
      images: [
        "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800",
      ],
      publicThumbnail:
        "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400",
      sku: "SPOR-002",
    },
  ];

  let createdCount = 0;
  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
    createdCount++;
  }

  console.log(`✅ Created ${createdCount} products`);
  console.log("🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
