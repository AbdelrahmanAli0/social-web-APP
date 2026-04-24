import axios from "axios";
import { Warning2 } from "iconsax-reactjs";
import React, { useState } from "react";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { RiseLoader } from "react-spinners";
import { Authcontext } from "../../Context/Authcontext";



export default function Login() {
  const {  setTokenUser } = useContext(Authcontext);

  const { handleSubmit, register, formState } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    mode:"onsubmit",
  });
   
  const Navigate = useNavigate();
  const [ErrorMessage, SetErrorMessage] = useState(null);
  const [IsLoading, SetIsLoading]=useState(null)

  function HandleLogin(values) {
    console.log(values);
   SetIsLoading(true);
    axios
      .post("https://route-posts.routemisr.com/users/signin", values)
      .then((response) => {
       setTokenUser( response.data.data.token);
       localStorage.setItem('token',response.data.data.token)
        SetIsLoading(null);
        Navigate("/Home")
      })
      .catch((error) => {
        console.log(error.response.data.message);
        SetErrorMessage(error.response.data.message);
        setTimeout(() => {
          SetErrorMessage(null);
        }, 2000);
      }).finally(()=>{
        SetIsLoading(null)
      });
  }

  return (
    <>
        {ErrorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl">
            <p className="flex items-center gap-2"> {ErrorMessage} <Warning2 className="" size="32" color="#FF8A65" variant="Outline"/> </p>
          </div>
        )}
     <h1 className="text-cyan-600 font-bold text-6xl animate-pulse">
        Login
      </h1>
    <form onSubmit={handleSubmit(HandleLogin)}>
      <div className="mt-3">
        <label htmlFor="email">Email : </label>
        <input
          {...register("email", {
            required: { value: true, message: "email is Rrquired" },
            pattern: {
              value:
                /^[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*@[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*$/,
              message: "email isnt in format",
            },
          })}
          id="email"
          type="email"
          placeholder="EX : username@gmail.com"
          className="border-2 border-white rounded-xl p-1 w-full"
        />
        {formState.errors.email && formState.touchedFields.email && (
          <p className="text-red-700">{formState.errors.email.message}*</p>
        )}
      </div>

      <div className="mt-3">
        <label htmlFor="password">Password : </label>
        <input
          {...register("password", {
            required: {
              value: true,
              message: "Password is required ",
            },
            pattern: {
              value:
                /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/,
              message:
                "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.",
            },
          })}
          id="password"
          type="password"
          placeholder="Password"
          className="border-2 border-white rounded-xl p-1 w-full"
        />
        {formState.errors.password && formState.touchedFields.password && (
          <p className="text-red-700">{formState.errors.password.message}*</p>
        )}
      </div>

        <button
        disabled={IsLoading}
        className="mt-3 border border-cyan-800 text-cyan-800 hover:text-white hover:bg-cyan-800 duration-200 px-15 py-3 cursor-pointer rounded-3xl"
      >
        {IsLoading ? <RiseLoader color="#0091ff" size={15} margin={0} /> : "Login"}
      </button>
    </form>

    </>
  );
}
