import express from 'express';
const router = express.Router();
router.post('/ats-ai', async (req,res)=>{
 const {resume,jd}=req.body;
 const jdWords=[...new Set((jd.toLowerCase().match(/\b[a-z+#.]{3,}\b/g)||[]))];
 const matched=jdWords.filter(w=>resume.toLowerCase().includes(w));
 const score=Math.min(100, Math.round((matched.length/Math.max(1,jdWords.length))*100));
 res.json({score, summary:'AI analyzed your resume against the job description.', missing: jdWords.filter(w=>!matched.includes(w)).slice(0,15)});
});
export default router;