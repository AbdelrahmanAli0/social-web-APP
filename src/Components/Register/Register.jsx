import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { MoonLoader } from "react-spinners";

/*
{
  "name": "Ahmed Bahnasy",
  "username": "Bahnasy202222",
  "email": "bahnasyd20222@gmail.com",
  "dateOfBirth": "2000-01-01",
  "gender": "male",
  "password": "Aa@123456",
  "rePassword": "Aa@123456"
}
*/
export default function Register() {
  const { handleSubmit, register, formState, getValues } = useForm({
    defaultValues: {
      name: "",
      username: "",
      email: "",
      dateOfBirth: "",
      gender: "",
      password: "",
      rePassword: "",
    },
    mode: onsubmit,
  });

 const Navigate = useNavigate();
  const [SuccessResponse, SetSuccessResponse] = useState(false);
  const [ErrorResponse, SetErroResponse] = useState(null);
  const [IsLoadindg, SetIsLoading] = useState(false);

  function Myhandlesubmit(values) {
    console.log(values);
    SetIsLoading(true);
    axios
      .post("https://route-posts.routemisr.com/users/signup", values)
      .then((respons) => {
        console.log(respons);
        SetSuccessResponse(true);
        setTimeout(() => {
          SetSuccessResponse(false);
        }, 2000);
        Navigate("/Login")
      })
      .catch((error) => {
        console.error(error.response.data.message);
        SetErroResponse(error.response.data.message);
        setTimeout(() => {
          SetErroResponse(null);
        }, 2000);
      })
      .finally(() => {
        SetIsLoading(false);
      });
  }

  return (
    <>
      <h1 className="text-cyan-600 font-bold text-6xl animate-pulse">
        Register Now
      </h1>
      <form
        autoComplete="off"
        onSubmit={handleSubmit(Myhandlesubmit)}
        className="w-3/5 mx-auto"
      >
        {SuccessResponse && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl">
            <p>congratulations! You have successfully registered.</p>
          </div>
        )}
        {ErrorResponse && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl">
            <p> {ErrorResponse} </p>
          </div>
        )}

        <div className="mt-3">
          <label htmlFor="name"> name : </label>
          <input
            {...register("name", {
              required: { value: true, message: "Name is Rrquired" },
              minLength: {
                value: 3,
                message: "Name must be at least 3 charcters",
              },
              maxLength: {
                value: 13,
                message: "Name must be less than 13 charcters",
              },
            })}
            id="name"
            type="text"
            placeholder="name"
            className="border-2 border-white rounded-xl p-1 w-full"
          />
          {formState.errors.name && formState.touchedFields.name && (
            <p className="text-red-700">{formState.errors.name.message}*</p>
          )}
        </div>

        <div className="mt-3">
          <label htmlFor="username">user name : </label>
          <input
            {...register("username", {
              required: { value: true, message: "User name is Rrquired" },
              minLength: {
                value: 3,
                message: "Name must be at least 3 charcters",
              },
              maxLength: {
                value: 25,
                message: "Name must be less than 25 charcters",
              },
            })}
            id="username"
            type="text"
            placeholder="user name"
            className="border-2 border-white rounded-xl p-1 w-full"
          />
          {formState.errors.username && formState.touchedFields.username && (
            <p className="text-red-700">{formState.errors.username.message}*</p>
          )}
        </div>

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

        <div className="mt-3">
          <label htmlFor="repassword"> Password Confirmation : </label>
          <input
            {...register("rePassword", {
              required: {
                value: true,
                message: "password confirmation is required",
              },
              validate: function (value) {
                if (value === getValues("password")) {
                  return true;
                }
                return "password confirmation must match password";
              },
            })}
            id="repassword"
            type="password"
            placeholder=" confirm your password"
            className="border-2 border-white rounded-xl p-1 w-full"
          />
          {formState.errors.rePassword &&
            formState.touchedFields.rePassword && (
              <p className="text-red-700">
                {formState.errors.rePassword.message}*
              </p>
            )}
        </div>

        <div className="mt-3">
          <label htmlFor="dateofbirth"> Date of birth : </label>
          <input
            {...register("dateOfBirth", {
              required: { value: true, message: "Date is required" },
              valueAsDate: true,

              validate: function (value) {
                const Selectedyear = value.getFullYear();
                const Currentyear = new Date().getFullYear();

                if (Currentyear - Selectedyear >= 18) {
                  return true;
                } else {
                  return "You must be over 18 years old";
                }
              },
            })}
            id="dateofbirth"
            type="date"
            className="border-2 border-white rounded-xl p-1 w-full"
          />
          {formState.errors.dateOfBirth && (
            <p className="text-red-700">
              {formState.errors.dateOfBirth.message}*
            </p>
          )}
        </div>

        <div className="mt-3">
          <label htmlFor="male"> Male : </label>
          <input
            id="male"
            value="male"
            {...register("gender")}
            type="radio"
            name="gender"
            className="ml-2"
          />
        </div>

        <div className="mt-3">
          <label htmlFor="female"> Female : </label>
          <input
            id="female"
            value="female"
            {...register("gender", {
              required: { value: true, message: "gender is required" },
            })}
            type="radio"
            name="gender"
            className="ml-2"
          />
          {formState.errors.gender && (
            <p className="text-red-700">{formState.errors.gender.message}*</p>
          )}
        </div>

        <button
          disabled={IsLoadindg}
          className="mt-3 border border-cyan-800 text-cyan-800 hover:text-white hover:bg-cyan-800 duration-200 px-15 py-3 cursor-pointer rounded-3xl"
        >
          {IsLoadindg ? <MoonLoader color="#002e94" size={20} /> : "Register"}
        </button>
      </form>
    </>
  );
}
