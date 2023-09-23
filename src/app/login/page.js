'use client'
import React from 'react';
import {useMutation} from "@tanstack/react-query";
import instance from "@/lib/axios";
import { useForm, SubmitHandler } from "react-hook-form"
import { useRouter } from 'next/navigation'
import {setToken} from "@/utils/tokens";

function Page() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()
  const loginMutation = useMutation((formData) =>
      instance.post('/users/sign_in', formData).then((response) => response.data)
  , {
        onSuccess: (data) => {
          setToken(data.access_token);
          router.push('/', { scroll: false })
        }
      });
  const handleLogin = async (data) => {
    loginMutation.mutate({
      user: {
        email: data.email,
        password: data.password,
      },
    });
  };

  return (
    <div className="p-3 my-5 container">
      <div className="row" style={{alignItems: 'center'}} >
        <div className="col-10 col-md-6">
          <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg" class="img-fluid" alt="Phone image" />
        </div>
        <div className="col-4 col-md-6">
          <form onSubmit={handleSubmit(handleLogin)}>
            <img src= "./notion_logo_4x.png" className="h-10 w-50" alt='notion logo' style={{display: 'block', margin: '10px auto'}} />
            <div className="mb-3">
              <label htmlFor="emailInput" className="form-label">
                Email
              </label>
              <input {...register("email", { required: true })} type="email" className="form-control" id="emailInput" />
            </div>
            {errors.email && <span>This field is required</span>}
            <div className="mb-3">
              <label htmlFor="passwordInput" className="form-label">
                Password
              </label>
              <input {...register("password", { required: true })} type="text" className="form-control" id="passwordInput" />
            </div>
            {errors.pasword && <span>This field is required</span>}
            <button className="btn btn-primary mb-4 w-100" type="submit">Sign in</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Page;