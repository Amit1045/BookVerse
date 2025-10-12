// BookDetail.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const BookDetail = ({ selectedBook, setSelectedBook }) => {
  if (!selectedBook) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setSelectedBook(null)}
      >
        <motion.div
          className="bg-white rounded-xl p-6 max-w-lg w-full shadow-lg overflow-y-auto max-h-[80vh]"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            onClick={() => setSelectedBook(null)}
          >
            <X size={24} />
          </button>

          <div className="flex flex-col items-center gap-4">
            <img
              src={`https://covers.openlibrary.org/b/id/${selectedBook.cover_id}-L.jpg`}
              alt={selectedBook.title}
              className="w-40 h-56 object-cover rounded-md"
            />
            <h2 className="text-2xl font-bold text-center">{selectedBook.title}</h2>
            <p className="text-gray-600 text-center">
              <strong>Author:</strong> {selectedBook.authors?.[0]?.name || "Unknown"}
            </p>
            <p className="text-gray-500 text-center">
              <strong>First Published:</strong> {selectedBook.first_publish_year || "N/A"}
            </p>
          </div>

          {selectedBook.subject && (
            <div className="mt-4 p-2 border rounded max-h-60 overflow-y-auto">
              <h3 className="font-semibold mb-2 text-gray-700">Subjects</h3>
              <p className="text-gray-700 text-sm">{selectedBook.subject.join(", ")}</p>
            </div>
          )}

          {selectedBook.description && (
            <div className="mt-4 p-2 border rounded max-h-60 overflow-y-auto">
              <h3 className="font-semibold mb-2 text-gray-700">Description</h3>
              <p className="text-gray-700 text-sm">
                {typeof selectedBook.description === "string"
                  ? selectedBook.description
                  : selectedBook.description.value}
              </p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BookDetail;
