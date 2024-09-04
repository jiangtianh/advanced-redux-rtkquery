import { Post } from "./postsSlice";
import PostAuthor from "./PostAuthor";
import TimeAgo from "./TimeAgo";
import ReactionButtons from "./ReactionsButtons";
import { Link } from 'react-router-dom';
import { useSelector } from "react-redux";
import { selectPostById } from "./postsSlice";
import { RootState } from "../../app/store";

const PostsExcerpt = ({ postId }: { postId: string}) => {
    const post = useSelector((state: RootState) => selectPostById(state, postId));
    return (
        <article>
            <h2>{post.title}</h2>
            <p className="excerpt">{post.body.substring(0, 75)}</p>
            <p className="postCredit">
                <Link to={`post/${post.id}`}>View Post</Link>
                <PostAuthor userId={post.userId} />
                <TimeAgo timestamp={post.date} />
            </p>
            <ReactionButtons post={post} />
        </article>
    )
}

export default PostsExcerpt;