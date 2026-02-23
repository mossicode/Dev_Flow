const ROUTES ={
    HOME:"/",
    SIGN_IN:"/sign-in",
    SIGN_UP:"/sign-up",
    ASK_QUESTION:'/ask-question',
    COLLECTION:"/collection",
    COMMUNITY:"community",
    TAGS:"tags",
    JOBS:"jobs",
    QUESTION:(id:string)=>`/question/${id}`,
    PROFILE:(id:string)=>`/profile/${id}`,
    TAG:(id:string)=>`/tag/${id}`
}
export default ROUTES;
