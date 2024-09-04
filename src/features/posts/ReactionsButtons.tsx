import { Post, Reaction } from "./postsSlice";
import { useAddReactionMutation } from "./postsSlice";

const reactionEmoji = {
    thumbsUp: '👍',
    wow: '😮',
    heart: '❤️',
    rocket: '🚀',
    coffee: '☕'
}

const ReactionButtons = ({ post }: { post: Post}) => {
    const [addReaction] = useAddReactionMutation()

    const reactionButtons = Object.entries(reactionEmoji).map(([name, emoji]) => {
        return (
            <button 
                key={name}
                type="button"
                className="reactionButton"
                onClick={() => {
                    const newValue = post.reactions[name as keyof Reaction] + 1;
                    addReaction({ id: post.id.toString(), reactions: { ...post.reactions, [name as keyof Reaction]: newValue }})
                }}
            >
                {emoji} {post.reactions[name as keyof Reaction]}
            </button>
        )
    })

    return (
        <div>
            {reactionButtons}
        </div>
    )
}
export default ReactionButtons;