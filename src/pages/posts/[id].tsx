import type { NextPage } from "next";
import Button from "../../components/button";
import Layout from "../../components/layout";
import { useRouter } from "next/router";
import useSWR from "swr";
import Link from "next/link";
import { Posts, User } from "@prisma/client";
import useMutation from "@/libs/client/useMutation";
import { cls } from "../../libs/client/utils";

interface ItemDetailResponse {
  ok : boolean;
  posts : PostsWithUser;
  relatedPosts : Posts[];
  isLiked: boolean;
}

//user의 데이터까지 product에 담아줬지만 타입만 읽는 ts는 user를 읽지 못한다
//user의 타입을 프리즈마 타입 유저로 받아 추가해준다
interface PostsWithUser extends Posts {
  user : User;
}

const ItemDetail: NextPage = () => {

  const router = useRouter();
  //console.log(router.query);

  //useSWR의 optional query
  const {data, mutate} = useSWR<ItemDetailResponse>
    (router.query.id ? `/api/posts/${router.query?.id}` : null )
    console.log(`datail data`,data);

  const [toggleFav] = useMutation(`/api/posts/${router.query?.id}/fav`);

  const onFavClick = () => {
    if (!data) return;
    mutate({ ...data, isLiked: !data.isLiked }, false);
    toggleFav({});
  };

  return (
    <Layout canGoBack>
    <div className="px-4 py-4">
    <div className="mb-8">
      <div className="h-72 bg-slate-300" />
      <div className="flex cursor-pointer py-3 border-t border-b items-center space-x-3">
        <div className="w-12 h-12 rounded-full bg-slate-300" />
        <div>
          <p className="text-sm font-medium text-gray-700">
                {data?.posts?.user?.name}
          </p>
          <Link href={`/users/${data?.posts?.user?.id}`}
            className="text-xs font-medium text-gray-500">
            View profile &rarr;
          </Link>
        </div>
      </div>
      <div className="mt-5">
        <h1 className="text-xl font-bold text-gray-900">{data?.posts?.name}</h1>
        <div className=" my-6 text-gray-700">
        {data?.posts?.contents}
        <div className="absolute right-48 text-sm text-slate-500">
          {(data?.posts.createdAt) ? new Date(data?.posts.createdAt).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }) : ""}
        </div>
        </div>
        <div className="flex items-center justify-between space-x-2">
        <Button large text="Re Tweet" />
          <button
            onClick={onFavClick}
            className={cls(
              "p-3 rounded-md flex items-center hover:bg-gray-100 justify-center ",
              data?.isLiked
                ? "text-red-500  hover:text-red-600"
                : "text-gray-400  hover:text-gray-500"
                )}
               >
              {data?.isLiked ? (
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                ) : (
                  <svg
                    className="h-6 w-6 "
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <h2 className="text-xl pt-5 font-semibold text-gray-00 text-center">Related Tags</h2>
          {data?.relatedPosts.map((similarOne) => (
          <div className="my-2">
            <div key={similarOne.id}>
              <h3 className="mb-1 font-semibold text-sm text-gray-500 text-center">
                {(similarOne.name).split(' ').map((word, index) => (
                  <span key={index}>#{word} </span>
                ))}
              </h3>
            </div>
           </div>
            ))} 
          </div>
        </div>
    </Layout>
  );
};
export default ItemDetail;