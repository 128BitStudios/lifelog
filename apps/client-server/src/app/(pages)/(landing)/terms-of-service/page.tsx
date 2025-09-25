import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";

export default function TermsOfService() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-muted-foreground mb-8">
              Last updated: {new Date().toLocaleDateString()}
            </p>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p className="mb-4">
                By accessing and using LifeLog, you accept and agree to be bound by the terms 
                and provision of this agreement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Use License</h2>
              <p className="mb-4">
                Permission is granted to temporarily use LifeLog for personal, non-commercial 
                transitory viewing only. This is the grant of a license, not a transfer of title.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Privacy</h2>
              <p className="mb-4">
                Your privacy is important to us. Please review our Privacy Policy, which also 
                governs your use of the Service, to understand our practices.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. User Content</h2>
              <p className="mb-4">
                You retain ownership of your content. By using our service, you grant us permission 
                to store and process your content to provide the service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Contact Information</h2>
              <p className="mb-4">
                If you have any questions about these Terms of Service, please contact us.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}