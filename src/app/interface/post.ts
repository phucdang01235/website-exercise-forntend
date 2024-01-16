import { Category } from "./category";

export interface Post {
    idPost: number,
    title: string,
    permalink: string,
    category: Category,
    postImgPath: string,
    excerpt: string,
    content: string,

    isFeatured: boolean,
    views: number,
    status: string,
    createAt: Date
}
