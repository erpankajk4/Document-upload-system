"use client";
import { useEffect, useState, ReactNode } from "react";
import { createPortal } from "react-dom";

interface PortalProps {
  children: ReactNode;
}

const Portal = ({ children }: PortalProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Only set mounted if we are in the client
    setMounted(typeof window !== "undefined");
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  // Only try to access document when on the client
  const portalElement = document.querySelector("#modal-portal");

  return portalElement ? createPortal(children, portalElement) : null;
};

export default Portal;
