import { Routes, Route } from "react-router-dom";

// Layout and Security Imports
import Layout from "@/components/layout/Layout";
import { AuthProvider } from "@/context/AuthContext";
import { RoleGuard } from "@/components/RoleGuard";

// Page Imports
import Home from "@/pages/Home";
import PrivacyStatement from "@/pages/PrivacyStatement";
import FAQ from "@/pages/FAQ";
import Career from "@/pages/Career";
import Contact from "@/pages/Contact";
import CompanyProfile from "@/pages/CompanyProfile";
import Milestone from "@/pages/Milestone";
import BOD from "@/pages/BOD";
import TopManagement from "@/pages/TopManagement";
import Stockholders from "@/pages/Stockholders";
import Product from "@/pages/Product";
import Mortuaries from "@/pages/Mortuaries";
import Claims from "@/pages/Claims";
import Payment from "@/pages/Payment";
import News from "@/pages/News";
import SocialMedia from "@/pages/SocialMedia";
import NewsDetail from "@/pages/NewsDetail";
import AnnualReports from "@/pages/publication/AnnualReports";
import Cof from "@/pages/publication/CertificateOfRegistration";
import AnnualStatement from "@/pages/publication/AnnualStatement";
import CorporateGovernance from "@/pages/publication/CorporateGovernance";
import ArticleOfIncorporation from "@/pages/publication/ArticleOfIncorporation";
import Minutes from "@/pages/publication/Minutes";

// Admin Imports
import AdminDashboard from "@/pages/AdminDashboard";
import AdminLogin from "@/pages/AdminLogin"; 

export default function App() {
  return (
    <AuthProvider>
      <div className="bg-white min-h-screen over">
        <Routes>
          {/* 1. Admin & Authentication Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          
          <Route element={<RoleGuard requiredPermission="dashboard_access" />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
          </Route>

          <Route path="/unauthorized" element={
            <div className="flex h-screen items-center justify-center">
              <h1 className="text-xl font-bold text-red-600">403 - Access Denied</h1>
            </div>
          } />

          {/* 2. Public Website Routes wrapped in Layout */}
          <Route path="*" element={
            <Layout>
              <Routes>
                {/* General Pages */}
                <Route path="/" element={<Home />}/>
                <Route path="/privacy-statement" element={<PrivacyStatement />}/>
                <Route path="/faq" element={<FAQ />}/>
                <Route path="/career" element={<Career />}/>
                <Route path="/contact" element={<Contact />}/>

                {/* About Section */}
                <Route path="/about/company-profile" element={<CompanyProfile/>}/>
                <Route path="/about/milestone" element={<Milestone/>}/>
                <Route path="/about/bod" element={<BOD/>}/>
                <Route path="/about/top-management" element={<TopManagement/>}/>
                <Route path="/about/stockholders" element={<Stockholders/>}/>

                {/* Products Section - Cleaned URLs */}
                <Route path="/products" element={<Product />} />
                <Route path="/products/payment" element={<Payment />} />
                <Route path="/products/mortuaries" element={<Mortuaries />} />
                <Route path="/products/claims" element={<Claims />} />

                {/* News Section - Cleaned URLs */}
                <Route path="/news" element={<News />} />
                <Route path="/news/:id" element={<NewsDetail />} />
                <Route path="/news/social-media" element={<SocialMedia />} />

                {/* Publication Section - Added missing slashes */}
                <Route path="/publication/annual-report" element={<AnnualReports />} />
                <Route path="/publication/cof" element={<Cof />} />
                <Route path="/publication/annual-statement" element={<AnnualStatement />} />
                <Route path="/publication/corporate-governance" element={<CorporateGovernance />} />
                <Route path="/publication/article-of-incorporation" element={<ArticleOfIncorporation />} />
                <Route path="/publication/minutes" element={<Minutes />} />
              </Routes>
            </Layout>
          } />
        </Routes>
      </div>
    </AuthProvider>
  );
}