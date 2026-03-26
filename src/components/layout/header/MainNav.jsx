import { useState, useEffect, useRef } from "react"
import { FiSearch, FiGrid, FiMenu, FiX, FiChevronRight } from "react-icons/fi"
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom"
import ContactModal from "../../ContactModal"

const navItems = [
  { label: "HOME", to: "/" },
  {
    label: "ABOUT US",
    children: [
      { label: "Company Profile", to: "/about/company-profile" },
      { label: "Milestone", to: "/about/milestone" },
      {
        label: "Our Structure",
        children: [
          { label: "Board of Directors", to: "/about/bod" },
          { label: "Top Management", to: "/about/top-management" },
        ],
      },
      { label: "Stockholders Profile", to: "/about/stockholders" },
    ],
  },
  {
    label: "PRODUCT & SERVICES",
    children: [
      { label: "Product", to: "/products" },
      { label: "Payment Channels", to: "/products/payment" },
      { label: "Claims", to: "/products/claims" },
      { label: "Accredited Mortuaries", to: "/products/mortuaries" },
    ],
  },
  {
    label: "PUBLICATION",
    children: [
      { label: "Certificate of Registration", to: "/publication/cof" },
      { label: "Annual Statement", to: "/publication/annual-statement" },
      { label: "Corporate Governance", to: "/publication/corporate-governance" },
      { label: "Article of Incorporation", to: "/publication/article-of-incorporation" },
      { label: "Minutes", to: "/publication/minutes" },
      { label: "Annual Report", to: "/publication/annual-report" },
    ],
  },
  {
    label: "NEWS & UPDATES",
    children: [
      { label: "News", to: "/news" },
      { label: "Social Media", to: "/news/social-media" },
    ],
  },
  { label: "CAREER", to: "/career" },
  { label: "FAQ", to: "/faq" },
]

const flattenNav = (items) => {
  let flat = []
  items.forEach((item) => {
    if (item.to) flat.push({ label: item.label, to: item.to })
    if (item.children) flat = [...flat, ...flattenNav(item.children)]
  })
  return flat
}
const allPages = flattenNav(navItems)

