export interface type_element{
    title: string
    content: string
    delay: number
}
export interface motivation {
    icon: JSX.Element;
    title : string;
    delay : number;
    text : string;
}
export interface type_projects {
    title: string
    desc: string
    delay: number
    status: "En cours" | "Terminé" | "À venir"
}