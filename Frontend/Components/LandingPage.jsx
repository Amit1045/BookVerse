import React, { useEffect, useState } from "react";
import { BookOpen, Filter, Search, Library, X } from "lucide-react"; // Removed Sun, Moon
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import emailjs from "emailjs-com";

// Helper component for the services section (UI is already fine)
const ServicePage = () => {
  return (
    // DARK MODE: Main background change
    <div id="services" className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans transition-colors duration-500 py-12">
      <header className="text-center mb-12">
        {/* DARK MODE: Header text and border color change */}
        <h1 className="text-4xl font-extrabold text-blue-600 dark:text-blue-400 border-b-4 border-blue-200 dark:border-blue-700 inline-block pb-1">Our Services 🌟</h1>
      </header>

      <main className="max-w-6xl mx-auto px-6 space-y-12">
        <section className="grid md:grid-cols-3 gap-10">
          {/* Service Card 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            // DARK MODE: Card background, text, and border change
            className="bg-white dark:bg-gray-800 text-gray-800 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition transform hover:scale-[1.02] duration-300 border border-gray-100 dark:border-gray-700 text-center group"
          >
            {/* DARK MODE: Icon color is fine (explicitly blue-600) */}
            <BookOpen className="text-blue-600 mx-auto mb-4 group-hover:rotate-12 transition-transform" size={48} />
            {/* DARK MODE: Title text color change */}
            <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Instant Access</h3>
            {/* DARK MODE: Paragraph text color change */}
            <p className="text-gray-600 dark:text-gray-300">Access thousands of books instantly on any device. Start reading without any friction.</p>
          </motion.div>

          {/* Service Card 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            // DARK MODE: Card background, text, and border change
            className="bg-white dark:bg-gray-800 text-gray-800 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition transform hover:scale-[1.02] duration-300 border border-gray-100 dark:border-gray-700 text-center group"
          >
            {/* DARK MODE: Icon color is fine (explicitly purple-600) */}
            <Filter className="text-purple-600 mx-auto mb-4 group-hover:scale-110 transition-transform" size={48} />
            {/* DARK MODE: Title text color change */}
            <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Smart Filters</h3>
            {/* DARK MODE: Paragraph text color change */}
            <p className="text-gray-600 dark:text-gray-300">Filter books by genre, author, or popularity easily with our intuitive and powerful system.</p>
          </motion.div>

          {/* Service Card 3 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            // DARK MODE: Card background, text, and border change
            className="bg-white dark:bg-gray-800 text-gray-800 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition transform hover:scale-[1.02] duration-300 border border-gray-100 dark:border-gray-700 text-center group"
          >
            {/* DARK MODE: Icon color is fine (explicitly teal-600) */}
            <Library className="text-teal-600 mx-auto mb-4 group-hover:animate-bounce-slow" size={48} />
            {/* DARK MODE: Title text color change */}
            <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Community Library</h3>
            {/* DARK MODE: Paragraph text color change */}
            <p className="text-gray-600 dark:text-gray-300">Join a global network of readers, share insights, and discover new favorites together.</p>
          </motion.div>
        </section>

        <section className="text-center pt-8">
          {/* DARK MODE: Title text color change */}
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Why Choose BookVerse? 💡</h2>
          {/* DARK MODE: Paragraph text color change */}
          <p className="text-gray-700 dark:text-gray-300 max-w-3xl mx-auto text-lg">
            BookVerse is the unified platform for seamless book exploration, smart discovery, and a vibrant community. We are dedicated to enhancing your reading journey.
          </p>
        </section>
      </main>
    </div>
  );
};


