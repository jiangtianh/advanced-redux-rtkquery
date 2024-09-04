import { useId, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectPostById, useDeletePostMutation, useUpdatePostMutation } from "./postsSlice";
import { useParams, useNavigate } from "react-router-dom";

import { RootState } from "../../app/store";
import { useGetUsersQuery } from "../users/userSlice";

const EditPostForm = () => {
    const { postId } = useParams()
    const navigate = useNavigate()

    const [updatePost, { isLoading }] = useUpdatePostMutation()
    const [deletePost] = useDeletePostMutation()

    const post = useSelector((state: RootState) => selectPostById(state, postId || ''))
    const { data: users, isSuccess } = useGetUsersQuery();

    const [title, setTitle] = useState(post?.title || "")
    const [content, setContent] = useState(post?.body || "")
    const [userId, setUserId] = useState(post?.userId || 0)


    if (!post) {
        return (
            <section>
                <h2>Post not found!</h2>
            </section>
        )
    }
    

    const onTitleChanged = (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)
    const onContentChanged = (e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)
    const onAuthorChanged = (e: React.ChangeEvent<HTMLSelectElement>) => setUserId(Number(e.target.value))

    const canSave = [title, content, userId].every(Boolean) && !isLoading;

    const onSavePostClicked = async () => {
        if (canSave) {
            try {
                await updatePost({ id: post.id, title, body: content, userId, reactions: post.reactions}).unwrap()

                setTitle('')
                setContent('')
                setUserId(-1)
                navigate(`/post/${postId}`)
            } catch (err) {
                console.log('Failed to save the post', err)
            }
        }
    }
    const onDeletePostClicked = async () => {
        try {
            await deletePost({id: post.id}).unwrap()

            setTitle('')
            setContent('')
            setUserId(-1)
            navigate('/')
        } catch (err: any) {
            console.error('Failed to delete the post', err)
        }
    }

    let usersOptions = null;
    if (isSuccess) {
        usersOptions = users.ids.map((id) => (
            <option key={id} value={id}>
                {users.entities[id].name}
            </option>
        ))
    }

    return (
        <section>
            <h2>Edit Post</h2>
            <form>
                <label htmlFor="postTitle">Post Title:</label>
                <input
                    type="text"
                    id="postTitle"
                    name="postTitle"
                    value={title}
                    onChange={onTitleChanged}
                />
                <label htmlFor="postAuthor">Author:</label>
                <select id="postAuthor" defaultValue={userId} onChange={onAuthorChanged}>
                    <option value={undefined}></option>
                    {usersOptions}
                </select>
                <label htmlFor="postContent">Content:</label>
                <textarea
                    id="postContent"
                    name="postContent"
                    value={content}
                    onChange={onContentChanged}
                />
                <button
                    type="button"
                    onClick={onSavePostClicked}
                    disabled={!canSave}
                >Save Post</button>
                <button className="deleteButton"
                    type="button"
                    onClick={onDeletePostClicked}
                >Delete Post</button>
            </form>
        </section>
    )

}

export default EditPostForm;