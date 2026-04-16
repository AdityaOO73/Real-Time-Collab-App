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

const Signup = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [show, setShow] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validate = () => {
    let err = {};

    if (!form.name) err.name = TEXT.errors.name;
    if (!form.email.includes("@")) err.email = TEXT.errors.email;
    if (form.password.length < 6) err.password = TEXT.errors.password;

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    dispatch(authStart());

    try {
      const res = await API.post("/auth/signup", form);

      dispatch(authSuccess(res.data));

      navigate("/dashboard");
    } catch {
      dispatch(authFail("Signup failed "));
    }
  };

  return (
    <div className="h-screen flex bg-[var(--bg)] p-0">
      <div className="hidden md:flex w-1/2 rounded-tr-3xl rounded-br-3xl overflow-hidden shadow-lg">
        <img src={heroImg} className="w-full h-full object-cover" />
      </div>

      <div className="flex w-full md:w-1/2 items-center justify-center">
        <div className="w-[380px] bg-white/80 backdrop-blur-md border p-8 rounded-3xl shadow-xl">
          <h2 className="text-2xl font-bold mb-1">{TEXT.signup.title}</h2>
          <p className="text-gray-500 mb-6">{TEXT.signup.subtitle}</p>

          <div className="flex flex-col gap-4">
            <Input
              placeholder={TEXT.signup.name}
              value={form.name}
              error={errors.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <Input
              type="email"
              placeholder={TEXT.signup.email}
              value={form.email}
              error={errors.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <div className="relative">
              <Input
                type={show ? "text" : "password"}
                placeholder={TEXT.signup.password}
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

            <Button text={TEXT.signup.button} onClick={handleSubmit} />

            <p className="text-sm text-center">
              {TEXT.signup.redirect}{" "}
              <Link to="/" className="text-[var(--primary)]">
                {TEXT.signup.redirectBtn}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
