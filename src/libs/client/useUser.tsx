import { User } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";

interface ProfileResponse {
    ok: boolean;
    profile: User;
  }
  
//useUser : 로그인 여부를 따져서 로그인 되어있을때만 실행하는 protector 함수
export default function  useUser() {
    //SWR
    //인자1 : 요청보낼 URL (캐시저장할때 사용할 key가 된다)
    const { data, error } = useSWR<ProfileResponse>("/api/users/me");  
    const router = useRouter();

    console.log(`data in useUser : ${data}`);
    console.log(`path`,router.pathname);
    
    useEffect(() => {
        if(data && !data.ok) {
            router.replace("/create-account");
        }
    },[data,router]);

    return {user :data?.profile, isLoading : !data && !error};
}