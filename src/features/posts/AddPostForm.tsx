import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../../app/store";
import { useGetUsersQuery } from "../users/userSlice";
import { useNavigate } from "react-router-dom";
import { useAddNewPostMutation } from "./postsSlice";

const AddPostForm = () => {

    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [userId, setUserId] = useState("");

    const [addNewPost, { isLoading }] = useAddNewPostMutation();

    const onTitleChanged = (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);
    const onContentChanged = (e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value);
    const onAuthorChanged = (e: React.ChangeEvent<HTMLSelectElement>) => setUserId(e.target.value);

    const canSave = [title, content, userId].every(Boolean) && !isLoading;

    const { data: users, isSuccess } = useGetUsersQuery();

    const onSavePostClicked = async () => {
        if (canSave) {
            try {
                await addNewPost({ title, body: content, userId: Number(userId) }).unwrap();

                setTitle("");
                setContent("");
                setUserId("");
                navigate('/')
            } catch (err) {
                console.error("Failed to save the post: ", err);
            }
        }
    };

   
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
            <h2>Add a New Post</h2>
            <form>
                <label htmlFor="postTitle">Post Title:</label>
                <input type="text" id="postTitle" name="postTitle" value={title} onChange={onTitleChanged} />

                <label htmlFor="postAuthor">Author:</label>
                <select id="postAuthor" value={userId} onChange={onAuthorChanged}>
                    <option value=""></option>
                    {usersOptions}
                </select>

                <label htmlFor="postContent">Content:</label>
                <textarea id="postContent" name="postContent" value={content} onChange={onContentChanged} />
                
                <button type="button" onClick={onSavePostClicked} disabled={!canSave}>Save Post</button>
            </form>
        </section>
    );
};
export default AddPostForm;