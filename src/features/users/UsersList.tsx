import { useSelector } from "react-redux"
import { useGetUsersQuery } from "./userSlice"
import { Link } from "react-router-dom"

const UsersList = () => {
    const {
        data: users,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetUsersQuery()

    let content;
    if (isLoading) {
        content = <div>Loading...</div>
    } else if (isSuccess) {
        const renderedUsers = users.ids.map(userId => (
            <li key={userId}>
                <Link to={`/user/${userId}`}>{users.entities[userId].name}</Link>
            </li>
        ))
        content = (
            <section>
                <h2>Users</h2>
                <ul>{renderedUsers}</ul>
            </section>
        )
    } else if (isError) {
        content = <div>{error as any}</div>
    }

    return (
        <>
            {content}
        </>
    )
}
export default UsersList;