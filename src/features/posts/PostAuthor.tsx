import { useGetUserByIdQuery } from "../users/userSlice";
import { RootState } from "../../app/store";
import { Link } from "react-router-dom";

const PostAuthor = ({ userId }: { userId: number }) => {
    const author = useGetUserByIdQuery(userId.toString()).data;

    return <span>by {author
        ? <Link to={`/user/${userId}`}>{author.name}</Link>
        : 'Unknown author'}</span>
}
export default PostAuthor;