'use client';
import Link from 'next/link';

export default function Guide() {
  const userGuides = {
    provider: [
      {
        title: "Getting Started as a Provider",
        steps: [
          "Create your service with clear descriptions and competitive pricing",
          "Set your availability and response times",
          "Upload professional photos of your work",
          "Respond promptly to booking requests"
        ]
      },
      {
        title: "Managing Your Services",
        steps: [
          "Keep your service listings updated",
          "Monitor your booking calendar regularly",
          "Communicate clearly with customers",
          "Update your availability as needed"
        ]
      },
      {
        title: "Growing Your Business",
        steps: [
          "Ask satisfied customers for reviews",
          "Share your service profile with your network",
          "Offer promotions during slow periods",
          "Maintain high quality service standards"
        ]
      }
    ],
    customer: [
      {
        title: "Finding the Right Service",
        steps: [
          "Browse services by category and location",
          "Compare provider ratings and reviews",
          "Check provider availability and response times",
          "Read service descriptions carefully"
        ]
      },
      {
        title: "Booking Process",
        steps: [
          "Select your preferred date and time",
          "Add any special requirements in the notes",
          "Confirm your booking details",
          "Wait for provider confirmation"
        ]
      },
      {
        title: "After Booking",
        steps: [
          "Communicate any changes promptly",
          "Prepare for the service appointment",
          "Provide feedback after service completion",
          "Book your favorite providers again"
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#0F1419]">
      {/* Navigation */}
      <nav className="bg-[#131A22] border-b border-[#232F3E]">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl font-bold bg-[#FEBD69] text-[#131A22]">
              SM
            </div>
            <h1 className="text-2xl font-bold text-white">Service Marketplace</h1>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="px-6 py-2.5 rounded-lg font-semibold text-[#131A22] bg-[#FEBD69] hover:bg-[#e5a958] transition">
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-[#131A22] border-b border-[#232F3E]">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-5xl font-bold text-white mb-4 text-center">
            Service Marketplace Guide
          </h1>
          <p className="text-xl text-gray-300 text-center max-w-3xl mx-auto">
            Everything you need to know to get the most out of our platform
          </p>
        </div>
      </div>

      {/* Guide Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Provider Guide */}
          <div className="bg-[#131A22] border border-[#232F3E] rounded-2xl p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 rounded-full bg-[#FEBD69] flex items-center justify-center text-3xl mb-4 mx-auto">
                🛠️
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">For Service Providers</h2>
              <p className="text-gray-300">Grow your business and attract more customers</p>
            </div>

            <div className="space-y-8">
              {userGuides.provider.map((section, index) => (
                <div key={index} className="border-l-4 border-[#FEBD69] pl-6">
                  <h3 className="text-xl font-bold text-white mb-4">{section.title}</h3>
                  <ul className="space-y-3">
                    {section.steps.map((step, stepIndex) => (
                      <li key={stepIndex} className="flex items-start gap-3 text-gray-300">
                        <span className="w-6 h-6 bg-[#FEBD69] text-[#131A22] rounded-full flex items-center justify-center text-sm font-bold mt-0.5 flex-shrink-0">
                          {stepIndex + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Guide */}
          <div className="bg-[#131A22] border border-[#232F3E] rounded-2xl p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 rounded-full bg-[#FEBD69] flex items-center justify-center text-3xl mb-4 mx-auto">
                👤
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">For Customers</h2>
              <p className="text-gray-300">Find and book the best services in your area</p>
            </div>

            <div className="space-y-8">
              {userGuides.customer.map((section, index) => (
                <div key={index} className="border-l-4 border-[#FEBD69] pl-6">
                  <h3 className="text-xl font-bold text-white mb-4">{section.title}</h3>
                  <ul className="space-y-3">
                    {section.steps.map((step, stepIndex) => (
                      <li key={stepIndex} className="flex items-start gap-3 text-gray-300">
                        <span className="w-6 h-6 bg-[#FEBD69] text-[#131A22] rounded-full flex items-center justify-center text-sm font-bold mt-0.5 flex-shrink-0">
                          {stepIndex + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="mt-12 bg-[#131A22] border border-[#232F3E] rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Quick Tips for Success</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: "💬", title: "Communication", tip: "Always respond promptly to messages and booking requests" },
              { icon: "⭐", title: "Quality", tip: "Focus on delivering exceptional service every time" },
              { icon: "📸", title: "Presentation", tip: "Use clear photos and detailed descriptions" }
            ].map((item, index) => (
              <div key={index} className="text-center p-6 bg-[#232F3E] rounded-xl border border-[#37475A]">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-gray-300">{item.tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link 
            href="/dashboard" 
            className="inline-block px-8 py-4 bg-[#FEBD69] text-[#131A22] rounded-xl font-bold text-lg hover:bg-[#e5a958] transition"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}