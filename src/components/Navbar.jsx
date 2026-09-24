import { useContext, useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router';
import { toast } from 'react-hot-toast';
import { Moon, Sun, LogOut, UserPlus, Briefcase } from 'lucide-react';
import LogoImage from '../assets/assetverse_logo.png';
import { AuthContext } from '../Context/AuthContext';

const Navbar = () => {
  const { user, role, logOut, loading } = useContext(AuthContext);

  const [theme, setTheme] = useState(
    () => localStorage.getItem('av-theme') || 'light',
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('av-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(t => (t === 'light' ? 'dark' : 'light'));
  };

  // Auth check complete
  if (loading) {
    return (
      <header className="sticky top-0 z-50 bg-base-100/90 backdrop-blur-md shadow-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 opacity-50">
            <img
              src={LogoImage}
              alt="AssetVerse Logo"
              className="w-10 h-10 rounded-xl"
            />

            <span className="text-xl font-bold hidden sm:block">
              <span className="text-blue-600">Asset</span>
              <span className="text-orange-500">Verse</span>
            </span>
          </div>

          <div
            className="h-8 w-24 animate-pulse rounded-lg bg-base-200"
            aria-hidden="true"
          />
        </div>
      </header>
    );
  }

  const navLinkClass = ({ isActive }) =>
    `px-4 py-2 rounded-lg text-sm font-medium transition
        ${
          isActive
            ? 'bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 text-white'
            : 'text-base-content hover:text-white hover:bg-gradient-to-r hover:from-blue-600 hover:via-blue-500 hover:to-cyan-400'
        }`;

  const employeeLinks = [
    { name: 'My Assets', to: '/dashboard/my-assets' },
    { name: 'Request Assets', to: '/dashboard/request-asset' },
    { name: 'My Team', to: '/dashboard/my-team' },
    { name: 'Profile', to: '/dashboard/employeeProfile' },
  ];

  const hrLinks = [
    { name: 'Asset List', to: '/dashboard/asset' },
    { name: 'Add Asset', to: '/dashboard/add-asset' },
    { name: 'All Requests', to: '/dashboard/Allrequests' },
    { name: 'Employee List', to: '/dashboard/employees' },
    { name: 'Upgrade Package', to: '/dashboard/upgrade' },
    { name: 'Profile', to: '/dashboard/HRprofile' },
  ];

  const roleLinks =
    role === 'employee' ? employeeLinks : role === 'hr' ? hrLinks : [];

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'User';

  const avatarSrc = user?.photoURL || '';

  const handleLogout = async () => {
    await logOut();
    toast.success('Logged out successfully!');
  };

  return (
    <header className="sticky top-0 z-50 bg-base-100/90 backdrop-blur-md shadow-md">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src={LogoImage}
            alt="AssetVerse Logo"
            className="w-10 h-10 rounded-xl"
          />

          <span className="text-xl font-bold hidden sm:block">
            <span className="text-blue-600">Asset</span>
            <span className="text-orange-500">Verse</span>
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden lg:flex items-center gap-2">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>

          {!user && (
            <>
              <NavLink to="/join-employee" className={navLinkClass}>
                Join as Employee
              </NavLink>

              <NavLink to="/join-hr" className={navLinkClass}>
                Join as HR
              </NavLink>
            </>
          )}

          {user && (
            <>
              <NavLink to="/dashboard" className={navLinkClass}>
                Dashboard
              </NavLink>

              {roleLinks.length > 0 && (
                <div className="dropdown dropdown-end">
                  <label
                    tabIndex={0}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-base-content cursor-pointer hover:text-white hover:bg-gradient-to-r hover:from-blue-600 hover:via-blue-500 hover:to-cyan-400"
                  >
                    Menu
                  </label>

                  <ul
                    tabIndex={0}
                    className="dropdown-content menu mt-2 p-2 shadow bg-base-100 rounded-xl w-56 border border-base-300 z-[60]"
                  >
                    {roleLinks.map(link => (
                      <li key={link.to}>
                        <NavLink to={link.to} className={navLinkClass}>
                          {link.name}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </nav>

        {/* Desktop: theme button + login profile */}
        <div className="hidden lg:flex items-center gap-2">
          {!user && (
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className="btn btn-ghost btn-circle"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          )}

          {!user ? (
            <NavLink
              to="/login"
              className="btn text-white border-none bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400"
            >
              Login
            </NavLink>
          ) : (
            <div className="dropdown dropdown-end">
              <label
                tabIndex={0}
                className="btn btn-ghost btn-circle avatar placeholder cursor-pointer border-0 p-0"
                title={displayName}
              >
                <div className="w-10 rounded-full ring ring-blue-500 ring-offset-base-100 ring-offset-2 bg-blue-100">
                  {avatarSrc ? (
                    <img
                      src={avatarSrc}
                      alt={displayName}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <span className="text-lg font-bold text-blue-700 bg-blue-100 rounded-full w-full h-full flex items-center justify-center">
                      {displayName.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
              </label>

              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[60] p-3 shadow-lg bg-base-100 rounded-box w-60 border border-base-300"
              >
                <li className="menu-title px-2 py-1">
                  <span className="text-base-content font-semibold truncate block normal-case">
                    {displayName}
                  </span>

                  {user?.email && (
                    <span className="text-base-content/60 text-xs truncate block normal-case font-normal">
                      {user.email}
                    </span>
                  )}
                </li>

                <li>
                  <NavLink
                    to="/join-employee"
                    className="flex items-center gap-2"
                  >
                    <UserPlus size={16} /> Join as Employee
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/join-hr" className="flex items-center gap-2">
                    <Briefcase size={16} /> Join as HR
                  </NavLink>
                </li>

                <li className="border-t border-base-300 mt-1 pt-1">
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="flex items-center gap-2"
                  >
                    {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}

                    {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                  </button>
                </li>

                <li>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-500 hover:text-red-600"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Mobile profile + menu button */}
        <div className="lg:hidden flex items-center gap-1">
          {!user && (
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className="btn btn-ghost btn-circle btn-sm"
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>
          )}

          {user && (
            <div className="dropdown dropdown-end">
              <label
                tabIndex={0}
                className="btn btn-ghost btn-circle avatar placeholder cursor-pointer border-0 p-0"
                title={displayName}
              >
                <div className="w-9 rounded-full ring ring-blue-500 ring-offset-base-100 ring-offset-2 bg-blue-100">
                  {avatarSrc ? (
                    <img
                      src={avatarSrc}
                      alt={displayName}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <span className="text-sm font-bold text-blue-700 bg-blue-100 rounded-full w-full h-full flex items-center justify-center">
                      {displayName.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
              </label>

              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[60] p-3 shadow-lg bg-base-100 rounded-box w-56 border border-base-300"
              >
                <li className="menu-title px-2 py-1">
                  <span className="text-base-content font-semibold truncate block normal-case">
                    {displayName}
                  </span>

                  {user?.email && (
                    <span className="text-base-content/60 text-xs truncate block normal-case font-normal">
                      {user.email}
                    </span>
                  )}
                </li>

                <li>
                  <NavLink
                    to="/join-employee"
                    className="flex items-center gap-2"
                  >
                    <UserPlus size={16} /> Join as Employee
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/join-hr" className="flex items-center gap-2">
                    <Briefcase size={16} /> Join as HR
                  </NavLink>
                </li>

                <li className="border-t border-base-300 mt-1 pt-1">
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="flex items-center gap-2"
                  >
                    {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}

                    {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                  </button>
                </li>

                <li>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-500 hover:text-red-600"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </li>
              </ul>
            </div>
          )}

          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </label>

            <ul
              tabIndex={0}
              className="menu dropdown-content mt-3 p-2 shadow bg-base-100 rounded-xl w-60 border border-base-300 z-[60]"
            >
              <li>
                <NavLink to="/" className={navLinkClass}>
                  Home
                </NavLink>
              </li>

              {!user && (
                <>
                  <li>
                    <NavLink to="/join-employee" className={navLinkClass}>
                      Join as Employee
                    </NavLink>
                  </li>

                  <li>
                    <NavLink to="/join-hr" className={navLinkClass}>
                      Join as HR
                    </NavLink>
                  </li>

                  <li>
                    <NavLink to="/login" className={navLinkClass}>
                      Login
                    </NavLink>
                  </li>
                </>
              )}

              {user && (
                <>
                  <li>
                    <NavLink to="/dashboard" className={navLinkClass}>
                      Dashboard
                    </NavLink>
                  </li>

                  {roleLinks.length > 0 && (
                    <li className="menu-title">Dashboard Menu</li>
                  )}

                  {roleLinks.map(link => (
                    <li key={link.to}>
                      <NavLink to={link.to} className={navLinkClass}>
                        {link.name}
                      </NavLink>
                    </li>
                  ))}
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
