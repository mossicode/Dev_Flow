import ROUTES from "../constants/Route";


export const DEFAULT_EMPTY={
    title:"No Data Found",
    message:'Looks like the database is takking a nap, Wake it up with some new en..',
    button:{
        text:"Add Data",
        href:ROUTES.HOME
    }
}
export const DEFAULT_ERROR={
    title:"Oops! Something went wrong",
    message:"Even our codes have a bad day. Give it another shot",
    button:{
        text:"Try again",
        href:ROUTES.HOME
    }
}
export const EMPTY_QUESTION={
    title:"Ahh, NO question yet",
    message:"You dont have any question up to now.",
    button:{
        text:"Add Question",
        href:ROUTES.ASK_QUESTION
    }
}
