import { useState } from 'react';
import axios from 'axios';
export default function AIAtsChecker(){
 const [resume,setResume]=useState(''); const [jd,setJd]=useState(''); const [data,setData]=useState(null);
 const run=async()=>{
  const res=await axios.post('http://localhost:5000/api/ats-ai',{resume,jd});
  setData(res.data);
 };
 return <div className='p-6'>
    <h1 className='text-2xl font-bold'>AI ATS Checker</h1>
    <textarea className='border w-full p-2 my-2' rows='6' onChange={e=>setResume(e.target.value)} placeholder='Resume Text' />
    <textarea className='border w-full p-2 my-2' rows='6' onChange={e=>setJd(e.target.value)} placeholder='Job Description' />
    <button onClick={run} className='bg-green-600 text-white px-4 py-2 rounded'>Analyze</button>{data&&<div className='mt-4'>
    <p>Score: {data.score}%</p><p>Summary: {data.summary}</p>
    <p>Missing Keywords: {data.missing.join(', ')}</p>
    </div>}</div>
}