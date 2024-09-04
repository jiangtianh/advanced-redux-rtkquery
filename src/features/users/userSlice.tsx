import { apiSlice } from "../api/apiSlice";
import { createEntityAdapter, EntityState } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

type Geo = {
    lat: string;
    lng: string;
}
type Address = {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: Geo;
}
type Company = {
    name: string;
    catchPhrase: string;
    bs: string;
}
type User = {
    id: number;
    name: string;
    username: string;
    email: string;
    address: Address;
    phone: string;
    website: string;
    company: Company;
};

const usersAdapter = createEntityAdapter({
    selectId: (user: User) => user.id.toString()
})

const initialState = usersAdapter.getInitialState()

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        getUsers: builder.query<EntityState<User, string>, void>({
            query: () => '/users',
            transformResponse: (users: User[]) => {
                return usersAdapter.setAll(initialState, users)
            },
            providesTags: (result, error, arg) => {
                const tags: { type: 'User', id: string }[] = [{ type: 'User' as const, id: 'LIST' }]
                if (result?.ids) {
                    tags.push(...result.ids.map(id => ({ type: 'User' as const, id })))
                }
                return tags
            }
        }),

        getUserById: builder.query<User, string>({
            query: (id) => `/users/${id}`,
            transformResponse: (user: User) => {
                return user
            },
            providesTags: (result, error, id) => [{ type: 'User', id }]
        })

    })
})

export const {
    useGetUsersQuery,
    useGetUserByIdQuery
} = userApiSlice

