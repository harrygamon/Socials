export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-br from-lilac/10 via-white to-teal/10 py-8 px-4">
      <div className="w-full max-w-2xl mx-auto bg-white/90 rounded-2xl shadow-neumorph p-6 md:p-10">
        <h1 className="text-3xl md:text-4xl font-bold text-midnight mb-6 text-center">Terms of Service</h1>
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-purple mb-2">Introduction</h2>
          <p className="text-gray-700 leading-relaxed">
            Welcome to Social! By using our app, you agree to these Terms of Service. Please read them carefully. If you do not agree, please do not use Social.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-purple mb-2">User Responsibilities</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Provide accurate and up-to-date information on your profile</li>
            <li>Respect other users and communicate respectfully</li>
            <li>Do not use Social for any unlawful or harmful activities</li>
            <li>Do not impersonate others or misrepresent your identity</li>
            <li>Report inappropriate behavior or content to our team</li>
          </ul>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-purple mb-2">Account Termination</h2>
          <p className="text-gray-700 leading-relaxed">
            We reserve the right to suspend or terminate your account at any time if you violate these Terms or engage in harmful behavior. You may also delete your account at any time through your profile settings.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-purple mb-2">Limitation of Liability</h2>
          <p className="text-gray-700 leading-relaxed">
            Social is provided "as is" without warranties of any kind. We are not liable for any damages or losses resulting from your use of the app, interactions with other users, or technical issues. Use Social at your own risk.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-purple mb-2">Governing Law</h2>
          <p className="text-gray-700 leading-relaxed">
            These Terms are governed by the laws of your country of residence. Any disputes will be resolved in accordance with local laws and regulations.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-purple mb-2">Contact Information</h2>
          <p className="text-gray-700 leading-relaxed">
            If you have any questions about these Terms, please contact us at <a href="mailto:legal@social.app" className="text-teal underline">legal@social.app</a>.
          </p>
        </section>
      </div>
    </main>
  );
} 