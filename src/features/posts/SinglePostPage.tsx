import { useSelector } from 'react-redux';
import { selectPostById } from './postsSlice';
import { useParams, Link } from 'react-router-dom';

import PostAuthor from './PostAuthor';
import TimeAgo from './TimeAgo';
import ReactionButtons from './ReactionsButtons';

import { RootState } from '../../app/store';

const SinglePostPage = () => {
    const { postId } = useParams();

    const post = useSelector((state: RootState) => postId ? selectPostById(state, postId) : undefined)
    
    if (!post) {
        return (
        <section>
            <h2>Post not found!</h2>
        </section>
        );
    }
    
    return (
        <article>
            <h2>{post.title}</h2>
            <p>{post.body}</p>
            <p className="postCredit">
                <Link to={`/post/edit/${post.id}`}>Edit Post</Link>
                <PostAuthor userId={post.userId} />
                <TimeAgo timestamp={post.date} />
            </p>
            <ReactionButtons post={post} />
        </article>
    );
}
export default SinglePostPage;