import React from "react";
import { Link } from "react-router-dom";

const cardBase =
  "w-full h-64 sm:h-72 lg:h-80 shadow-2xl flex flex-col justify-center items-center bg-transparent backdrop-blur-md bg-opacity-60 rounded-xl";

const Login = () => {
  return (
    <div
      className="flex min-h-screen w-full items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `url("https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}>
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative flex w-full max-w-4xl flex-col items-center space-y-10 px-4 py-12 sm:space-y-16">
        <h1 className="w-full rounded-2xl bg-black py-4 text-center text-2xl font-semibold text-white sm:text-3xl bg-opacity-75">
          Jawaharlal Nehru Technological University Anantapuramu
        </h1>
        <div className="grid w-full max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
          <div className={`${cardBase} bg-[#f59e0b]`}>
            <h1 className="text-4xl font-extrabold text-white text-center">Super<br />Admin</h1>
            <Link
              to="/login/superadminlogin"
              className="mt-8 flex h-10 w-32 items-center justify-center rounded-lg bg-blue-500 text-lg text-white transition-all duration-200 hover:scale-110">
              Login
            </Link>
          </div>
          <div className={`${cardBase} bg-[#04bd7d]`}>
            <h1 className="text-4xl font-extrabold text-white">Admin</h1>
            <Link
              to="/login/adminlogin"
              className="mt-8 flex h-10 w-32 items-center justify-center rounded-lg bg-blue-500 text-lg text-white transition-all duration-200 hover:scale-110">
              Login
            </Link>
          </div>
          <div className={`${cardBase} bg-[#5a51d6]`}>
            <h1 className="text-4xl font-extrabold text-white">Faculty</h1>
            <Link
              to="/login/facultylogin"
              className="mt-8 flex h-10 w-32 items-center justify-center rounded-lg bg-blue-500 text-lg text-white transition-all duration-200 hover:scale-110">
              Login
            </Link>
          </div>
          <div className={`${cardBase} bg-[#d65158]`}>
            <h1 className="text-4xl font-extrabold text-white">Student</h1>
            <Link
              to="/login/studentlogin"
              className="mt-8 flex h-10 w-32 items-center justify-center rounded-lg bg-blue-500 text-lg text-white transition-all duration-200 hover:scale-110">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
