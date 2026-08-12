import { ChevronRight, ShoppingBag } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useCartStore } from "../lib/cartStore";
import { motion, AnimatePresence } from "motion/react";

export function StickyCartBar() {
  const { totalItems, totalAmount } = useCartStore();

  if (totalItems === 0) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-4 left-0 right-0 z-40 px-4 pointer-events-none"
      >
        <div className="container max-w-5xl mx-auto flex justify-center">
          <div className="bg-[#1f8235]/90 backdrop-blur-xl border border-white/20 text-white p-3 sm:px-4 sm:py-3 rounded-2xl shadow-elevated w-full md:w-auto md:min-w-[400px] flex items-center justify-between pointer-events-auto cursor-pointer hover:bg-[#1a6e2d]/95 hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300">
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-sm leading-tight">{totalItems} {totalItems === 1 ? 'item' : 'items'}</p>
                <p className="text-xs text-white/80 font-medium">₹{totalAmount} plus taxes</p>
              </div>
            </div>

            <Link to="/dashboard/checkout" className="flex items-center gap-1 font-bold text-sm">
              View Cart <ChevronRight className="w-4 h-4" />
            </Link>
            
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
