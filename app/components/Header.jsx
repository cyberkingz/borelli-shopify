import {Suspense} from 'react';
import {Await, NavLink, useAsyncValue} from '@remix-run/react';
import {useAnalytics} from '@shopify/hydrogen';
import {useAside} from '~/components/Aside';
import logo from '../assets/barker-logo-black.png';
import {
  UserIcon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import {useState, useEffect} from 'react';

/**
 * @param {HeaderProps}
 */
export function Header({header, isLoggedIn, cart, publicStoreDomain}) {
  const {shop, menu} = header;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on screen resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);

  // Handle mobile menu toggle
  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    // Prevent body scroll when menu is open
    document.body.style.overflow = !isMobileMenuOpen ? 'hidden' : '';
  };

  // Handle mobile menu close
  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
    document.body.style.overflow = '';
  };

  return (
    <header className="relative">
      {/* Desktop Header */}
      <div className="header flex items-center justify-between px-6 py-3">
        <div className="w-40 flex items-center gap-4">
          <button 
            className="md:hidden text-gray-700 hover:text-gray-900"
            onClick={handleMobileMenuToggle}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
          <NavLink prefetch="intent" to="/" style={activeLinkStyle} end>
            <img src={logo} alt={shop.name} className="h-8 w-auto" />
          </NavLink>
        </div>
        <div className="flex-1 flex justify-center">
          <HeaderMenu
            menu={menu}
            viewport="desktop"
            primaryDomainUrl={header.shop.primaryDomain.url}
            publicStoreDomain={publicStoreDomain}
          />
        </div>
        <div className="w-40 flex justify-end items-center gap-4">
          {/* <NavLink 
            prefetch="intent" 
            to="/account" 
            className="text-gray-700 hover:text-gray-900"
            style={activeLinkStyle}
          >
            <UserIcon className="h-6 w-6" />
          </NavLink> */}
         
          <CartToggle cart={cart} />
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`fixed inset-0 z-50 transition-all duration-300 ${
          isMobileMenuOpen ? 'visible' : 'invisible'
        } md:hidden`}
      >
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-black transition-opacity duration-300 ${
            isMobileMenuOpen ? 'opacity-50' : 'opacity-0'
          }`}
          onClick={handleMobileMenuClose}
        />
        
        {/* Menu Panel */}
        <div 
          className={`absolute left-0 top-0 h-full w-full max-w-sm bg-white transform transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center px-6 py-3 border-b">
              <NavLink prefetch="intent" to="/" onClick={handleMobileMenuClose}>
                <img src={logo} alt={shop.name} className="h-8 w-auto" />
              </NavLink>
              <button 
                className="text-gray-700 hover:text-gray-900 p-2"
                onClick={handleMobileMenuClose}
                aria-label="Close menu"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex-1 px-6 py-8 overflow-y-auto">
              <HeaderMenu
                menu={menu}
                viewport="mobile"
                primaryDomainUrl={header.shop.primaryDomain.url}
                publicStoreDomain={publicStoreDomain}
                onItemClick={handleMobileMenuClose}
              />
            </nav>
            <div className="border-t px-6 py-4">
              <div className="flex items-center gap-4">
                <NavLink 
                  to="/account" 
                  className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
                  onClick={handleMobileMenuClose}
                >
                  <UserIcon className="h-5 w-5" />
                  <span>Account</span>
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

/**
 * @param {{
 *   menu: HeaderProps['header']['menu'];
 *   primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
 *   viewport: Viewport;
 *   publicStoreDomain: HeaderProps['publicStoreDomain'];
 * }}
 */
