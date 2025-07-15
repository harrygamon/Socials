export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen flex flex-col items-center bg-gradient-to-br from-lilac/10 via-white to-teal/10 py-8 px-4">
      <div className="w-full max-w-2xl bg-white/90 rounded-2xl shadow-neumorph p-6 md:p-10">
        <h1 className="text-3xl md:text-4xl font-bold text-midnight mb-6 text-center">Privacy Policy</h1>
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-purple mb-2">Introduction</h2>
          <p className="text-gray-700 leading-relaxed">
            Welcome to Social! Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information when you use our app. We’re committed to keeping your data safe and being transparent about our practices.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-purple mb-2">Data We Collect</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Profile information (name, age, bio, photos, interests)</li>
            <li>Contact details (email address)</li>
            <li>Usage data (likes, matches, messages, app activity)</li>
            <li>Device and log information (IP address, device type, browser)</li>
          </ul>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-purple mb-2">How We Use Your Data</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>To create and personalize your profile</li>
            <li>To connect you with matches and enable messaging</li>
            <li>To improve app features and user experience</li>
            <li>To keep our community safe and prevent misuse</li>
            <li>To send you important updates and notifications</li>
          </ul>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-purple mb-2">Your Rights</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Access and update your information at any time</li>
            <li>Request deletion of your account and data</li>
            <li>Control your notification and privacy settings</li>
            <li>Contact us with any privacy questions or concerns</li>
          </ul>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-purple mb-2">Contact Us</h2>
          <p className="text-gray-700 leading-relaxed">
            If you have any questions about this Privacy Policy or your data, please email us at <a href="mailto:privacy@social.app" className="text-teal underline">privacy@social.app</a>.
          </p>
        </section>
      </div>
    </main>
  );
} 