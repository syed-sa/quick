import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const QuickLinksPage = () => {
  const location = useLocation();
  const sectionRefs = {
    about: useRef(null),
    advertise: useRef(null),
    terms: useRef(null),
    privacy: useRef(null),
  };

  // Handle scroll to anchor on page load
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-20 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-bold mb-6">Quick Links</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Everything you need to know about Quick - our mission, advertising opportunities, and policies.
          </p>
        </div>
      </section>

      {/* About Us Section */}
      <section
        id="about-us"
        ref={sectionRefs.about}
        className="py-20 px-6 border-b border-gray-200 scroll-mt-8"
      >
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-1 w-16 bg-gradient-to-r from-orange-400 to-red-500 rounded-full"></div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              About Us
            </h2>
          </div>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-4 text-lg leading-relaxed">
              Welcome to <span className="font-semibold text-orange-500">Quick</span> — your trusted local discovery platform based in Chennai. We help you find the best services and businesses near you, from restaurants and salons to home repairs and medical stores.
            </p>
            <p className="text-gray-700 mb-4 text-lg leading-relaxed">
              Our mission is to simplify your search for reliable local businesses. We verify listings, collect genuine reviews, and provide a seamless experience so you can make informed decisions quickly.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              Founded in 2024, Quick has already helped thousands of Chennai residents discover hidden gems and trusted professionals in their neighborhood. We're expanding rapidly and aim to become the go‑to platform for local discovery across India.
            </p>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="text-center p-6 bg-white rounded-xl shadow-sm">
              <div className="text-3xl font-bold text-orange-500 mb-2">10K+</div>
              <div className="text-gray-600">Listed Businesses</div>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-sm">
              <div className="text-3xl font-bold text-orange-500 mb-2">50K+</div>
              <div className="text-gray-600">Happy Users</div>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-sm">
              <div className="text-3xl font-bold text-orange-500 mb-2">100+</div>
              <div className="text-gray-600">Daily Searches</div>
            </div>
          </div>
        </div>
      </section>

      {/* Advertise With Us Section */}
      <section
        id="advertise-with-us"
        ref={sectionRefs.advertise}
        className="py-20 px-6 border-b border-gray-200 bg-gray-50 scroll-mt-8"
      >
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-1 w-16 bg-gradient-to-r from-orange-400 to-red-500 rounded-full"></div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              Advertise With Us
            </h2>
          </div>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-6 text-lg leading-relaxed">
              Reach thousands of active local customers in Chennai. Quick offers targeted advertising solutions tailored for small businesses and large enterprises alike.
            </p>

            <div className="bg-white p-8 rounded-xl shadow-sm mb-8">
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">Why advertise with Quick?</h3>
              <p className="text-gray-700 mb-4">
                Our users are actively searching for services like yours. With prominent listings, sponsored placements, and detailed analytics, you'll connect with the right audience and grow your business.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h4 className="font-semibold text-lg mb-2 text-orange-500">Enhanced Business Profile</h4>
                <p className="text-gray-600">Stand out with photos, videos, special offers, and direct contact options.</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h4 className="font-semibold text-lg mb-2 text-orange-500">Sponsored Search Results</h4>
                <p className="text-gray-600">Appear at the top when customers search for your category.</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h4 className="font-semibold text-lg mb-2 text-orange-500">Banner Advertising</h4>
                <p className="text-gray-600">High-visibility placements across our platform.</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h4 className="font-semibold text-lg mb-2 text-orange-500">Geo‑targeted Promotions</h4>
                <p className="text-gray-600">Reach customers in specific neighborhoods or zones.</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-red-50 p-8 rounded-xl">
              <p className="text-gray-800 text-lg">
                <span className="font-semibold">Ready to grow?</span> Contact our advertising team at{" "}
                <a href="mailto:advertise@quick.com" className="text-orange-500 font-semibold hover:underline">
                  advertise@quick.com
                </a>{" "}
                for a customized plan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Terms & Conditions Section */}
      <section
        id="terms-and-conditions"
        ref={sectionRefs.terms}
        className="py-20 px-6 border-b border-gray-200 scroll-mt-8"
      >
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-1 w-16 bg-gradient-to-r from-orange-400 to-red-500 rounded-full"></div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              Terms & Conditions
            </h2>
          </div>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-6 text-lg">
              By using Quick, you agree to the following terms. We're committed to transparency and fairness.
            </p>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold mb-3 text-gray-800">1. Use of Platform</h3>
                <p className="text-gray-700">
                  Quick provides a directory of local businesses. We do not guarantee the accuracy of listings or reviews, but we work diligently to keep information up‑to‑date. Users should verify critical details independently.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold mb-3 text-gray-800">2. User Conduct</h3>
                <p className="text-gray-700">
                  You agree not to misuse the platform, post false or misleading reviews, attempt to manipulate listings, or engage in any activity that disrupts the experience for other users.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold mb-3 text-gray-800">3. Business Listings</h3>
                <p className="text-gray-700">
                  Business owners are responsible for the accuracy of their listings. Quick reserves the right to remove or modify listings that violate our guidelines.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold mb-3 text-gray-800">4. Limitation of Liability</h3>
                <p className="text-gray-700">
                  Quick is not liable for any disputes, damages, or issues arising from interactions between users and businesses. We encourage you to exercise due diligence before engaging any service.
                </p>
              </div>
            </div>

            <p className="text-gray-600 mt-8 text-sm">
              Last updated: January 2025. For the complete terms, please contact our legal department.
            </p>
          </div>
        </div>
      </section>

      {/* Privacy Policy Section */}
      <section
        id="privacy-policy"
        ref={sectionRefs.privacy}
        className="py-20 px-6 bg-gray-50 scroll-mt-8"
      >
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-1 w-16 bg-gradient-to-r from-orange-400 to-red-500 rounded-full"></div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              Privacy Policy
            </h2>
          </div>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-8 text-lg">
              Your privacy matters to us. This policy explains how Quick collects, uses, and protects your information.
            </p>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Information We Collect</h3>
                <p className="text-gray-700 mb-3">We collect:</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Basic profile details (name, email, phone) when you sign up or list your business</li>
                  <li>Usage data to improve your experience and personalize recommendations</li>
                  <li>Location data (with your permission) to show relevant local results</li>
                  <li>Business information provided by listing owners</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold mb-3 text-gray-800">How We Use Your Information</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>To personalize business recommendations and search results</li>
                  <li>To display nearby businesses based on your location</li>
                  <li>To communicate platform updates and relevant offers</li>
                  <li>To improve our services through analytics</li>
                </ul>
                <p className="text-gray-700 mt-3 font-medium">We never sell your personal data to third parties.</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Data Security</h3>
                <p className="text-gray-700">
                  We implement industry‑standard security measures to protect your information. However, no method of transmission over the Internet is 100% secure, so we cannot guarantee absolute security.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Your Rights</h3>
                <p className="text-gray-700">
                  You can request access to, correction, or deletion of your personal data at any time. Contact our privacy team for assistance.
                </p>
              </div>
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl">
              <p className="text-gray-800">
                <span className="font-semibold">Privacy concerns?</span> Write to us at{" "}
                <a href="mailto:privacy@quick.com" className="text-orange-500 font-semibold hover:underline">
                  privacy@quick.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default QuickLinksPage;