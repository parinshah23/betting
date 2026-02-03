'use client';

import React from 'react';
import Link from 'next/link';
import {
  Shield,
  Lock,
  ArrowLeft,
  ExternalLink,
  Mail,
  Database,
  UserCheck,
  Cookie
} from 'lucide-react';

const lastUpdated = 'January 1, 2026';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
              <p className="text-gray-500">Last updated: {lastUpdated}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-12">
          <div className="prose prose-gray max-w-none">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-800">
                  <strong>Your privacy is important to us.</strong> This Privacy Policy explains how we collect,
                  use, store, and protect your personal information when you use our competition platform.
                </p>
              </div>
            </div>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>

              <h3 className="text-lg font-semibold text-gray-800 mb-3">1.1 Personal Information</h3>
              <p className="text-gray-600 mb-4">
                When you create an account or use our services, we may collect:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 mb-6">
                <li>Name (first and last)</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Date of birth (for age verification)</li>
                <li>Postal address (for prize delivery)</li>
                <li>Payment information (processed securely by our payment provider)</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-800 mb-3">1.2 Usage Information</h3>
              <p className="text-gray-600 mb-4">
                We automatically collect information about how you use our platform:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>IP address and browser type</li>
                <li>Device information</li>
                <li>Pages visited and time spent</li>
                <li>Competitions entered and tickets purchased</li>
                <li>Wallet transactions</li>
                <li>Referral sources</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
              <p className="text-gray-600 mb-4">
                We use your personal information for the following purposes:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>To create and manage your account</li>
                <li>To process ticket purchases and competition entries</li>
                <li>To contact you if you win a competition</li>
                <li>To deliver prizes to your address</li>
                <li>To send you service-related notifications</li>
                <li>To provide customer support</li>
                <li>To prevent fraud and ensure platform security</li>
                <li>To comply with legal obligations</li>
                <li>To improve our services and user experience</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Legal Basis for Processing</h2>
              <p className="text-gray-600 mb-4">
                Under GDPR, we process your personal data based on the following legal grounds:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li><strong>Contract:</strong> Processing necessary to fulfill our contract with you (providing competition services)</li>
                <li><strong>Consent:</strong> Where you have given explicit consent (e.g., marketing communications)</li>
                <li><strong>Legal Obligation:</strong> To comply with applicable laws and regulations</li>
                <li><strong>Legitimate Interests:</strong> For fraud prevention, security, and service improvement</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Storage and Security</h2>
              <div className="flex items-start gap-3 mb-4">
                <Database className="w-5 h-5 text-primary-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Storage</h3>
                  <p className="text-gray-600">
                    Your data is stored on secure servers located within the United Kingdom and European Union.
                    We retain your data only as long as necessary to provide our services and comply with legal obligations.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-primary-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Security Measures</h3>
                  <p className="text-gray-600">
                    We implement industry-standard security measures including:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4 mt-2">
                    <li>SSL/TLS encryption for data transmission</li>
                    <li>Encrypted storage of sensitive data</li>
                    <li>Regular security audits and assessments</li>
                    <li>Access controls and authentication</li>
                    <li>Secure payment processing (we never store full card details)</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Cookies and Tracking</h2>
              <div className="flex items-start gap-3 mb-4">
                <Cookie className="w-5 h-5 text-primary-600 flex-shrink-0 mt-1" />
                <p className="text-gray-600">
                  We use cookies and similar technologies to enhance your experience, analyze usage,
                  and assist in our marketing efforts. You can manage cookie preferences through your browser settings.
                </p>
              </div>
              <p className="text-gray-600 mb-4">Types of cookies we use:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li><strong>Essential:</strong> Required for the platform to function</li>
                <li><strong>Functional:</strong> Remember your preferences and settings</li>
                <li><strong>Analytics:</strong> Help us understand how visitors interact with our site</li>
                <li><strong>Marketing:</strong> Used to deliver relevant advertisements (only with consent)</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Third-Party Services</h2>
              <p className="text-gray-600 mb-4">
                We may share your data with trusted third-party service providers who assist us in operating
                our platform:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li><strong>Payment Processors:</strong> To process ticket purchases (Stripe)</li>
                <li><strong>Email Services:</strong> To send notifications and marketing emails</li>
                <li><strong>Analytics Providers:</strong> To analyze platform usage</li>
                <li><strong>Cloud Hosting:</strong> To store and process data securely</li>
              </ul>
              <p className="text-gray-600 mt-4">
                All third-party providers are contractually obligated to protect your data and use it only
                for the specific services they provide to us.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Your Rights</h2>
              <div className="flex items-start gap-3 mb-4">
                <UserCheck className="w-5 h-5 text-primary-600 flex-shrink-0 mt-1" />
                <p className="text-gray-600">
                  Under data protection laws, you have the following rights:
                </p>
              </div>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li><strong>Right to Access:</strong> Request a copy of your personal data</li>
                <li><strong>Right to Rectification:</strong> Correct inaccurate or incomplete data</li>
                <li><strong>Right to Erasure:</strong> Request deletion of your data (&quot;right to be forgotten&quot;)</li>
                <li><strong>Right to Restrict Processing:</strong> Limit how we use your data</li>
                <li><strong>Right to Data Portability:</strong> Receive your data in a structured format</li>
                <li><strong>Right to Object:</strong> Object to certain types of processing</li>
                <li><strong>Right to Withdraw Consent:</strong> Withdraw consent at any time</li>
              </ul>
              <p className="text-gray-600 mt-4">
                To exercise any of these rights, please contact us using the details below.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Data Retention</h2>
              <p className="text-gray-600">
                We retain your personal data for as long as necessary to:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 mt-2">
                <li>Provide our services to you</li>
                <li>Comply with legal and tax obligations (typically 6-7 years)</li>
                <li>Resolve disputes and enforce our agreements</li>
              </ul>
              <p className="text-gray-600 mt-4">
                When data is no longer needed, we securely delete or anonymize it.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Children&apos;s Privacy</h2>
              <p className="text-gray-600">
                Our platform is not intended for individuals under 18 years of age. We do not knowingly
                collect personal data from children. If you believe we have inadvertently collected data
                from a minor, please contact us immediately so we can delete the information.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. International Transfers</h2>
              <p className="text-gray-600">
                If we transfer your data outside the UK or EEA, we ensure appropriate safeguards are in place,
                such as Standard Contractual Clauses or adequacy decisions, to protect your privacy rights.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Changes to This Policy</h2>
              <p className="text-gray-600">
                We may update this Privacy Policy from time to time. We will notify you of any material
                changes by posting the new policy on this page and updating the &quot;Last updated&quot; date.
                Continued use of our services after changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Us</h2>
              <p className="text-gray-600 mb-4">
                If you have any questions, concerns, or requests regarding this Privacy Policy or your
                personal data, please contact us:
              </p>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Mail className="w-5 h-5 text-primary-600" />
                  <a href="mailto:privacy@example.com" className="text-primary-600 hover:underline font-medium">
                    privacy@example.com
                  </a>
                </div>
                <p className="text-gray-600 text-sm">
                  We aim to respond to all privacy-related inquiries within 30 days.
                </p>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Complaints</h2>
              <p className="text-gray-600">
                If you are not satisfied with our response to your privacy concerns, you have the right
                to lodge a complaint with the Information Commissioner&apos;s Office (ICO), the UK supervisory
                authority for data protection issues.
              </p>
              <div className="mt-4">
                <a
                  href="https://ico.org.uk/make-a-complaint/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary-600 hover:underline"
                >
                  Visit ICO Website
                  <ExternalLink className="w-4 h-4 ml-1" />
                </a>
              </div>
            </section>

            <div className="border-t border-gray-200 pt-8 mt-8">
              <p className="text-sm text-gray-500">
                By using our platform, you acknowledge that you have read and understood this Privacy Policy
                and agree to the collection, use, and processing of your personal information as described herein.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