const LandingPage = () => {
  const [search, setSearch] = useState("");
  const [genres, setGenres] = useState({});
  const [selectedBook, setSelectedBook] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeGenre, setActiveGenre] = useState("All");

  // Removed Theme State and Logic (theme, toggleTheme, useEffect)

  const genreList = ["fiction", "fantasy", "science", "adventure"];

  useEffect(() => {
    const fetchBooks = async () => {
      const data = {};
      for (const genre of genreList) {
        try {
          const res = await axios.get(
            `https://openlibrary.org/subjects/${genre}.json?limit=6`
          );
          data[genre] = res.data.works;
        } catch (error) {
          console.error(`Error fetching ${genre} books:`, error);
          data[genre] = []; // Fallback to empty array
        }
      }
      setGenres(data);
    };
    fetchBooks();
  }, []);

  // Updated search handler: triggers on form submit (Enter key)
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) {
      // If search is cleared, refetch initial genres
      if (Object.keys(genres).some(key => key.startsWith('Search:'))) {
        const initialFetch = async () => {
          const data = {};
          for (const genre of genreList) {
            const res = await axios.get(`https://openlibrary.org/subjects/${genre}.json?limit=6`);
            data[genre] = res.data.works;
          }
          setGenres(data);
          setActiveGenre("All");
        };
        initialFetch();
      }
      return;
    }

    try {
      const res = await axios.get(
        `https://openlibrary.org/search.json?q=${search}&limit=12`
      );
      // Ensure the search results are in a structured format for rendering
      const searchKey = `Search: ${search}`;
      setGenres({ [searchKey]: res.data.docs });
      setActiveGenre("All");
    } catch (error) {
      console.error("Error fetching search results:", error);
      setGenres({ [`Search: ${search}`]: [] });
    }
  };

  const whatsappNumber = "919667385995";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=Hi!%20I%20want%20to%20know%20more%20about%20BookVerse.`;

  // Fix: When searching, we only show the search results, so we check if the genre is in the list
  const filteredGenres =
    activeGenre === "All"
      ? Object.keys(genres)
      : Object.keys(genres).filter((g) => g.toLowerCase().includes(activeGenre));

  // --- JSX Rendering ---
  return (
    // DARK MODE: Main background and text color change
    <div className="min-h-screen flex flex-col font-sans bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 overflow-x-hidden transition-colors duration-500">

      {/* Navbar */}
      {/* DARK MODE: Header background and shadow change */}
      <header className="flex flex-col md:flex-row justify-between items-center p-4 md:p-6 bg-white dark:bg-gray-800 shadow-xl dark:shadow-2xl sticky top-0 z-50 transition-colors duration-500">
        
        {/* Logo and Theme Toggle */}
        <div className="flex items-center justify-between w-full md:w-auto mb-3 md:mb-0">
          {/* DARK MODE: Logo text color change */}
          <h1 className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 flex items-center gap-2 hover:scale-105 transition-transform duration-300 cursor-pointer">
            <Library className="text-indigo-500" size={30}/> BookVerse
          </h1>

          {/* Theme Switcher for mobile/desktop - REMOVED */}
        </div>

        {/* Centered Search + Filter */}
        <div className="flex-1 flex justify-center relative w-full md:w-auto mb-3 md:mb-0 mx-4">
          <form
            onSubmit={handleSearch}
            className="relative w-full max-w-lg flex items-center"
          >
            {/* DARK MODE: Search icon color change */}
            <Search className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Search books..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              // DARK MODE: Input background, border, and text color change
              className="w-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl py-2 pl-10 pr-28 focus:outline-none focus:ring-4 focus:ring-blue-500/50 shadow-inner transition duration-300 placeholder-gray-500 dark:placeholder-gray-400"
            />
            {/* Filter Button (Styled as a dropdown toggle) - NOW FILLS THE RIGHT SIDE */}
            <button
              type="button"
              onClick={() => setFilterOpen(!filterOpen)}
              // right-0 and h-full to make it fill the right side, replaces the Search button
              className="absolute right-0 top-0 h-full bg-indigo-500 text-white px-5 rounded-r-xl text-md hover:bg-indigo-600 transition transform flex items-center gap-2 justify-center shadow-md"
            >
              <Filter size={18}/> 
              <span className="capitalize font-semibold text-sm">
                {activeGenre === "All" ? "Filter" : activeGenre.length > 8 ? activeGenre.slice(0, 8) + '...' : activeGenre}
              </span>
            </button>
            {/* REMOVED SEARCH BUTTON */}

            {/* Filter Dropdown inside search */}
            <AnimatePresence>
              {filterOpen && (
                <motion.ul
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  // DARK MODE: Dropdown background, border, and shadow change
                  className="absolute right-0 top-12 md:top-14 w-40 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-2xl z-50 overflow-hidden"
                >
                  <li
                    onClick={() => {
                      setActiveGenre("All");
                      setFilterOpen(false);
                    }}
                    // DARK MODE: List item colors and hover effect change
                    className={`px-4 py-3 hover:bg-blue-50 dark:hover:bg-blue-900/50 cursor-pointer text-gray-800 dark:text-gray-200 ${activeGenre === "All" ? "bg-blue-100 dark:bg-blue-900 font-semibold" : ""
                      }`}
                  >
                    All Genres
                  </li>
                  {genreList.map((g) => (
                    <li
                      key={g}
                      onClick={() => {
                        setActiveGenre(g);
                        setFilterOpen(false);
                      }}
                      // DARK MODE: List item colors and hover effect change
                      className={`px-4 py-3 hover:bg-blue-50 dark:hover:bg-blue-900/50 cursor-pointer capitalize text-gray-800 dark:text-gray-200 ${activeGenre === g ? "bg-blue-100 dark:bg-blue-900 font-semibold" : ""
                        }`}
                    >
                      {g}
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </form>
        </div>

        {/* Navbar Links + Theme Toggle */}
        {/* DARK MODE: Nav link text color and hover change */}
        <nav className="flex items-center gap-6 text-gray-700 dark:text-gray-300 font-semibold transition-colors">
          <a href="#services" className="hover:text-blue-600 dark:hover:text-blue-400 transition transform hover:scale-105">
            Services
          </a>
          <a href="#contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition transform hover:scale-105">
            Contact
          </a>
          {/* Theme Switcher for desktop - REMOVED */}
        </nav>
      </header>
      
      {/* Hero Section */}
      {/* DARK MODE: Hero background gradient change */}
      <section className="text-center py-24 px-6 relative overflow-hidden bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-500">
        
        {/* Dynamic Gradient Shapes */}
        <motion.div
          // DARK MODE: Shape colors and opacity change
          className="absolute top-0 left-1/4 w-72 h-72 bg-purple-400 dark:bg-purple-600 rounded-full mix-blend-multiply filter blur-[70px] opacity-20 dark:opacity-30 animate-pulse-slow"
          animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
        />
        <motion.div
          // DARK MODE: Shape colors and opacity change
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-400 dark:bg-blue-600 rounded-full mix-blend-multiply filter blur-[70px] opacity-20 dark:opacity-30 animate-pulse-slow"
          animate={{ rotate: [0, -360], scale: [1, 0.8, 1] }}
          transition={{ repeat: Infinity, duration: 80, ease: "linear" }}
        />

        <motion.h2
          // DARK MODE: Title text color change
          className="text-6xl md:text-7xl font-extrabold mb-6 relative z-10 text-gray-900 dark:text-white leading-tight"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          Discover & Read With <span className="text-blue-600 dark:text-blue-400">BookVerse</span> 📚
        </motion.h2>
        <motion.p
          // DARK MODE: Paragraph text color change
          className="text-gray-700 dark:text-gray-300 text-xl md:text-2xl max-w-3xl mx-auto relative z-10 font-light"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
        >
          Explore books from all genres — fiction, fantasy, romance, and beyond. Dive into stories that inspire imagination.
        </motion.p>
      </section>

      {/* Genre Sections */}
      <section className="max-w-7xl mx-auto px-6 py-16 space-y-20">
        {filteredGenres.map((genre) => (
          <motion.div
            key={genre}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.8 }}
          >
            {/* DARK MODE: Section title color change */}
            <h3 className="text-4xl font-bold capitalize mb-10 text-gray-900 dark:text-white border-b-4 border-blue-400/50 pb-2 inline-block">{genre} Books</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8">
              {genres[genre] && genres[genre].map((book) => (
                <motion.div
                  key={book.key}
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedBook(book)}
                  // DARK MODE: Card background, border, and shadow change
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-xl border border-gray-100 dark:border-gray-700 transition duration-300 p-5 text-center cursor-pointer flex flex-col justify-between"
                >
                  <img
                    src={`https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`} // Changed to medium size for better quality
                    alt={book.title}
                    className="w-full h-auto max-h-56 object-contain mx-auto rounded-lg mb-4 shadow-md transition-transform"
                  />
                  <div className="flex-grow">
                    {/* DARK MODE: Title text color change */}
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1 truncate">{book.title}</h4>
                    {/* DARK MODE: Author text color change */}
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 italic">{book.authors?.[0]?.name || "N/A"}</p>
                  </div>
                  <button
                    className="mt-auto bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-2 rounded-full font-semibold hover:from-indigo-600 hover:to-blue-500 transition transform shadow-md"
                  >
                    View Details
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
        {/* No Results Message */}
        {filteredGenres.length === 0 && (
          <div className="text-center py-10">
            <p className="text-2xl font-semibold text-red-500">No results found for {activeGenre === "All" ? "your query" : `the genre "${activeGenre}"`}.</p>
            {/* DARK MODE: Helper text color change */}
            <p className="text-gray-600 dark:text-gray-400 mt-2">Try a different search term or genre filter.</p>
          </div>
        )}
      </section>

      {/* Book Detail Modal */}
      <AnimatePresence>
        {selectedBook && (
          <motion.div
            // DARK MODE: Modal backdrop change
            className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-[100]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedBook(null)}
          >
            <motion.div
              // DARK MODE: Modal background change
              className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-lg w-full relative shadow-[0_0_40px_rgba(0,0,0,0.3)] transition-colors duration-500"
              initial={{ y: 50, scale: 0.8 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 50, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                // DARK MODE: Close button background/text change
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full bg-gray-100 dark:bg-gray-700 dark:hover:text-red-400"
                onClick={() => setSelectedBook(null)}
              >
                <X size={24} />
              </button>
              
              <div className="flex flex-col items-center">
                <img
                  src={`https://covers.openlibrary.org/b/id/${selectedBook.cover_id}-L.jpg`}
                  alt={selectedBook.title}
                  // DARK MODE: Border color around cover change
                  className="w-40 h-60 object-cover rounded-xl mb-6 shadow-xl border-4 border-white dark:border-gray-700"
                />
                {/* DARK MODE: Title text color change */}
                <h2 className="text-3xl font-bold text-center mb-2 text-gray-900 dark:text-white">{selectedBook.title}</h2>
                {/* DARK MODE: Author text color change */}
                <p className="text-lg font-medium text-blue-600 dark:text-blue-400 text-center mb-4">
                  {selectedBook.authors?.[0]?.name || "Unknown Author"}
                </p>
                {/* DARK MODE: Publish year text color change */}
                <p className="text-gray-500 dark:text-gray-400 text-center mb-4">
                  First Published: <span className="font-semibold">{selectedBook.first_publish_year || "N/A"}</span>
                </p>
                
                {selectedBook.subject && selectedBook.subject.length > 0 ? (
                  <div 
                    // DARK MODE: Subject box background, text, and border change
                    className="max-h-40 overflow-y-auto text-gray-700 dark:text-gray-300 text-sm text-center bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 w-full"
                  >
                    <p className="font-semibold mb-2 text-base">Subjects:</p>
                    {selectedBook.subject.slice(0, 10).join(" • ")}
                  </div>
                ) : <p className="text-gray-500 dark:text-gray-400 text-center italic">No subjects listed.</p>}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Services Section */}
      <ServicePage />

      {/* Contact Section */}
      {/* DARK MODE: Contact section background gradient change */}
      <section id="contact" className="py-24 bg-gradient-to-t from-gray-100 to-white dark:from-gray-900 dark:to-gray-800 text-center relative overflow-hidden transition-colors duration-500">
        
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <motion.h3
            // DARK MODE: Title text color change
            className="text-5xl font-extrabold mb-4 text-gray-900 dark:text-white"
            initial={{ y: -20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Get In Touch 📧
          </motion.h3>

          <motion.p
            // DARK MODE: Paragraph text color change
            className="text-gray-600 dark:text-gray-300 mb-12 text-xl max-w-2xl mx-auto"
            initial={{ y: 10, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            Have questions or suggestions? Send us a message — we’ll reply soon!
          </motion.p>

          <motion.form
            onSubmit={(e) => {
              e.preventDefault();
              emailjs
                .sendForm(
                  "service_lbxui2g", // Your Service ID
                  "template_sdh30mi", // Your Template ID
                  e.target,
                  "Je3r7ntyBlLGQRxAh" // Your User ID
                )
                .then(
                  () => {
                    alert("Message sent successfully! Thank you.");
                    e.target.reset();
                  },
                  (error) => {
                    console.error("EmailJS Error:", error.text);
                    alert("Failed to send message. Please check the console or try again later.");
                  }
                );
            }}
            // DARK MODE: Form background, shadow, and border change
            className="bg-white dark:bg-gray-800 shadow-3xl dark:shadow-xl rounded-3xl p-10 space-y-8 text-left border border-gray-200 dark:border-gray-700 transition-colors"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Input with Floating Label - Name */}
            <div className="relative group">
              <input
                type="text"
                name="user_name"
                required
                id="user_name"
                // DARK MODE: Input text color change (background is transparent)
                className="w-full border-b-2 border-gray-300 dark:border-gray-600 bg-transparent focus:border-blue-500 outline-none py-3 transition text-gray-900 dark:text-white"
                placeholder="Your Name"
              />
              {/* DARK MODE: Label text color change */}
              <label htmlFor="user_name" className="absolute left-0 -top-4 text-sm font-medium text-gray-500 dark:text-gray-400 transition-all duration-300 pointer-events-none transform origin-left group-focus-within:text-blue-500 group-focus-within:scale-100 group-hover:scale-105">
                Your Name
              </label>
            </div>

            {/* Input with Floating Label - Email */}
            <div className="relative group">
              <input
                type="email"
                name="user_email"
                required
                id="user_email"
                // DARK MODE: Input text color change (background is transparent)
                className="w-full border-b-2 border-gray-300 dark:border-gray-600 bg-transparent focus:border-blue-500 outline-none py-3 transition text-gray-900 dark:text-white"
                placeholder="Your Email"
              />
              {/* DARK MODE: Label text color change */}
              <label htmlFor="user_email" className="absolute left-0 -top-4 text-sm font-medium text-gray-500 dark:text-gray-400 transition-all duration-300 pointer-events-none transform origin-left group-focus-within:text-blue-500 group-focus-within:scale-100 group-hover:scale-105">
                Your Email
              </label>
            </div>

            {/* Textarea with Floating Label - Message */}
            <div className="relative group">
              <textarea
                name="message"
                required
                id="message"
                rows="5"
                // DARK MODE: Textarea border and text color change
                className="w-full border-2 border-gray-300 dark:border-gray-600 bg-transparent focus:border-blue-500 outline-none p-3 rounded-lg transition resize-none text-gray-900 dark:text-white"
                placeholder=" " // Important for the label animation
              ></textarea>
              <label 
                htmlFor="message" 
                // DARK MODE: Label text and background color change
                className="absolute left-3 -top-2.5 text-sm font-medium text-gray-500 dark:text-gray-400 transition-all duration-300 bg-white dark:bg-gray-800 px-1 pointer-events-none transform origin-left group-focus-within:text-blue-500 group-focus-within:-top-2.5 group-hover:scale-105"
              >
                Your Message
              </label>
            </div>

            <motion.button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-4 rounded-xl shadow-lg hover:from-indigo-700 hover:to-blue-600 transform hover:scale-[1.01] transition-all duration-300 font-bold text-lg"
              whileHover={{ scale: 1.01, boxShadow: "0 10px 20px rgba(66, 153, 225, 0.5)" }}
              whileTap={{ scale: 0.98 }}
            >
              Send Message
            </motion.button>
          </motion.form>
        </div>
      </section>


      {/* WhatsApp Floating Button - No dark mode needed, it's green */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-50 bg-green-500 w-16 h-16 rounded-full flex items-center justify-center text-white shadow-2xl hover:bg-green-600 hover:scale-110 transition-transform duration-300 ring-4 ring-green-300/50"
        title="Chat on WhatsApp"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-8 h-8"
        >
          <path d="M20.52 3.48A11.87 11.87 0 0012 0C5.37 0 0 5.37 0 12c0 2.12.55 4.13 1.6 5.9L0 24l6.2-1.6a11.85 11.85 0 005.8 1.6c6.63 0 12-5.37 12-12 0-3.18-1.24-6.17-3.48-8.52zm-8.51 18a9.78 9.78 0 01-5.07-1.4l-.36-.21-3.68.96.98-3.58-.23-.36A9.78 9.78 0 012.5 12c0-5.25 4.25-9.5 9.5-9.5 2.54 0 4.93.99 6.73 2.79a9.49 9.49 0 012.79 6.72c0 5.25-4.25 9.5-9.5 9.5zm5.31-7.14c-.29-.15-1.72-.85-1.99-.94-.27-.1-.47-.15-.67.15-.19.29-.74.94-.91 1.13-.17.19-.34.21-.63.07-.29-.15-1.23-.45-2.35-1.45-.87-.77-1.46-1.73-1.63-2.02-.17-.29-.02-.45.13-.6.13-.13.29-.34.43-.51.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.51-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51-.17-.01-.36-.01-.55-.01-.19 0-.5.07-.76.36-.27.29-1.03 1-1.03 2.44s1.06 2.83 1.21 3.03c.15.19 2.09 3.2 5.07 4.49.71.31 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.08 1.72-.7 1.97-1.38.25-.69.25-1.28.17-1.38-.07-.1-.27-.15-.55-.29z" />
        </svg>
      </a>

      {/* Footer */}
      {/* DARK MODE: Footer background is already gray-900 (good for dark mode) */}
      <footer className="bg-gray-900 text-gray-300 pt-12 pb-6 transition-colors duration-500 border-t border-white">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-10">
          
          {/* Company Info */}
          <div>
            <h2 className="text-3xl font-bold text-blue-400 mb-4">BookVerse</h2>
            <p className="text-gray-400 text-sm">
              Explore books from all genres, get recommendations, and connect with a global community of readers. Your next great read starts here.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li><a href="#services" className="text-gray-400 hover:text-blue-500 transition transform hover:translate-x-1">Services</a></li>
              <li><a href="#contact" className="text-gray-400 hover:text-blue-500 transition transform hover:translate-x-1">Contact</a></li>
              <li><a href="#home" className="text-gray-400 hover:text-blue-500 transition transform hover:translate-x-1">Home</a></li>
            </ul>
          </div>

          {/* Genres (Expanded) */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Top Genres</h3>
            <ul className="space-y-3 capitalize">
              {genreList.map(g => (
                <li key={g}><a href={`#${g}`} className="text-gray-400 hover:text-blue-500 transition transform hover:translate-x-1">{g}</a></li>
              ))}
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Follow Us</h3>
            <div className="flex gap-4 mt-4 text-white">
              <a href="#" className="p-2 rounded-full bg-gray-700 hover:bg-blue-600 transition transform hover:scale-110" title="Facebook">
                FB
              </a>
              <a href="#" className="p-2 rounded-full bg-gray-700 hover:bg-blue-600 transition transform hover:scale-110" title="Twitter">
                TW
              </a>
              <a href="#" className="p-2 rounded-full bg-gray-700 hover:bg-blue-600 transition transform hover:scale-110" title="Instagram">
                IG
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-6 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} BookVerse. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;