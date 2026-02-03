'use client';

import React from 'react';
import Link from 'next/link';
import {
  Scale,
  AlertTriangle,
  ArrowLeft
} from 'lucide-react';

const lastUpdated = 'January 1, 2026';

export default function TermsPage() {
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
              <Scale className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Terms & Conditions</h1>
              <p className="text-gray-500">Last updated: {lastUpdated}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-12">
          <div className="prose prose-gray max-w-none">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-yellow-800">
                  <strong>Important:</strong> Please read these terms carefully before using our services.
                  By entering any competition, you agree to be bound by these terms and conditions.
                </p>
              </div>
            </div>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-600 mb-4">
                These Terms and Conditions govern your use of our competition platform and all related services.
                By accessing or using our website, purchasing tickets, or entering competitions, you acknowledge
                that you have read, understood, and agree to be bound by these terms.
              </p>
              <p className="text-gray-600">
                We reserve the right to modify these terms at any time. Changes will be effective immediately
                upon posting to the website. Your continued use of the platform constitutes acceptance of
                any modified terms.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Eligibility</h2>
              <p className="text-gray-600 mb-4">
                To participate in our competitions, you must:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Be at least 18 years of age</li>
                <li>Be a resident of a country where our competitions are legally permitted</li>
                <li>Not be an employee of our company or their immediate family members</li>
                <li>Not be prohibited from entering competitions by any applicable law</li>
                <li>Have a valid account with accurate personal information</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Competition Rules</h2>
              <p className="text-gray-600 mb-4">
                All competitions are skill-based and require the correct answer to a skill question to validate
                your entry. By purchasing a ticket and answering the skill question:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>You confirm that you have the necessary skills to answer the question</li>
                <li>Incorrect answers will result in an invalid entry and may forfeit your ticket</li>
                <li>Each competition has a limited number of tickets available</li>
                <li>Maximum ticket limits per user may apply and are specified on each competition page</li>
                <li>Competitions may end either when all tickets are sold or when the specified end date is reached</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Ticket Purchases</h2>
              <p className="text-gray-600 mb-4">
                When you purchase tickets for a competition:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>All prices are displayed in GBP (£) and include VAT where applicable</li>
                <li>Payment must be made in full at the time of purchase</li>
                <li>We accept major credit/debit cards and wallet funds</li>
                <li>Ticket purchases are generally non-refundable once the competition draw has occurred</li>
                <li>In the event of a competition cancellation, a full refund will be provided</li>
                <li>We reserve the right to refuse ticket sales to any person</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Winner Selection</h2>
              <p className="text-gray-600 mb-4">
                Winners are selected using a certified random number generator after a competition ends
                or sells out. The winner is randomly selected from all valid entries.
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Winners will be notified via email within 48 hours of the draw</li>
                <li>Results will be published on our Winners Gallery page</li>
                <li>If a winner cannot be contacted within 14 days, we reserve the right to redraw</li>
                <li>We reserve the right to verify the identity and eligibility of any winner</li>
                <li>Winners may be required to provide proof of age and residency</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Prizes</h2>
              <p className="text-gray-600 mb-4">
                Prize details are clearly stated on each competition page. By accepting a prize:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Prizes must be claimed within 30 days of the draw</li>
                <li>Physical prizes will be delivered to the address registered on your account</li>
                <li>Cash prizes will be transferred to your wallet or bank account</li>
                <li>Prizes are non-transferable unless otherwise stated</li>
                <li>We reserve the right to substitute prizes of equal or greater value if necessary</li>
                <li>Winners are responsible for any applicable taxes on prizes</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Wallet & Cashback</h2>
              <p className="text-gray-600 mb-4">
                Our wallet feature allows you to store funds for ticket purchases:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Wallet funds can be used to purchase competition tickets</li>
                <li>Cashback earned is automatically added to your wallet</li>
                <li>Wallet funds are non-transferable between accounts</li>
                <li>Withdrawal requests may be subject to processing fees and minimum amounts</li>
                <li>Wallet funds do not accrue interest</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Account Responsibilities</h2>
              <p className="text-gray-600 mb-4">
                You are responsible for:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>Providing accurate and up-to-date personal information</li>
                <li>Notifying us immediately of any unauthorized account access</li>
                <li>Ensuring you meet all eligibility requirements before entering competitions</li>
                <li>Complying with all applicable laws and regulations</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Prohibited Activities</h2>
              <p className="text-gray-600 mb-4">
                You must not:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Use automated systems or bots to purchase tickets</li>
                <li>Create multiple accounts to circumvent ticket limits</li>
                <li>Attempt to manipulate competition outcomes</li>
                <li>Share answers to skill questions</li>
                <li>Use fraudulent payment methods</li>
                <li>Engage in any activity that disrupts our services</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Limitation of Liability</h2>
              <p className="text-gray-600 mb-4">
                To the fullest extent permitted by law:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>We are not liable for any indirect, incidental, or consequential damages</li>
                <li>Our total liability shall not exceed the amount you paid for the specific competition</li>
                <li>We are not responsible for technical failures beyond our reasonable control</li>
                <li>Prizes are provided &quot;as is&quot; without warranties</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Termination</h2>
              <p className="text-gray-600">
                We reserve the right to suspend or terminate your account and access to our services at any time,
                without notice, for any reason, including breach of these terms. Upon termination, any unused
                wallet funds may be forfeited at our discretion.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Governing Law</h2>
              <p className="text-gray-600">
                These terms are governed by the laws of the United Kingdom. Any disputes shall be subject to
                the exclusive jurisdiction of the courts of England and Wales.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Contact Information</h2>
              <p className="text-gray-600 mb-4">
                If you have any questions about these terms, please contact us:
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700">
                  <strong>Email:</strong>{' '}
                  <a href="mailto:support@example.com" className="text-primary-600 hover:underline">
                    support@example.com
                  </a>
                </p>
              </div>
            </section>

            <div className="border-t border-gray-200 pt-8 mt-8">
              <p className="text-sm text-gray-500">
                By using our platform, you confirm that you have read, understood, and agree to these
                Terms and Conditions. If you do not agree with any part of these terms, you must not
                use our services.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