export default function MainNav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [openSub, setOpenSub] = useState(null)
  const [openNested, setOpenNested] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [showResults, setShowResults] = useState(false)

  const location = useLocation()
  const navigate = useNavigate()
  const searchRef = useRef(null)
  const mobileSearchRef = useRef(null)

  useEffect(() => {
    setMenuOpen(false)
    setOpenSub(null)
    setOpenNested(null)
    setSearchQuery("")
    setShowResults(false)
  }, [location.pathname])

  useEffect(() => {
    const query = searchQuery.trim().toLowerCase()
    if (query === "") {
      setSearchResults([])
      setShowResults(false)
      return
    }
    const filtered = allPages.filter((page) =>
      page.label.toLowerCase().includes(query)
    )
    setSearchResults(filtered)
    setShowResults(true)
  }, [searchQuery])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false)
      }
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(e.target)) {
        setShowResults(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [menuOpen])

  const handleSearchSelect = (to) => {
    navigate(to)
    setSearchQuery("")
    setShowResults(false)
    setMenuOpen(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && searchResults.length > 0) {
      handleSearchSelect(searchResults[0].to)
    }
  }

  const isChildActive = (item) => {
    if (!item.children) return false
    return item.children.some((child) => {
      if (child.to === location.pathname) return true
      if (child.children)
        return child.children.some((gc) => gc.to === location.pathname)
      return false
    })
  }

  const handleCloseMenu = () => {
    setMenuOpen(false)
    setOpenSub(null)
    setOpenNested(null)
  }

  return (
    <>
      {/* Conditional mount + isOpen prop for safety */}
      {modalOpen && (
        <ContactModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      )}

      <div className="bg-brand-primary shadow-md border-b border-white/20 relative font-sans">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center">

          {/* MOBILE TOP BAR */}
          <div className="flex items-stretch w-full lg:hidden relative">
            <button
              type="button"
              className="bg-brand-primary px-4 flex items-center justify-center text-white shrink-0"
              onClick={() => menuOpen ? handleCloseMenu() : setMenuOpen(true)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>

            <div
              className="flex flex-1 items-center bg-brand-secondary/20 px-4 relative"
              ref={mobileSearchRef}
            >
              <FiSearch className="text-white shrink-0" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent text-white placeholder-white/70 outline-none px-3 py-3 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              {showResults && (
                <div className="absolute top-full left-0 right-0 bg-white shadow-2xl z-[60] border-t-4 border-brand-secondary overflow-hidden">
                  {searchResults.length > 0 ? (
                    <div className="max-h-[300px] overflow-y-auto">
                      {searchResults.map((result) => (
                        <button
                          key={result.to}
                          onClick={() => handleSearchSelect(result.to)}
                          className="w-full text-left px-5 py-4 text-brand-primary hover:bg-brand-surface group/item transition-all border-b border-slate-50"
                        >
                          <div className="text-[12px] font-black uppercase tracking-wider group-hover/item:text-brand-secondary transition-colors italic">
                            {result.label}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-tighter">
                            Go to page →
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="px-5 py-6 text-center bg-slate-50 text-slate-400 text-xs font-bold uppercase italic">
                      No matches found
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              type="button"
              className="bg-brand-primary px-4 flex items-center justify-center text-white  shrink-0"
              onClick={() => setModalOpen(true)}
              aria-label="Open contact modal"
            >
              <FiGrid size={20} />
            </button>
          </div>

          {/* MENU ITEMS */}
          <ul
            className={`relative z-40 flex-1 lg:flex lg:flex-row lg:items-stretch ${
              menuOpen
                ? "flex flex-col bg-brand-primary max-h-[calc(100vh-56px)] overflow-y-auto"
                : "hidden"
            }`}
          >
            {navItems.map((item, idx) => (
              <li
                key={item.label}
                className="relative lg:flex"
                onMouseEnter={() => setOpenSub(idx)}
                onMouseLeave={() => {
                  setOpenSub(null)
                  setOpenNested(null)
                }}
              >
                {item.to ? (
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      [
                        "flex items-center justify-between w-full px-6 py-4 text-white text-[12px] font-bold uppercase tracking-wider transition",
                        isActive
                          ? "bg-brand-secondary"
                          : "hover:bg-brand-surface hover:text-brand-secondary",
                      ].join(" ")
                    }
                    onClick={handleCloseMenu}
                  >
                    {item.label}
                  </NavLink>
                ) : (
                  <button
                    className={[
                      "flex items-center justify-between w-full px-6 py-4 text-white text-[12px] font-bold uppercase tracking-wider transition",
                      isChildActive(item) || openSub === idx
                        ? "bg-brand-secondary"
                        : "hover:bg-brand-surface hover:text-brand-secondary",
                    ].join(" ")}
                    onClick={() => setOpenSub(openSub === idx ? null : idx)}
                  >
                    {item.label}
                    <span className="ml-2 text-[12px] opacity-60">
                      {openSub === idx ? "▲" : "▼"}
                    </span>
                  </button>
                )}

                {/* SUB MENU (LEVEL 1) */}
                {item.children && (
                  <ul
                    className={`bg-white md:absolute md:left-0 md:top-full md:min-w-[260px] shadow-2xl z-50 border-t-4 border-brand-secondary ${
                      openSub === idx
                        ? "block animate-in fade-in slide-in-from-top-1"
                        : "hidden"
                    }`}
                  >
                    {item.children.map((sub, sIdx) => (
                      <li key={sub.label} className="relative group/nested">
                        {sub.children ? (
                          <>
                            <button
                              className="w-full flex items-center justify-between px-6 py-4 text-brand-primary hover:bg-brand-surface hover:text-brand-secondary transition font-bold text-[13px] uppercase border-b border-gray-50"
                              onClick={() =>
                                setOpenNested(openNested === sIdx ? null : sIdx)
                              }
                            >
                              {sub.label}
                              <FiChevronRight
                                className={`transition-transform ${
                                  openNested === sIdx ? "rotate-90" : ""
                                }`}
                              />
                            </button>

                            <ul
                              className={`bg-slate-50 md:absolute md:left-full md:top-[-4px] md:min-w-[240px] md:shadow-xl md:border-l-4 md:border-brand-accent animate-in md:slide-in-from-left-2 ${
                                openNested === sIdx ? "block" : "hidden"
                              }`}
                            >
                              {sub.children.map((gc) => (
                                <li key={gc.label}>
                                  <Link
                                    to={gc.to}
                                    className="block px-8 md:px-6 py-4 text-brand-primary hover:bg-brand-surface hover:text-brand-secondary transition font-bold text-[12px] uppercase border-b border-gray-100 last:border-0"
                                    onClick={handleCloseMenu}
                                  >
                                    {gc.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </>
                        ) : (
                          <Link
                            to={sub.to}
                            className="block px-6 py-4 text-brand-primary hover:bg-brand-surface hover:text-brand-secondary transition font-bold text-[13px] uppercase border-b border-gray-50 last:border-0"
                            onClick={handleCloseMenu}
                          >
                            {sub.label}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>

          {/* DESKTOP SEARCH & ACTIONS */}
          <div className="hidden lg:flex items-stretch">
            <div
              className="flex items-center bg-[#2c5faa] px-4 relative"
              ref={searchRef}
            >
              <FiSearch
                className={searchQuery ? "text-brand-accent" : "text-white/60"}
              />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent text-white placeholder-white/50 outline-none px-3 py-2 w-40 focus:w-64 transition-all duration-300 font-bold text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery && setShowResults(true)}
                onKeyDown={handleKeyDown}
              />
              {showResults && (
                <div className="absolute top-full right-0 w-80 bg-white shadow-2xl z-[60] border-t-4 border-brand-secondary rounded-b-xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                  {searchResults.length > 0 ? (
                    <div className="max-h-[400px] overflow-y-auto">
                      {searchResults.map((result) => (
                        <button
                          key={result.to}
                          onClick={() => handleSearchSelect(result.to)}
                          className="w-full text-left px-5 py-4 text-brand-primary hover:bg-brand-surface group/item transition-all border-b border-slate-50"
                        >
                          <div className="text-[12px] font-black uppercase tracking-wider group-hover/item:text-brand-secondary transition-colors italic">
                            {result.label}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-tighter">
                            Go to page →
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="px-5 py-8 text-center bg-slate-50 text-slate-400 text-xs font-bold uppercase italic">
                      No matches found
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              type="button"
              className="bg-brand-primary px-6 py-4 text-white hover:bg-brand-secondary transition-colors border-l border-white/10 "
              onClick={() => setModalOpen(true)}
            >
              <FiGrid size={20} />
            </button>
          </div>

        </div>
      </div>
    </>
  )
}
