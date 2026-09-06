import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Spinner from "../../../utils/Spinner";
import { studentSignIn } from "../../../redux/actions/studentActions";

const StudentLogin = () => {
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

  const login = (e) => {
    e.preventDefault();
    setLoading(true);
    dispatch(
      studentSignIn({ username: username, password: password }, navigate)
    );
  };

  useEffect(() => {
    if (errors) {
      setLoading(false);
      setUsername("");
      setPassword("");
    }
  }, [errors]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#d65158] p-4">
      <div className="grid w-full max-w-4xl grid-cols-1 items-center justify-items-center gap-6 md:grid-cols-2 md:gap-0">
        <div className="hidden h-80 w-80 flex-col items-center justify-center rounded-3xl bg-white shadow-2xl xl:h-96 xl:w-96 md:flex">
          <h1 className="text-center text-[3rem] font-bold">
            Student
            <br />
            Login
          </h1>
        </div>
        <form
          onSubmit={login}
          className="w-full max-w-sm space-y-6 rounded-3xl bg-[#2c2f35] p-6 shadow-2xl sm:p-8">
          <h1 className="text-center text-3xl font-semibold text-white">
            Student
          </h1>
          <div className="space-y-1">
            <p className="text-sm font-bold text-[#515966]">Username</p>
            <div className="flex w-full items-center rounded-lg bg-[#515966]">
              <input
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                type="text"
                required
                className="w-full rounded-lg bg-[#515966] px-3 py-2 text-white outline-none placeholder:text-sm"
                placeholder="Username"
              />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-[#515966]">Password</p>
            <div className="flex w-full items-center rounded-lg bg-[#515966] px-3">
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
                type={showPassword ? "text" : "password"}
                className="w-full rounded-lg bg-[#515966] py-2 text-white outline-none placeholder:text-sm"
                placeholder="Password"
              />
              {showPassword ? (
                <VisibilityIcon
                  onClick={() => setShowPassword(!showPassword)}
                  className="cursor-pointer"
                />
              ) : (
                <VisibilityOffIcon
                  onClick={() => setShowPassword(!showPassword)}
                  className="cursor-pointer"
                />
              )}
            </div>
          </div>
          <button
            type="submit"
            className="flex h-9 w-32 items-center justify-center rounded-lg bg-[#04bd7d] text-base text-white transition-all duration-150 hover:scale-105">
            Login
          </button>
          {loading && (
            <Spinner
              message="Logging In"
              height={30}
              width={150}
              color="#ffffff"
              messageColor="#fff"
            />
          )}
          {(error.usernameError || error.passwordError) && (
            <p className="text-red-500">
              {error.usernameError || error.passwordError}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default StudentLogin;