import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Returns Policy | Wellness Shop",
  description: "Our returns and refunds policy",
};

export default function ReturnsPolicy() {
  return (
    <main className="container mx-auto px-4 py-6 md:py-12 max-w-4xl">
      <Button variant="ghost" asChild className="mb-6 -ml-2">
        <Link href="/profile">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Profile
        </Link>
      </Button>

      <div className="prose prose-sm sm:prose md:prose-lg max-w-none">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Returns Policy</h1>
        
        <p className="text-muted-foreground mb-8">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Our Commitment</h2>
          <p className="text-muted-foreground leading-relaxed">
            We want you to be completely satisfied with your purchase. If you're not happy with your order, 
            we're here to help with our straightforward returns policy.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Return Window</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            You have <strong>30 days</strong> from the date of delivery to return most items for a full refund or exchange.
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Items must be unused and in their original packaging</li>
            <li>All tags and labels must be attached</li>
            <li>Proof of purchase is required</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Non-Returnable Items</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            For health and safety reasons, the following items cannot be returned:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Opened or used intimate wellness products</li>
            <li>Personal care items that have been unsealed</li>
            <li>Items marked as "final sale" or "non-returnable"</li>
            <li>Gift cards and downloadable products</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">How to Return</h2>
          <ol className="list-decimal pl-6 space-y-3 text-muted-foreground">
            <li>
              <strong>Contact Us:</strong> Email us at returns@wellnessshop.com with your order number 
              and reason for return
            </li>
            <li>
              <strong>Get Authorization:</strong> We'll send you a return authorization number and 
              shipping instructions
            </li>
            <li>
              <strong>Pack Your Item:</strong> Securely package the item with all original materials
            </li>
            <li>
              <strong>Ship It Back:</strong> Use the prepaid shipping label we provide (for eligible returns)
            </li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Refunds</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Once we receive and inspect your return:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>We'll send you an email confirmation</li>
            <li>Refunds are processed within 5-7 business days</li>
            <li>The refund will be credited to your original payment method</li>
            <li>Shipping costs are non-refundable (except for defective or incorrect items)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Exchanges</h2>
          <p className="text-muted-foreground leading-relaxed">
            If you'd like to exchange an item for a different size, color, or product, please follow 
            the return process and place a new order for the item you want. This ensures you get your 
            new item as quickly as possible.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Damaged or Defective Items</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            If you receive a damaged or defective item:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Contact us immediately with photos of the damage</li>
            <li>We'll arrange for a replacement or full refund</li>
            <li>Return shipping is free for damaged or defective items</li>
            <li>We may ask you to return the item for inspection</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">International Returns</h2>
          <p className="text-muted-foreground leading-relaxed">
            International customers are responsible for return shipping costs. We recommend using a 
            trackable shipping service. Customs duties and taxes are non-refundable.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p className="text-muted-foreground leading-relaxed">
            Have questions about returns? We're here to help!
          </p>
          <div className="mt-4 space-y-2 text-muted-foreground">
            <p><strong>Email:</strong> returns@wellnessshop.com</p>
            <p><strong>Phone:</strong> +234 (0) 800 123 4567</p>
            <p><strong>Hours:</strong> Monday - Friday, 9AM - 6PM WAT</p>
          </div>
        </section>
      </div>
    </main>
  );
}
