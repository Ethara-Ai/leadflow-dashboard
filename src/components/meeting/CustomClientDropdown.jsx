import { useState, useRef, useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { fontFamily } from '../../constants';

/**
 * Custom Client Dropdown Component
 * A searchable dropdown that allows selecting existing clients or typing a new client name.
 *
 * @param {Object} props - Component props
 * @param {string} props.value - Current client name value
 * @param {function} props.onChange - Callback when client name changes
 * @param {function} props.onEmailChange - Callback when client email should be updated
 * @param {boolean} props.isDark - Whether dark mode is enabled
 * @param {string} props.placeholder - Input placeholder text
 * @param {Array} props.clients - Array of existing clients with id, name, and email
 */
const CustomClientDropdown = memo(function CustomClientDropdown({
  value,
  onChange,
  onEmailChange,
  isDark,
  placeholder,
  clients = [],
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value || '');
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    setSearchTerm(value || '');
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    onChange(newValue);
    onEmailChange(''); // Clear email when typing custom name
    setIsOpen(true);
  };

  const handleClientSelect = (client) => {
    setSearchTerm(client.name);
    onChange(client.name);
    onEmailChange(client.email);
    setIsOpen(false);
  };

  const isExistingClient = clients.some(
    (client) => client.name.toLowerCase() === searchTerm.toLowerCase()
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className={`w-full p-2.5 pr-8 rounded-lg border text-sm transition-all ${
            isDark
              ? 'bg-zinc-800/50 border-zinc-700 text-zinc-200 placeholder-zinc-500 focus:border-blue-500'
              : 'bg-slate-50 border-slate-200 text-slate-700 placeholder-slate-400 focus:border-blue-500'
          } focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
            isOpen ? 'ring-2 ring-blue-500/30 border-blue-500' : ''
          }`}
          style={{ fontFamily }}
        />
        <ChevronDown
          size={14}
          className={`absolute right-2.5 top-1/2 -translate-y-1/2 transition-transform duration-150 pointer-events-none ${
            isOpen ? 'rotate-180' : ''
          } ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}
        />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.12 }}
            className={`absolute top-full left-0 right-0 mt-1 py-0.5 rounded-lg border shadow-lg z-50 max-h-48 overflow-y-auto scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${
              isDark ? 'bg-zinc-900 border-zinc-700' : 'bg-white border-slate-200'
            }`}
          >
            {filteredClients.length > 0 ? (
              <>
                <div
                  className={`px-2.5 py-1.5 text-xs font-semibold ${
                    isDark ? 'text-zinc-500' : 'text-slate-400'
                  }`}
                  style={{ fontFamily }}
                >
                  Existing Clients
                </div>
                {filteredClients.map((client) => (
                  <button
                    key={client.id}
                    type="button"
                    onClick={() => handleClientSelect(client)}
                    className={`w-full px-2.5 py-2 text-left text-sm flex flex-col transition-colors cursor-pointer ${
                      searchTerm.toLowerCase() === client.name.toLowerCase()
                        ? isDark
                          ? 'bg-blue-950/60 text-blue-400'
                          : 'bg-blue-50 text-blue-600'
                        : isDark
                          ? 'text-zinc-300 hover:bg-zinc-700'
                          : 'text-slate-700 hover:bg-slate-50'
                    }`}
                    style={{ fontFamily }}
                  >
                    <span className="font-medium">{client.name}</span>
                    <span className={`text-xs ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
                      {client.email}
                    </span>
                  </button>
                ))}
              </>
            ) : searchTerm.trim() ? (
              <div
                className={`px-2.5 py-3 text-sm text-center ${
                  isDark ? 'text-zinc-400' : 'text-slate-500'
                }`}
                style={{ fontFamily }}
              >
                <span className="block font-medium">New client</span>
                <span className="text-xs">Press Tab or click outside to confirm</span>
              </div>
            ) : (
              <div
                className={`px-2.5 py-3 text-sm text-center ${
                  isDark ? 'text-zinc-400' : 'text-slate-500'
                }`}
                style={{ fontFamily }}
              >
                Start typing to search or add new client
              </div>
            )}
            {searchTerm.trim() && !isExistingClient && filteredClients.length > 0 && (
              <div
                className={`px-2.5 py-2 text-xs border-t ${
                  isDark ? 'text-zinc-500 border-zinc-700' : 'text-slate-400 border-slate-100'
                }`}
                style={{ fontFamily }}
              >
                Press Tab to add &quot;{searchTerm}&quot; as new client
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

CustomClientDropdown.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onEmailChange: PropTypes.func.isRequired,
  isDark: PropTypes.bool.isRequired,
  placeholder: PropTypes.string,
  clients: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
    })
  ),
};

export default CustomClientDropdown;
