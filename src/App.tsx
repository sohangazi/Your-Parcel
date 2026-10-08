import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider, useData } from './context/DataContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { NoticeBanner } from './components/layout/NoticeBanner';
import { Hero } from './components/home/Hero';
import { QuickQuoteCalculator } from './components/home/QuickQuoteCalculator';
import { HowItWorks } from './components/home/HowItWorks';
import { PopularDestinations } from './components/home/PopularDestinations';
import { ServicesSection } from './components/home/ServicesSection';
import { WhyChooseUs } from './components/home/WhyChooseUs';
import { CustomerReviews } from './components/home/CustomerReviews';
import { FaqSection } from './components/home/FaqSection';
import { TrackingView } from './components/tracking/TrackingView';
import { DestinationsView } from './components/destinations/DestinationsView';
import { PricingView } from './components/pricing/PricingView';
import { BlogView } from './components/blog/BlogView';
import { ContactView } from './components/contact/ContactView';
import { SendParcelModal } from './components/quote/SendParcelModal';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminShipments } from './components/admin/AdminShipments';
import { AdminQuotes } from './components/admin/AdminQuotes';
import { AdminPricing } from './components/admin/AdminPricing';
import { AdminCountries } from './components/admin/AdminCountries';
import { AdminProducts } from './components/admin/AdminProducts';
import { AdminCMS } from './components/admin/AdminCMS';
import { AdminBlog } from './components/admin/AdminBlog';
import { AdminMessages } from './components/admin/AdminMessages';
import { AdminActivityLogs } from './components/admin/AdminActivityLogs';
import { AdminSourceDeploy } from './components/admin/AdminSourceDeploy';
import { Package, Sparkles } from 'lucide-react';

