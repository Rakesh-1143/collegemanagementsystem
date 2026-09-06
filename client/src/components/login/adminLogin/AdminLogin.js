import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { adminSignIn } from "../../../redux/actions/adminActions";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Spinner from "../../../utils/Spinner";
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import { Link } from "react-router-dom";
import { SET_ERRORS } from "../../../redux/actionTypes";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const errors = useSelector((state) => state.errors);
  const [error, setError] = useState({});
  useEffect(() => {
    if (errors) {
      setError(errors);
    }
  }, [errors]);

  // Clear any error left over from another portal / page.
  useEffect(() => {
    dispatch({ type: SET_ERRORS, payload: {} });
  }, [dispatch]);

  const login = (e) => {
    e.preventDefault();
    setLoading(true);
    dispatch(adminSignIn({ username: username, password: password }, navigate));
  };

  useEffect(() => {
    if (errors) {
      setLoading(false);
      setUsername("");
      setPassword("");
    }
  }, [errors]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl sm:p-10">
        
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-sm">
            <SupervisorAccountIcon sx={{ fontSize: 32 }} />
          </div>
          <h1 className="text-2xl font-display font-bold tracking-tight text-slate-900">
            Administrator Login
          </h1>
          <p className="mt-2 text-sm font-medium text-slate-500">
            Sign in to manage the system
          </p>
        </div>

        <form onSubmit={login} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Username</label>
            <input
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              type="text"
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              placeholder="Enter your username"
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Password</label>
            <div className="relative flex w-full items-center">
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
                type={showPassword ? "text" : "password"}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                placeholder="Enter your password"
              />
              <div 
                className="absolute right-3 cursor-pointer text-slate-400 hover:text-slate-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <VisibilityIcon fontSize="small" /> : <VisibilityOffIcon fontSize="small" />}
              </div>
            </div>
          </div>

          {(error.usernameError || error.passwordError || error.backendError) && (
            <div className="rounded-lg border border-red-100 bg-red-50 p-3 text-sm font-medium text-red-600">
              {error.usernameError || error.passwordError || error.backendError}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex w-full items-center justify-center rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white transition-all hover:bg-indigo-700 disabled:opacity-70 shadow-sm"
          >
            {loading ? <Spinner height={20} width={20} color="#ffffff" /> : "Sign In"}
          </button>
          
          <div className="mt-6 text-center text-sm font-medium text-slate-500">
            <Link to="/login" className="text-indigo-600 hover:text-indigo-700 hover:underline">
              ← Back to Portal Selection
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;