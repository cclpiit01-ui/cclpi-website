import { useState } from "react";
import Header from "./header/Header";
import Footer from "./footer/Footer";
import ScrollUp from "../ui/ScrollUp";
import ChatbotTrigger from "../ui/ChatbotTrigger";

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
        <ChatbotTrigger moveDown={showScrollUp} />
        <ScrollUp onVisibilityChange={setShowScrollUp} />
      </div>
    </div>
  );
};

export default Layout;