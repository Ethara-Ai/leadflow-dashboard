import { useState, useRef, useEffect, memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { fontFamily } from '../../constants';

/**
 * Check if the device is mobile
 * @returns {boolean}
 */
const isMobileDevice = () => {
  return typeof window !== 'undefined' && window.innerWidth <= 768;
};

/**
 * Custom Dropdown Component
 * A reusable dropdown select component with icons support.
 *
 * @param {Object} props - Component props
 * @param {string} props.value - Currently selected value
 * @param {Array} props.options - Array of options with value, label, and optional icon
 * @param {function} props.onChange - Callback when selection changes
 * @param {boolean} props.isDark - Whether dark mode is enabled
 * @param {string} props.placeholder - Placeholder text when no selection
 * @param {React.ElementType} props.icon - Optional icon to display in the button
 */
const CustomDropdown = memo(function CustomDropdown({
  value,
  options,
  onChange,
  isDark,
  placeholder,
  icon: Icon,
  dropUp = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const optionsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-scroll modal upward on mobile when dropdown opens to show all options
  const scrollToShowDropdown = useCallback(() => {
    if (!isMobileDevice() || !dropdownRef.current) return;

    // Small delay to let the dropdown render
    setTimeout(() => {
      if (optionsRef.current && dropdownRef.current) {
        // Find the modal/scrollable parent
        const scrollableParent =
          dropdownRef.current.closest('.overflow-y-auto') ||
          dropdownRef.current.closest('[class*="overflow"]') ||
          dropdownRef.current.closest('form');

        if (scrollableParent) {
          const optionsRect = optionsRef.current.getBoundingClientRect();
          const parentRect = scrollableParent.getBoundingClientRect();

          // Calculate how much we need to scroll to show the dropdown options
          const optionsBottom = optionsRect.bottom;
          const parentBottom = parentRect.bottom;

          if (optionsBottom > parentBottom) {
            const scrollAmount = optionsBottom - parentBottom + 20; // 20px extra padding
            scrollableParent.scrollBy({
              top: scrollAmount,
              behavior: 'smooth',
            });
          }
        } else {
          // Fallback: scroll the dropdown button into view with offset for options
          dropdownRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        }
      }
    }, 50);
  }, []);

  // Trigger scroll when dropdown opens on mobile
  useEffect(() => {
    if (isOpen && isMobileDevice()) {
      scrollToShowDropdown();
    }
  }, [isOpen, scrollToShowDropdown]);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full p-2.5 rounded-lg border transition-all duration-150 flex items-center justify-between gap-1.5 text-left cursor-pointer ${
          isDark
            ? 'bg-zinc-800/50 border-zinc-700 text-zinc-200 hover:border-zinc-600'
            : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
        } ${isOpen ? 'ring-2 ring-blue-500/30 border-blue-500' : ''}`}
      >
        <div className="flex items-center gap-1.5 min-w-0">
          {Icon && <Icon size={12} className={isDark ? 'text-zinc-400' : 'text-slate-500'} />}
          <span className="text-sm truncate" style={{ fontFamily }}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown
          size={12}
          className={`transition-transform duration-150 shrink-0 ${isOpen ? (dropUp ? '' : 'rotate-180') : dropUp ? 'rotate-180' : ''} ${
            isDark ? 'text-zinc-400' : 'text-slate-500'
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={optionsRef}
            initial={{ opacity: 0, y: dropUp ? 8 : -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: dropUp ? 8 : -8, scale: 0.95 }}
            transition={{ duration: 0.12 }}
            className={`absolute ${dropUp ? 'bottom-full mb-1' : 'top-full mt-1'} left-0 right-0 py-0.5 rounded-lg border shadow-lg z-50 max-h-48 sm:max-h-40 overflow-y-auto scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${
              isDark ? 'bg-zinc-900 border-zinc-700' : 'bg-white border-slate-200'
            }`}
          >
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full px-2.5 py-2 text-left text-sm flex items-center gap-1.5 transition-colors cursor-pointer ${
                  value === option.value
                    ? isDark
                      ? 'bg-blue-950/60 text-blue-400'
                      : 'bg-blue-50 text-blue-600'
                    : isDark
                      ? 'text-zinc-300 hover:bg-zinc-700'
                      : 'text-slate-700 hover:bg-slate-50'
                }`}
                style={{ fontFamily }}
              >
                {option.icon && <option.icon size={14} />}
                {option.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

CustomDropdown.propTypes = {
  value: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.elementType,
    })
  ).isRequired,
  onChange: PropTypes.func.isRequired,
  isDark: PropTypes.bool.isRequired,
  placeholder: PropTypes.string,
  icon: PropTypes.elementType,
  dropUp: PropTypes.bool,
};

export default CustomDropdown;
