import React, { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { logOut } from "../redux/actions/authActions";

// Shared responsive shell for all pages that show the header + sidebar layout.
// Desktop: fixed sidebar next to a scrollable main area.
// Mobile: the sidebar collapses into a slide-in drawer opened from the header.
// The user + session live in Redux (restored from the httpOnly cookie via
// /api/me on app load) — nothing is persisted in localStorage.
const PageLayout = ({ role, sidebar, children }) => {
  const user = useSelector((state) => state[role]?.authData);
  const sessionRestored = useSelector(
    (state) => state[role]?.sessionRestored ?? false
  );
  
  // Check if any OTHER role is logged in (to prevent a student from just being kicked to admin login)
  const isAnyOtherRoleLoggedIn = useSelector(
    (state) => 
      (role !== 'admin' && !!state.admin?.authData) || 
      (role !== 'student' && !!state.student?.authData) || 
      (role !== 'faculty' && !!state.faculty?.authData) || 
      (role !== 'superAdmin' && !!state.superAdmin?.authData)
  );

  const [drawerOpen, setDrawerOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    dispatch(logOut());
    // MOCK REQUIREMENT: Navigate to the exact first page ("/") of the application and clear history
    navigate("/", { replace: true });
  };

  // Close the drawer whenever the route changes.
  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  // While the session is being restored from the cookie, render nothing.
  if (!sessionRestored) return null;

  // No active session for this specific role.
  if (!user) {
    // If they are logged in as a DIFFERENT role, redirect them to the absolute root to prevent role mixing
    if (isAnyOtherRoleLoggedIn) {
      return <Navigate to="/" replace />;
    }
    // Otherwise, redirect to their specific login page
    return <Navigate to={`/login/${role.toLowerCase()}login`} replace />;
  }

  const result = user?.result || {};

  return (
    <div className="min-h-screen w-full bg-slate-100 lg:flex lg:items-center lg:justify-center lg:p-5">
      <div className="mx-auto flex min-h-screen w-full max-w-full flex-col overflow-hidden bg-slate-50 lg:h-[calc(100vh-2rem)] lg:min-h-0 lg:max-w-[1600px] lg:rounded-xl lg:shadow-floating lg:border lg:border-slate-200">
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-slate-200 bg-white px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            {sidebar && (
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                aria-label="Open menu"
                className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 transition-colors lg:hidden">
                <MenuIcon />
              </button>
            )}
            <div className="flex items-center justify-center bg-indigo-600 rounded-lg w-8 h-8 text-white font-bold text-lg shadow-sm">
              C
            </div>
            <h1 className="text-lg font-display font-semibold text-slate-800 tracking-tight hidden sm:block">
              College ERP
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Avatar
              src={result?.avatar}
              alt={result?.name?.charAt(0)}
              sx={{ width: 32, height: 32 }}
              className="ring-2 ring-indigo-50"
            />
            <h1 className="max-w-[9rem] truncate text-sm font-medium text-slate-700 sm:max-w-[12rem]">
              {result?.name || "User"}
            </h1>
            <div className="h-5 w-px bg-slate-200 mx-1"></div>
            <button
              onClick={logout}
              className="text-slate-400 hover:text-red-500 transition-colors p-1"
              aria-label="Log out"
            >
              <LogoutIcon fontSize="small" />
            </button>
          </div>
        </header>

        <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
          {sidebar && (
            <aside className="hidden w-64 shrink-0 overflow-y-auto border-r border-slate-200 bg-white py-4 lg:block scrollbar-thin scrollbar-thumb-slate-200">
              {sidebar}
            </aside>
          )}

          {sidebar && drawerOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div
                className="absolute inset-0 bg-black/40"
                onClick={() => setDrawerOpen(false)}
              />
              <aside className="absolute inset-y-0 left-0 w-72 max-w-[85%] overflow-y-auto bg-white shadow-xl">
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center bg-indigo-600 rounded-lg w-8 h-8 text-white font-bold">
                      C
                    </div>
                    <h1 className="text-base font-display font-semibold text-slate-800">College ERP</h1>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDrawerOpen(false)}
                    aria-label="Close menu"
                    className="rounded-md p-1 text-gray-600 hover:bg-gray-200">
                    ✕
                  </button>
                </div>
                {sidebar}
              </aside>
            </div>
          )}

          <main className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto p-3 sm:p-4 lg:p-5">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default PageLayout;