"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQ[] = [
  {
    category: "Orders & Shipping",
    question: "How long does shipping take?",
    answer: "Standard shipping typically takes 3-5 business days. Express shipping is available for 1-2 business day delivery. All orders are shipped discreetly with signature confirmation required for age-restricted products.",
  },
  {
    category: "Orders & Shipping",
    question: "Do you ship internationally?",
    answer: "Currently, we only ship within Nigeria. We're working on expanding our shipping options to other countries in the near future.",
  },
  {
    category: "Orders & Shipping",
    question: "How can I track my order?",
    answer: "Once your order ships, you'll receive a tracking number via email. You can also track your order status by logging into your account and viewing your order history.",
  },
  {
    category: "Products",
    question: "Are all products age-restricted?",
    answer: "Yes, all products on our platform are age-restricted and require age verification. You must be 18+ to purchase from our store.",
  },
  {
    category: "Products",
    question: "How do I know if a product is in stock?",
    answer: "Product availability is shown on each product page. If an item is out of stock, you can sign up for notifications to be alerted when it's back in stock.",
  },
  {
    category: "Products",
    question: "What if I receive a damaged product?",
    answer: "We take great care in packaging all orders. If you receive a damaged product, please contact our support team within 48 hours with photos of the damage, and we'll arrange a replacement or refund.",
  },
  {
    category: "Age Verification",
    question: "Why do I need to verify my age?",
    answer: "Age verification is a legal requirement for purchasing adult wellness products. We use secure third-party verification services to ensure compliance with regulations while protecting your privacy.",
  },
  {
    category: "Age Verification",
    question: "How is my verification data stored?",
    answer: "We do not store any raw identification documents. Our verification partners securely process your information and only share verification status with us. Your privacy and data security are our top priorities.",
  },
  {
    category: "Age Verification",
    question: "How long does verification take?",
    answer: "Most verifications are completed instantly. In some cases, manual review may be required, which can take up to 24 hours.",
  },
  {
    category: "Payment & Returns",
    question: "What payment methods do you accept?",
    answer: "We accept all major credit/debit cards, bank transfers, and mobile payment options including Paystack. All transactions are processed securely.",
  },
  {
    category: "Payment & Returns",
    question: "What is your return policy?",
    answer: "Due to the nature of our products, we can only accept returns for unopened, unused items within 14 days of delivery. Items must be in their original packaging.",
  },
  {
    category: "Payment & Returns",
    question: "When will I receive my refund?",
    answer: "Refunds are processed within 5-7 business days after we receive and inspect the returned item. The refund will be credited to your original payment method.",
  },
  {
    category: "Privacy & Security",
    question: "Is my purchase discreet?",
    answer: "Yes, all orders are shipped in plain, unmarked packaging with no indication of the contents. Your privacy is extremely important to us.",
  },
  {
    category: "Privacy & Security",
    question: "How do you protect my personal information?",
    answer: "We use industry-standard encryption and security measures to protect your data. We never share your personal information with third parties except as required for order fulfillment and age verification.",
  },
  {
    category: "Account",
    question: "How do I reset my password?",
    answer: "Click on 'Forgot Password' on the login page and enter your email address. You'll receive a password reset link via email.",
  },
  {
    category: "Account",
    question: "Can I update my shipping address?",
    answer: "Yes, you can add, edit, or remove shipping addresses in your account settings. You can also set a default address for faster checkout.",
  },
];

const categories = Array.from(new Set(faqs.map((faq) => faq.category)));

export default function FAQsPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredFaqs = selectedCategory
    ? faqs.filter((faq) => faq.category === selectedCategory)
    : faqs;

  return (
    <main className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
      <div className="text-center mb-8 md:mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-muted-foreground text-lg">
          Find answers to common questions about our products, shipping, and services
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        <button
          onClick={() => setSelectedCategory(null)}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-colors",
            selectedCategory === null
              ? "bg-deep-oxblood text-white"
              : "bg-muted hover:bg-muted/80"
          )}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-colors",
              selectedCategory === category
                ? "bg-deep-oxblood text-white"
                : "bg-muted hover:bg-muted/80"
            )}
          >
            {category}
          </button>
        ))}
      </div>

      {/* FAQs List */}
      <div className="space-y-4">
        {filteredFaqs.map((faq, index) => (
          <div
            key={index}
            className="border rounded-lg overflow-hidden bg-card"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1 pr-4">
                <div className="text-xs text-deep-oxblood font-semibold mb-1">
                  {faq.category}
                </div>
                <div className="font-semibold">{faq.question}</div>
              </div>
              <ChevronDown
                className={cn(
                  "w-5 h-5 text-muted-foreground transition-transform flex-shrink-0",
                  openIndex === index && "rotate-180"
                )}
              />
            </button>
            {openIndex === index && (
              <div className="px-6 py-4 border-t bg-muted/20">
                <p className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Contact Section */}
      <div className="mt-12 p-6 bg-muted rounded-lg text-center">
        <h2 className="text-xl font-semibold mb-2">Still have questions?</h2>
        <p className="text-muted-foreground mb-4">
          Can't find the answer you're looking for? Our support team is here to help.
        </p>
        <a
          href="mailto:support@wellnessshop.com"
          className="inline-block px-6 py-3 bg-deep-oxblood text-white rounded-lg font-medium hover:bg-deep-oxblood/90 transition-colors"
        >
          Contact Support
        </a>
      </div>
    </main>
  );
}
