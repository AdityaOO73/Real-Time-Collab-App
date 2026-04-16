import { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import { Link, useNavigate } from "react-router-dom";
import { TEXT } from "../utils/constants";
import { Eye, EyeOff } from "lucide-react";
import heroImg from "../assets/image.png";
import { useDispatch } from "react-redux";
import { authStart, authSuccess, authFail } from "../redux/slices/authSlice";
import API from "../utils/api";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [show, setShow] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validate = () => {
    let newErrors = {};

    if (!form.email.includes("@")) newErrors.email = TEXT.errors.email;
    if (form.password.length < 6) newErrors.password = TEXT.errors.password;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    dispatch(authStart());

    try {
      const res = await API.post("/auth/login", form);

      dispatch(authSuccess(res.data));

      navigate("/dashboard");
    } catch {
      dispatch(authFail("Login failed "));
    }
  };

  return (
    <div className="h-screen flex bg-[var(--bg)] p-0">
      <div className="hidden md:flex w-1/2 rounded-tr-3xl rounded-br-3xl overflow-hidden shadow-lg">
        <img src={heroImg} className="w-full h-full object-cover" />
      </div>

      <div className="flex w-full md:w-1/2 items-center justify-center">
        <div className="w-[380px] bg-white/80 backdrop-blur-md border p-8 rounded-3xl shadow-xl">
          <h2 className="text-2xl font-bold mb-1">{TEXT.login.title}</h2>
          <p className="text-gray-500 mb-6">{TEXT.login.subtitle}</p>

          <div className="flex flex-col gap-4">
            <Input
              type="email"
              placeholder={TEXT.login.email}
              value={form.email}
              error={errors.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <div className="relative">
              <Input
                type={show ? "text" : "password"}
                placeholder={TEXT.login.password}
                value={form.password}
                error={errors.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />

              <div
                onClick={() => setShow(!show)}
                className="absolute right-4 top-3 cursor-pointer"
              >
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>

            <Button text={TEXT.login.button} onClick={handleSubmit} />

            <p className="text-sm text-center">
              {TEXT.login.redirect}{" "}
              <Link to="/signup" className="text-[var(--primary)]">
                {TEXT.login.redirectBtn}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
