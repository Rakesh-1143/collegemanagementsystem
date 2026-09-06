import React, { useEffect, useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Spinner from "../../../../../utils/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { facultyUpdatePassword } from "../../../../../redux/actions/facultyActions";

const Body = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const errors = useSelector((state) => state.errors);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (Object.keys(errors).length !== 0) {
      setError(errors);
      setLoading(false);
    }
  }, [errors]);

  const update = (e) => {
    e.preventDefault();

    setLoading(true);
    dispatch(
      facultyUpdatePassword(
        {
          newPassword: newPassword,
          confirmPassword: confirmPassword,
        },
        navigate
      )
    );
  };

  useEffect(() => {
    if (errors) {
      setLoading(false);
      setNewPassword("");
      setConfirmPassword("");
    }
  }, [errors]);

  return (
    <div className="flex w-full flex-col items-center space-y-8 py-4">
      <form onSubmit={update} className="flex flex-col space-y-6 items-center">
        <h1 className="text-black text-3xl font-bold">Update Password</h1>
        <div className="space-y-1">
          <p className="text-[#515966] font-bold text-sm">New Password</p>
          <div className="bg-[#515966] rounded-lg px-3 flex items-center space-x-3 w-full">
            <input
              onChange={(e) => setNewPassword(e.target.value)}
              value={newPassword}
              required
              type={showPassword ? "text" : "password"}
              className=" bg-[#515966] text-white rounded-lg outline-none py-2  placeholder:text-sm"
              placeholder="New Password"
            />
            {showPassword ? (
              <VisibilityOffIcon
                onClick={() => setShowPassword(!showPassword)}
                className="cursor-pointer"
              />
            ) : (
              <VisibilityIcon
                onClick={() => setShowPassword(!showPassword)}
                className="cursor-pointer"
              />
            )}
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-[#515966] font-bold text-sm">Confirm Password</p>
          <div className="bg-[#515966] rounded-lg px-3 flex items-center space-x-3 w-full">
            <input
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
              required
              type={showPassword ? "text" : "password"}
              className=" bg-[#515966] text-white rounded-lg outline-none py-2  placeholder:text-sm"
              placeholder="Confirm Password"
            />
            {showPassword ? (
              <VisibilityOffIcon
                onClick={() => setShowPassword(!showPassword)}
                className="cursor-pointer"
              />
            ) : (
              <VisibilityIcon
                onClick={() => setShowPassword(!showPassword)}
                className="cursor-pointer"
              />
            )}
          </div>
        </div>
        <button
          type="submit"
          className="w-32 hover:scale-105 transition-all duration-150 rounded-lg flex items-center justify-center text-white text-base py-1 bg-[#04bd7d]">
          Update
        </button>
        {loading && (
          <Spinner
            message="Updating"
            height={30}
            width={150}
            color="#111111"
            messageColor="#blue"
          />
        )}
        {(error.mismatchError || error.backendError || error.passwordError) && (
          <p className="text-red-500">
            {error.mismatchError || error.backendError || error.passwordError}
          </p>
        )}
      </form>
    </div>
  );
};

export default Body;