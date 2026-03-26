import Header from "./header/Header";
import Footer from "./footer/Footer";
import ScrollUp from "../ui/ScrollUp";
import ChatbotTrigger from "../ui/ChatbotTrigger";

const Layout = ({children}) => {
  return (
    // FIX: Removed `relative` from the root wrapper — it was creating a 
    // stacking context that trapped Header's z-index inside it,
    // making it unable to compete with other positioned elements.
    <div className="min-h-screen">
      <Header />
      <main className="min-h-screen bg-white">{children}</main>
      <Footer />
      
      {/* THE ACTION STACK: z-[40] — MUST be lower than Header's z-50 */}
      {/* FIX: Was z-[100] which was covering the entire nav bar on 15-inch screens */}
      {/* FIX: pointer-events-none on wrapper so invisible areas never block clicks */}
      <div className="fixed bottom-8 right-8 z-[150] flex flex-col items-end gap-4 pointer-events-none">
        <ChatbotTrigger />
        <ScrollUp />
      </div>
    </div>
  );
};

export default Layout;
