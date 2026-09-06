import React, { useEffect, useState } from "react";
import { Avatar } from "@mui/material";
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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    dispatch(logOut());
    navigate(`/login/${role.toLowerCase()}login`);
  };

  // Close the drawer whenever the route changes.
  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  // While the session is being restored from the cookie, render nothing.
  if (!sessionRestored) return null;

  // No active session -> send the user to the correct login page.
  if (!user) {
    return <Navigate to={`/login/${role.toLowerCase()}login`} replace />;
  }

  const result = user?.result || {};

  return (
    <div className="min-h-screen w-full bg-slate-100 lg:flex lg:items-center lg:justify-center lg:p-5">
      <div className="mx-auto flex min-h-screen w-full max-w-full flex-col overflow-hidden bg-slate-50 lg:h-[calc(100vh-2.5rem)] lg:min-h-0 lg:max-w-[1700px] lg:rounded-2xl lg:shadow-2xl">
        <header className="flex items-center justify-between gap-2 border-b border-gray-300 px-3 py-2 sm:px-5">
          <div className="flex min-w-0 items-center gap-2">
            {sidebar && (
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                aria-label="Open menu"
                className="rounded-md p-1 text-gray-600 hover:bg-gray-200 lg:hidden">
                <MenuIcon />
              </button>
            )}
            <img
              src="https://icon-library.com/images/cms-icon/cms-icon-11.jpg"
              alt=""
              className="h-6 sm:h-7"
            />
            <h1 className="text-sm font-bold text-blue-600">CMS</h1>
          </div>
          <h1 className="hidden font-semibold text-black sm:block">Welcome</h1>
          <div className="flex items-center gap-2 sm:gap-3">
            <Avatar
              src={result?.avatar}
              alt={result?.name?.charAt(0)}
              sx={{ width: 24, height: 24 }}
              className="border-2 border-blue-600"
            />
            <h1 className="max-w-[9rem] truncate sm:max-w-[12rem]">
              {result?.name?.split(" ")[0]}
            </h1>
            <LogoutIcon
              onClick={logout}
              className="cursor-pointer transition-all hover:scale-125"
            />
          </div>
        </header>

        <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
          {sidebar && (
            <aside className="hidden w-60 shrink-0 overflow-y-auto border-r border-gray-300 py-2 xl:w-64 lg:block">
              {sidebar}
            </aside>
          )}

          {sidebar && drawerOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div
                className="absolute inset-0 bg-black/40"
                onClick={() => setDrawerOpen(false)}
              />
              <aside className="absolute inset-y-0 left-0 w-72 max-w-[85%] overflow-y-auto bg-[#f4f6fa] p-2 shadow-xl">
                <div className="flex items-center justify-between px-3 py-2">
                  <h1 className="text-sm font-bold text-blue-600">CMS</h1>
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