const MainApp: React.FC = () => {
  const { isAdmin } = useAuth();
  const { loading, seedReady } = useData();

  // Public navigation: 'home' | 'quote' | 'destinations' | 'services' | 'track' | 'blog' | 'contact' | 'admin'
  const [currentTab, setCurrentTab] = useState<string>('home');

  // Admin section: 'dashboard' | 'shipments' | 'quotes' | 'pricing' | 'countries' | 'products' | 'cms' | 'blog' | 'messages' | 'logs' | 'deploy'
  const [adminSection, setAdminSection] = useState<string>('dashboard');

  // Modals state
  const [sendModalOpen, setSendModalOpen] = useState(false);
  const [sendModalPreset, setSendModalPreset] = useState<any>(undefined);
  const [trackNumberForView, setTrackNumberForView] = useState<string>('YP8840291BD');
  const [adminLoginModalOpen, setAdminLoginModalOpen] = useState(false);

  // Initial loading indicator with YOUR PARCEL logo animation (Section 31)
  if (loading && !seedReady) {
    return (
      <div className="min-h-screen bg-[#0C071E] flex flex-col items-center justify-center text-white space-y-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#3B1F80] via-[#5B2EAF] to-[#FF6B00] flex items-center justify-center shadow-xl shadow-orange-500/20 animate-bounce">
            <Package className="w-8 h-8 text-white" />
          </div>
          <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6B00] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-[#FF6B00]"></span>
          </span>
        </div>
        <div className="text-center space-y-1">
          <h2 className="text-xl font-black tracking-tight">
            YOUR <span className="text-[#FF6B00]">PARCEL</span>
          </h2>
          <p className="text-xs text-purple-300 font-mono">Synchronizing real-time logistics engine...</p>
        </div>
      </div>
    );
  }

  // Handle switching to Admin
  const handleNavChange = (tab: string) => {
    if (tab === 'admin') {
      if (!isAdmin) {
        setAdminLoginModalOpen(true);
        return;
      }
    }
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenSendModal = (preset?: any) => {
    setSendModalPreset(preset);
    setSendModalOpen(true);
  };

  const handleOpenTrackModal = (num?: string) => {
    if (num) {
      setTrackNumberForView(num);
    }
    setCurrentTab('track');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render Admin View if currentTab is 'admin' and user is authenticated
  if (currentTab === 'admin' && isAdmin) {
    return (
      <AdminLayout
        currentSection={adminSection}
        setCurrentSection={setAdminSection}
        onExitAdmin={() => setCurrentTab('home')}
      >
        {adminSection === 'dashboard' && <AdminDashboard onNavigate={setAdminSection} />}
        {adminSection === 'shipments' && <AdminShipments />}
        {adminSection === 'quotes' && <AdminQuotes />}
        {adminSection === 'pricing' && <AdminPricing />}
        {adminSection === 'countries' && <AdminCountries />}
        {adminSection === 'products' && <AdminProducts />}
        {adminSection === 'cms' && <AdminCMS />}
        {adminSection === 'blog' && <AdminBlog />}
        {adminSection === 'messages' && <AdminMessages />}
        {adminSection === 'logs' && <AdminActivityLogs />}
        {adminSection === 'deploy' && <AdminSourceDeploy />}
      </AdminLayout>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A051A] text-white flex flex-col font-sans selection:bg-[#FF6B00] selection:text-white w-full max-w-full overflow-x-hidden">
      {/* Top CMS Announcement Banner */}
      <NoticeBanner onActionClick={() => handleNavChange('quote')} />

      {/* Main Responsive Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={handleNavChange}
        openSendModal={() => handleOpenSendModal()}
        openTrackModal={handleOpenTrackModal}
      />

      {/* Main Public Content Switcher */}
      <main className="flex-1 w-full max-w-full overflow-x-hidden">
        {currentTab === 'home' && (
          <>
            <Hero
              onSendClick={() => handleOpenSendModal()}
              onTrackClick={() => handleNavChange('track')}
              onQuoteClick={() => {
                const el = document.getElementById('quick-quote');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            <QuickQuoteCalculator
              onBookParcel={(preset) => handleOpenSendModal(preset)}
            />

            <HowItWorks onBookClick={() => handleOpenSendModal()} />

            <PopularDestinations
              onSelectCountry={(countryId) => {
                handleOpenSendModal({ destinationCountryId: countryId });
              }}
            />

            <ServicesSection onBookService={() => handleOpenSendModal()} />

            <CustomerReviews />

            <FaqSection onContactClick={() => handleNavChange('contact')} />
          </>
        )}

        {currentTab === 'pricing' && (
          <PricingView
            onBookParcel={(preset) => handleOpenSendModal(preset)}
            onNavigateHome={() => handleNavChange('home')}
          />
        )}

        {currentTab === 'quote' && (
          <div className="py-12 bg-slate-950">
            <div className="max-w-4xl mx-auto px-4 text-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-black text-white">Dynamic Shipping Rate Calculator</h1>
              <p className="text-sm text-slate-400 mt-2">
                Calculate all-inclusive air freight rates from Bangladesh to destinations around the globe.
              </p>
            </div>
            <QuickQuoteCalculator onBookParcel={(preset) => handleOpenSendModal(preset)} />
          </div>
        )}

        {currentTab === 'destinations' && (
          <DestinationsView
            onSelectCountry={(countryId) => handleOpenSendModal({ destinationCountryId: countryId })}
          />
        )}

        {currentTab === 'services' && (
          <div className="py-8 bg-slate-950">
            <ServicesSection onBookService={() => handleOpenSendModal()} />
            <WhyChooseUs />
          </div>
        )}

        {currentTab === 'track' && (
          <TrackingView
            initialTrackingNumber={trackNumberForView}
            onClose={() => setCurrentTab('home')}
          />
        )}

        {currentTab === 'blog' && <BlogView />}

        {currentTab === 'contact' && <ContactView />}
      </main>

      {/* Global Comprehensive Footer */}
      <Footer
        setCurrentTab={handleNavChange}
        openSendModal={() => handleOpenSendModal()}
        openTrackModal={handleOpenTrackModal}
      />

      {/* Customer Send a Parcel Modal */}
      <SendParcelModal
        isOpen={sendModalOpen}
        onClose={() => setSendModalOpen(false)}
        preset={sendModalPreset}
      />

      {/* Secure Admin Login Modal */}
      <AdminLoginModal
        isOpen={adminLoginModalOpen}
        onClose={() => setAdminLoginModalOpen(false)}
        onSuccess={() => {
          setAdminLoginModalOpen(false);
          setCurrentTab('admin');
        }}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <MainApp />
      </DataProvider>
    </AuthProvider>
  );
}
