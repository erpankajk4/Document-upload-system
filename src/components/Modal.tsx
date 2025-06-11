"use client";
import React, { useEffect } from "react";
import Portal from "./Portal";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { AnimatePresence, motion } from "framer-motion";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
  handlePrevious?: () => void;
  handleNext?: () => void;
}

export default function Modal({ onClose, children, handlePrevious, handleNext }: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      } else if (event.key === "ArrowLeft" && handlePrevious) {
        handlePrevious();
      } else if (event.key === "ArrowRight" && handleNext) {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, handlePrevious, handleNext]);
  return (
    <Portal>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          // onTap={onClose}
          className="fixed inset-0 z-[99999999] grid cursor-pointer place-items-center overflow-y-scroll bg-black/10 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0, rotate: "12.5deg" }}
            animate={{ scale: 1, rotate: "0deg" }}
            exit={{ scale: 0, rotate: "0deg" }}
            // onTap={(e: any) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
            className="relative !w-auto px-2"
          >
            {/* Close button */}
            <button
              className="absolute right-3 top-2 z-[9999999] text-2xl text-gray-500 duration-300 hover:text-red-600"
              onClick={onClose}
            >
              <AiOutlineCloseCircle />
            </button>
            {/* Previous button */}
            {handlePrevious && (
              <button
                className="absolute left-3 top-1/2 z-[9999999] flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white text-2xl text-bg1 duration-300 hover:bg-bg1 hover:text-white"
                onClick={handlePrevious}
              >
                <IoIosArrowBack />
              </button>
            )}
            {/* Next button */}
            {handleNext && (
              <button
                className="absolute right-3 top-1/2 z-[9999999] flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white text-2xl text-bg1 duration-300 hover:bg-bg1 hover:text-white"
                onClick={handleNext}
              >
                <IoIosArrowForward />
              </button>
            )}
            {children}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </Portal>
  );
}

// <Modal
// handlePrevious={() =>
//   handleImageModal(
//     (selectedImageIndex - 1 + cachedImageUrls.length) %
//       cachedImageUrls.length
//   )
// }
//   handleNext={() =>
//     handleImageModal((selectedImageIndex + 1) % cachedImageUrls.length)
//   }
//   onClose={() => setIsModalOpen(false)}
// >
//   <Image
//     src={cachedImageUrls[selectedImageIndex]?.url}
//     alt={
//       cachedImageUrls[selectedImageIndex]?.file.name || "Selected image"
//     }
//     className="max-h-[90vh] w-auto rounded-md object-contain"
//     width={800}
//     height={800}
//   />
// </Modal>
