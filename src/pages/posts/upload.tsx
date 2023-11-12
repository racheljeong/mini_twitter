import type { NextPage } from "next";
import Button from "../../components/button";
import Input from "../../components/input";
import Layout from "../../components/layout";
import TextArea from "../../components/textarea";
import { useForm } from "react-hook-form";
import useMutation from "@/libs/client/useMutation";
import { Posts } from "@prisma/client";
import { useRouter } from "next/router";
import {useEffect} from "react";


interface UploadPostsForm {
  name : string;
  price : number;
  contents : string;
}

interface UploadPostsMutation {
  ok : boolean;
  //프리즈마에서 우리가 만든 모델 products를 읽고 타입을 생성해준다
  posts : Posts ; // type `Product` coming from Prisma/client
}


const Upload: NextPage = () => {

  const {register, handleSubmit} = useForm<UploadPostsForm>();
  const router = useRouter();
  //mutation 보내고 싶은 url
  //mutation 호출은 data와 함께하면 된다 
  const [uploadPosts, {loading, data}] = useMutation<UploadPostsMutation>("/api/posts");

  const onValid = (data : UploadPostsForm) => {
    console.log(`posts`,data);
    if(loading) return;
    uploadPosts(data);
  }

  useEffect(() => {
    if(data?.ok) {
      router.push(`/posts/${data.posts.id}`);
    }
  },[data, router])

  return (
    <Layout canGoBack title="Upload Posts">
    <form className="p-4 space-y-4"
          onSubmit={handleSubmit(onValid)}>
      <div>
        <label className="w-full cursor-pointer text-gray-600 hover:border-sky-500 hover:text-sky-500 flex items-center justify-center border-2 border-dashed border-gray-300 h-48 rounded-md">
          <svg
            className="h-12 w-12"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <input className="hidden" type="file" />
        </label>
      </div>
        <Input 
          register={register("name", {required : true})} 
          label="Name" name="name" type="text" />
        <TextArea 
          register={register("contents", {required : true})} 
          name="contents" label="contents" />
        <Button text={loading ? "Loading..." : "Upload item"} />
      </form>
    </Layout>
  );
};
export default Upload;