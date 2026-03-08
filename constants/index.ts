import { MapPin, HomeIcon,type LucideIcon,Group, Database , PersonStandingIcon, LucidePersonStanding, CircleQuestionMark, TagIcon} from 'lucide-react';
interface SidebarProps{
    imgURL:LucideIcon;
    label:string;
    route:string;
}

export const sidebrarLinks:SidebarProps[] = [
    {
        imgURL:HomeIcon,
        label:"home",
        route:"/"
    },
    {
        imgURL:Group,
        label:"community",
        route:"/community"
    },
    {
        imgURL:Database,
        label:"collection",
        route:"/collection"
    },
    {
        imgURL:PersonStandingIcon,
        label:"job",
        route:"/job"
    },
    {
        imgURL:LucidePersonStanding,
        label:"profile",
        route:"/profile"
    },
    {
        imgURL:TagIcon,
        label:"tag",
        route:"/tag"
    },
    {
        imgURL:CircleQuestionMark,
        label:"ask-question",
        route:"/ask-question"
    },
]