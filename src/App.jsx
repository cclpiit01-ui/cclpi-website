import { Routes, Route } from "react-router-dom";

// Layout and Security
import Layout from "@/components/layout/Layout";
import { AuthProvider } from "@/context/AuthContext";

// Public Pages
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
import Cof from "@/pages/publication/Cof";
import AnnualStatement from "@/pages/publication/AnnualStatement";
import CorporateGovernance from "@/pages/publication/CorporateGovernance";
import ArticleOfIncorporation from "@/pages/publication/ArticleOfIncorporation";
import Minutes from "@/pages/publication/Minutes";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import HRManagement from "@/pages/admin/HRManagement";
import DashboardHome from "@/pages/admin/DashboardHome";

export default function App() {
  return (
    <AuthProvider>
      <div className="bg-white min-h-screen">
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />}>
            <Route path="dashboard" element={<DashboardHome />} />
            <Route path="users" element={<div style={{color:"#013F99"}}>User Management — Coming Soon</div>} />
            <Route path="hr" element={<HRManagement />} />
            
          </Route>
          

          <Route path="/unauthorized" element={
            <div className="flex h-screen items-center justify-center">
              <h1 className="text-xl font-bold text-red-600">403 - Access Denied</h1>
            </div>
          } />

          {/* Public Routes */}
          <Route path="*" element={
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/privacy-statement" element={<PrivacyStatement />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/career" element={<Career />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/about/company-profile" element={<CompanyProfile />} />
                <Route path="/about/milestone" element={<Milestone />} />
                <Route path="/about/bod" element={<BOD />} />
                <Route path="/about/top-management" element={<TopManagement />} />
                <Route path="/about/stockholders" element={<Stockholders />} />
                <Route path="/products" element={<Product />} />
                <Route path="/products/payment" element={<Payment />} />
                <Route path="/products/mortuaries" element={<Mortuaries />} />
                <Route path="/products/claims" element={<Claims />} />
                <Route path="/news" element={<News />} />
                <Route path="/news/:id" element={<NewsDetail />} />
                <Route path="/news/social-media" element={<SocialMedia />} />
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