export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
  onItemClick,
}) {
  const className = `header-menu-${viewport}`;
  const {close} = useAside();

  const menuItems = (menu || FALLBACK_HEADER_MENU).items;
  const hasHomeLink = menuItems.some(
    (item) => item.title.toLowerCase() === 'home' || item.url === '/'
  );

  return (
    <nav className={className} role="navigation">
      {viewport === 'mobile' && !hasHomeLink && (
        <NavLink
          end
          onClick={onItemClick}
          prefetch="intent"
          style={activeLinkStyle}
          to="/"
        >
          Home
        </NavLink>
      )}
      {menuItems.map((item) => {
        if (!item.url) return null;

        // if the url is internal, we strip the domain
        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        return (
          <NavLink
            className="header-menu-item"
            end
            key={item.id}
            onClick={onItemClick}
            prefetch="intent"
            style={activeLinkStyle}
            to={url}
          >
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}

/**
 * @param {Pick<HeaderProps, 'isLoggedIn' | 'cart'>}
 */
function HeaderCtas({isLoggedIn, cart}) {
  return (
    <nav className="header-ctas" role="navigation">
      <HeaderMenuMobileToggle />
      <NavLink prefetch="intent" to="/account" style={activeLinkStyle}>
        <Suspense fallback="Sign in">
          <Await resolve={isLoggedIn} errorElement="Sign in">
            {(isLoggedIn) => (isLoggedIn ? 'Account' : 'Sign in')}
          </Await>
        </Suspense>
      </NavLink>
      <SearchToggle />
      <CartToggle cart={cart} />
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  const {open} = useAside();
  return (
    <button
      className="header-menu-mobile-toggle reset"
      onClick={() => open('mobile')}
    >
      <h3>☰</h3>
    </button>
  );
}

function SearchToggle() {
  const {open} = useAside();
  return (
    <button className="reset" onClick={() => open('search')}>
      Search
    </button>
  );
}

/**
 * @param {{count: number | null}}
 */
function CartBadge({count}) {
  return (
    <div
      className={`${
        count ? 'bg-black text-white' : 'bg-gray-100'
      } absolute bottom-1 right-1 text-[0.625rem] font-medium subpixel-antialiased h-3 min-w-[0.75rem] flex items-center justify-center leading-none text-center rounded-full w-auto px-[0.125rem] pb-px`}
    >
      <span>{count || 0}</span>
    </div>
  );
}

/**
 * @param {Pick<HeaderProps, 'cart'>}
 */
function CartToggle({cart}) {
  const {open} = useAside();

  return (
    <div className="relative">
      <button
        onClick={() => {
          open('cart');
        }}
        className="relative flex items-center justify-center w-8 h-8"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-5 h-5"
        >
          <title>Bag</title>
          <path
            fillRule="evenodd"
            d="M8.125 5a1.875 1.875 0 0 1 3.75 0v.375h-3.75V5Zm-1.25.375V5a3.125 3.125 0 1 1 6.25 0v.375h3.5c.69 0 1.25.56 1.25 1.25v11.25c0 .69-.56 1.25-1.25 1.25H3.375c-.69 0-1.25-.56-1.25-1.25V6.625c0-.69.56-1.25 1.25-1.25h3.5ZM3.375 19.125h13.25a.625.625 0 0 0 .625-.625V6.625a.625.625 0 0 0-.625-.625H3.375a.625.625 0 0 0-.625.625v11.875c0 .345.28.625.625.625Z"
            clipRule="evenodd"
          />
        </svg>
        <Suspense fallback={<CartBadge count={null} />}>
          <Await resolve={cart}>
            <CartBanner />
          </Await>
        </Suspense>
      </button>
    </div>
  );
}

function CartBanner() {
  const cart = useAsyncValue();
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'CLOTHING',
      type: 'HTTP',
      url: '/collections/all',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null,
      tags: [],
      title: 'FOOTWEAR',
      type: 'HTTP',
      url: '/collections/footwear',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'Policies',
      type: 'HTTP',
      url: '/policies',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: null,
      tags: [],
      title: 'ABOUT',
      type: 'HTTP',
      url: '/about',
      items: [],
    },
  ],
};

/**
 * @param {{
 *   isActive: boolean;
 *   isPending: boolean;
 * }}
 */
function activeLinkStyle({isActive, isPending}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : 'black',
  };
}

/** @typedef {'desktop' | 'mobile'} Viewport */
/**
 * @typedef {Object} HeaderProps
 * @property {HeaderQuery} header
 * @property {Promise<CartApiQueryFragment|null>} cart
 * @property {Promise<boolean>} isLoggedIn
 * @property {string} publicStoreDomain
 */

/** @typedef {import('@shopify/hydrogen').CartViewPayload} CartViewPayload */
/** @typedef {import('storefrontapi.generated').HeaderQuery} HeaderQuery */
/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
