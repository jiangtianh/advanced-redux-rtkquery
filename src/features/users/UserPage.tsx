import { useSelector } from "react-redux";
import { useGetUserByIdQuery } from "./userSlice";
import { Link, useParams } from 'react-router-dom';
import { RootState } from "../../app/store";
import { useGetPostsByUserIdQuery } from "../posts/postsSlice";

const UserPage = () => {
    const { userId } = useParams<{ userId: string }>()

    const userQuery = useGetUserByIdQuery(userId || '');
    const postsQuery = useGetPostsByUserIdQuery(userId ? Number(userId) : NaN);
    
    const user = userQuery.data;
    const {
        data: postsForUser,
        isLoading,
        isSuccess,
        isError,
        error
    } = postsQuery;
    console.log(postsForUser)

    let content;
    if (isLoading) {
        content = <p>"Loading..."</p>;
    } else if (isSuccess) {
        const { ids, entities } = postsForUser;
        content = ids.map(id => (
            <li key={id}>
                <Link to={`/post/${id}`}>{entities[id].title}</Link>
            </li>
        ))
    } else if (isError) {
        content = <p>{error as any}</p>;
    }

    return (
        <section>
            <h2>{user?.name}</h2>
            <ol>{content}</ol>
        </section>
    )

}
export default UserPage;