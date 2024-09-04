import { createSelector, createEntityAdapter, EntityState } from "@reduxjs/toolkit";
import { sub } from "date-fns";
import { RootState } from "../../app/store";
import { apiSlice } from "../api/apiSlice";

export type Reaction = {
    thumbsUp: number;
    hooray: number;
    heart: number;
    rocket: number;
    eyes: number;
}

export type Post = {
    id: number;
    title: string;
    body: string;
    userId: number;
    date: string;
    reactions: Reaction;
}


const postsAdapter = createEntityAdapter({
    selectId: (post: Post) => post.id.toString(),
    // This is a custom sort function that will sort posts by date
    // It only sorts the ids array, not the entities object
    sortComparer: (a, b) => b.date.localeCompare(a.date) 
})


const initialState = postsAdapter.getInitialState()


export const extendedApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({

        getPosts: builder.query<EntityState<Post, string>, void>({
            query: () => '/posts',
            transformResponse: (responseData: Post[]) => {
                let min = 1;
                const loadedPost = responseData.map((post: any) => {
                    if (!post?.date) {
                        post.date = sub(new Date(), { minutes: min }).toISOString();
                        min++;
                    }
                    if (!post?.reactions) {
                        post.reactions = {
                            thumbsUp: 0,
                            hooray: 0,
                            heart: 0,
                            rocket: 0,
                            eyes: 0
                        }
                    }
                    return post;
                });
                return postsAdapter.setAll(initialState, loadedPost)
            },
            providesTags: (result, error, arg) => {
                const tags: { type: 'Post'; id: string }[] = [{ type: 'Post' as const, id: "LIST" }];
                if (result?.ids) {
                    tags.push(...result.ids.map(id => ({ type: 'Post' as const, id })));
                }
                return tags; 
            }
        }),
    
        getPostsByUserId: builder.query<EntityState<Post, string>, number>({
            query: (userId: number) => `/posts?userId=${userId}`,
            transformResponse: (responseData: Post[]) => {
                let min = 1;
                const loadedPosts = responseData.map((post) => {
                    if (!post?.date) {
                        post.date = sub(new Date(), { minutes: min }).toISOString();
                        min++;
                    }
                    if (!post?.reactions) {
                        post.reactions = {
                            thumbsUp: 0,
                            hooray: 0,
                            heart: 0,
                            rocket: 0,
                            eyes: 0
                        }
                    }
                    return post;
                });
                return postsAdapter.setAll(initialState, loadedPosts)
            },
            providesTags: (result, error, arg) => {
                console.log(result)
                return result ? [ ...result.ids.map(id => ({ type: 'Post' as const, id })) ] : []
            }
        }),

        addNewPost: builder.mutation<Post, Partial<Post>>({
            query: (initialPost) => ({
                url: '/posts',
                method: 'POST',
                body: {
                    ...initialPost,
                    userId: Number(initialPost.userId),
                    date: new Date().toISOString(),
                    reactions: {
                        thumbsUp: 0,
                        hooray: 0,
                        heart: 0,
                        rocket: 0,
                        eyes: 0
                    }
                }
            }),
            invalidatesTags: [{ type: 'Post', id: 'LIST' }]
        }),
        
        updatePost: builder.mutation<Post, Partial<Post>>({
            query: (initialPost) => ({
                url: `/posts/${initialPost.id}`,
                method: 'PUT',
                body: {
                    ...initialPost,
                    date: new Date().toISOString()
                }
            }),
            invalidatesTags: (result, error, arg) => [
                {type: 'Post', id: arg.id?.toString()}
            ]
        }),

        deletePost: builder.mutation<void, Partial<Post>>({
            query: ({ id }) => ({
                url: `/posts/${id}`,
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                {type: 'Post', id: arg.id?.toString()}
            ]
        }),

        addReaction: builder.mutation<Post, { id: string, reactions: Reaction}>({
            query: ({ id, reactions }) => ({
                url: `/posts/${id}`,
                method: 'PATCH',
                body: { reactions }
            }),
            async onQueryStarted({ id, reactions }, { dispatch, queryFulfilled }) {
                // `u[dateQueryData` reauiresthe endpoint name and cache key arguments, so it knows which piece of cache state to update 
                // All the patchResult is doing is its updating the cache. So if the query fails, we can undo the cache update
                const patchResult = dispatch(
                    extendedApiSlice.util.updateQueryData('getPosts', undefined, (draft) => {
                        // The `draft` is Immer-wrapped and can be mutated like in createSlice
                        const post = draft.entities[id];
                        if (post) post.reactions = reactions;
                    })
                )
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            }
        })
    })
})


export const {
    useGetPostsQuery,
    useGetPostsByUserIdQuery,
    useAddNewPostMutation,
    useUpdatePostMutation,
    useDeletePostMutation,
    useAddReactionMutation
} = extendedApiSlice;

// retutn the cached query result object
export const selectPostsResult = extendedApiSlice.endpoints.getPosts.select()

// Create memoized selector, first argument is input selector, second argument is output selector
// The output selector's input is the result of the input selector
const selectPostsData = createSelector(
    selectPostsResult,
    postsResult => postsResult.data // normalized state object with ids & entities
)

//getSelectors create these selectors and we rename them with aliases using object destructuring
export const {
    selectAll: selectAllPosts,
    selectById: selectPostById,
    selectIds: selectPostIds
} = postsAdapter.getSelectors((state: RootState) => selectPostsData(state) ?? initialState)


