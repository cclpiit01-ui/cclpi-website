import { useState } from "react";
import Header from "./header/Header";
import Footer from "./footer/Footer";
import ScrollUp from "../ui/ScrollUp";
import ChatbotTrigger from "../ui/ChatbotTrigger";

// Defaults to shown if the env var isn't set (e.g. local dev, or test.cclpi.com.ph).
// Set VITE_SHOW_CHATBOT=false in the production build to temporarily hide it there.
const SHOW_CHATBOT = import.meta.env.VITE_SHOW_CHATBOT !== "false";

const Layout = ({ children }) => {
  // Lift scroll visibility state here
  const [showScrollUp, setShowScrollUp] = useState(false);

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Header />
      <main className="bg-white">{children}</main>
      <Footer />

      <div className="fixed bottom-8 right-8 z-[150] flex flex-col items-end gap-4 pointer-events-none">
        {/* Pass showScrollUp so chatbot knows to move down */}
        {SHOW_CHATBOT && <ChatbotTrigger moveDown={showScrollUp} />}
        <ScrollUp onVisibilityChange={setShowScrollUp} />
      </div>
    </div>
  );
};

export default Layout;
