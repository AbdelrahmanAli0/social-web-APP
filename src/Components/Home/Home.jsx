import axios from 'axios'
import React from 'react'
import   Postcard  from '../Postcard/Postcard';
import Loaderpage from '../Loaderpage/Loaderpage';
import { Query, useQuery, } from '@tanstack/react-query';
import PostCreation from '../PostCreation/PostCreation';
export default function Home() {


  
 function GetAllPosts(){
   return axios.get('https://route-posts.routemisr.com/posts',{
    headers:{
      token:localStorage.getItem('token')
    },
    params:{
      limit:100,
      sort:'-createdAt'
    }
   })
 }

const { data , isLoading, isError} = useQuery({
  queryKey : ['getHomePosts'],
  queryFn : GetAllPosts,
})
console.log('possssssssstdata', data);
// console.log('isLoading', isLoading);
// console.log('isError', isError);
// console.log('isFetching', isFetching);

if(isLoading){
  return <Loaderpage />
}
if(isError){
  return <h1>Error occurred please try again later.</h1>
}
 
const posts= data.data.data.posts;

  return (
    <div className='bg-gray-100 min-h-screen w-full md:w-3/4 lg:w-1/2 mx-auto flex flex-col gap-5 rounded-2xl'>
      <PostCreation/>
      {posts?.map(post=><Postcard key={post._id} postsinfo={post} />)}
    </div>
  )
}
