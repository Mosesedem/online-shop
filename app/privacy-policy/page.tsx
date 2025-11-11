import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Privacy Policy | Wellness Shop",
  description: "Our privacy policy and data protection practices",
};

export default function PrivacyPolicy() {
  return (
    <main className="container mx-auto px-4 py-6 md:py-12 max-w-4xl">
      <Button variant="ghost" asChild className="mb-6 -ml-2">
        <Link href="/profile">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Profile
        </Link>
      </Button>

      <div className="prose prose-sm sm:prose md:prose-lg max-w-none">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Privacy Policy</h1>
        
        <p className="text-muted-foreground mb-8">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
          <p className="text-muted-foreground leading-relaxed">
            At Wellness Shop, we take your privacy seriously. This Privacy Policy explains how we collect, 
            use, disclose, and safeguard your information when you visit our website and use our services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
          
          <h3 className="text-xl font-semibold mb-3 mt-6">Personal Information</h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            We collect information that you provide directly to us, including:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Name, email address, and phone number</li>
            <li>Shipping and billing addresses</li>
            <li>Payment information (processed securely by our payment providers)</li>
            <li>Account credentials and preferences</li>
            <li>Order history and purchase information</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6">Automatically Collected Information</h3>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>IP address and browser type</li>
            <li>Device information and operating system</li>
            <li>Pages visited and time spent on our site</li>
            <li>Referring website addresses</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            We use the information we collect to:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Process and fulfill your orders</li>
            <li>Communicate with you about your orders and account</li>
            <li>Send you marketing communications (with your consent)</li>
            <li>Improve our website and services</li>
            <li>Detect and prevent fraud</li>
            <li>Comply with legal obligations</li>
            <li>Personalize your shopping experience</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Information Sharing</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            We may share your information with:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li><strong>Service Providers:</strong> Third parties who help us operate our business (payment processors, shipping companies, etc.)</li>
            <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
            <li><strong>Business Transfers:</strong> In connection with a merger, sale, or acquisition</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mt-4">
            We do not sell your personal information to third parties.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
          <p className="text-muted-foreground leading-relaxed">
            We implement appropriate technical and organizational measures to protect your personal information, 
            including encryption, secure servers, and regular security assessments. However, no method of 
            transmission over the internet is 100% secure.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            You have the right to:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Access and receive a copy of your personal data</li>
            <li>Correct inaccurate or incomplete information</li>
            <li>Request deletion of your personal data</li>
            <li>Object to or restrict certain processing activities</li>
            <li>Withdraw consent for marketing communications</li>
            <li>Data portability (receive your data in a structured format)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Cookies</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            We use cookies and similar technologies to:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Remember your preferences and settings</li>
            <li>Keep you signed in</li>
            <li>Analyze site traffic and usage</li>
            <li>Personalize content and ads</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mt-4">
            You can control cookies through your browser settings, but some features may not work properly if you disable them.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Children's Privacy</h2>
          <p className="text-muted-foreground leading-relaxed">
            Our services are not intended for individuals under 18 years of age. We do not knowingly collect 
            personal information from children. If you believe we have collected information from a child, 
            please contact us immediately.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">International Data Transfers</h2>
          <p className="text-muted-foreground leading-relaxed">
            Your information may be transferred to and processed in countries other than your own. We ensure 
            appropriate safeguards are in place to protect your data in accordance with this Privacy Policy.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Changes to This Policy</h2>
          <p className="text-muted-foreground leading-relaxed">
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting 
            the new policy on this page and updating the "Last updated" date.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            If you have questions about this Privacy Policy or our data practices, please contact us:
          </p>
          <div className="mt-4 space-y-2 text-muted-foreground">
            <p><strong>Email:</strong> privacy@wellnessshop.com</p>
            <p><strong>Phone:</strong> +234 (0) 800 123 4567</p>
            <p><strong>Address:</strong> 123 Wellness Street, Lagos, Nigeria</p>
          </div>
        </section>
      </div>
    </main>
  );
}
