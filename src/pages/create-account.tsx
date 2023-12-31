import type { NextPage } from "next";
import { useState, useEffect } from "react";
import Button from "../components/button";
import Input from "../components/input";
import { cls } from "../libs/client/utils";
import { useForm } from "react-hook-form";
import useMutation from "@/libs/client/useMutation";
import { useRouter } from "next/router";
import Layout from "@/components/layout";

interface EnterForm {
  name : string;
  email : string;
  accountErrors? : string;
}

interface MutationResult {
  ok: boolean; 
  error? : string;
}

const Enter: NextPage = () => {
//1. be에서 post fetch 할 func == 데이터상태를 변화시킴 == mutation
//enter func = mutation을 작동시킬 function (trigger func for mutation)

  const [enter, { loading, data, error }] = useMutation<MutationResult>("/api/users/enter");
  console.log(`create-account Data`, data);
  
  const {register, reset, handleSubmit, setError} = useForm<EnterForm>();

  const onValid = (validForm : EnterForm) => {
    if (loading) return;
    console.log(`validForm`,validForm);
    enter(validForm);
  };
  
  const router = useRouter();

  useEffect(() => {
    if(data?.ok && data.ok) {
      alert("Creating account is Success");
      router.push("/log-in");
    }else if(data && !data.ok && data.error){
      alert(data.error);
    }
  },[data, router]);

  const pattern = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-za-z0-9\-]+/;
                //   /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

  const emailValidChk = (email : string) => {
      if(pattern.test(email) === false) {
         return pattern.test(email) || "Not available Email form."
        }
      else { return true; }
  }
 
  return (
    <Layout canGoBack title="Create Account">
      <div className="mt-16 px-4">
        <div className="mt-12">
              <form
                onSubmit={handleSubmit(onValid)}
                className="flex flex-col mt-8 space-y-4"
              >
              <Input
                  register={register("name", {
                  required: "Name is required"})}
                  name="name"
                  label="name"
                  type="name"
              />
              <Input
                  register={register("email", {
                  required: "Email is required",
                  validate : {
                    emailValidChk,
                  },
                  // pattern: {
                  //   value: /^[A-Za-z0-9._%+-]+@+/^[A-Za-z0-9._%+-].com$/,
                  //   message: "Only naver.com emails allowed",
                  //   }, 
                  })}
                  name="email"
                  label="Email address"
                  type="email"
              />
              <Button text={loading ? "Loading" : "Sign Up"} />
              </form>
            <div className="mt-8">
              <div className="relative">
                <div className="absolute w-full border-t border-gray-300" />
                <div className="relative -top-3 text-center ">
                  <span className="bg-white px-2 text-sm text-gray-500">
                    Or enter with
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 mt-2 gap-3">
                <button className="flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <svg
                    className="w-5 h-5"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </button>
                <button className="flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <svg
                    className="w-5 h-5"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                  <path
                    fillRule="evenodd"
                    d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default Enter;