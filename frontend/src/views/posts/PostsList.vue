<template>
    <div>

        <b-row>
            <b-col md="7" offset-md="3">
                <b-alert 
                    show
                    dismissible
                    fade
                    variant="success" v-if="$route.params.message"
                    > {{ $route.params.message }}</b-alert>
        
                <PostCard v-for="post in posts" :key="post.id" :post="post" :reviews="post.Comments" :getData="getPosts" class="mb-2" />

                <div class="d-flex justify-content-center mb-3" v-if="posts.length == null">
                    <b-spinner label="Loading..."></b-spinner>
                </div>
                <!-- <b-alert show variant="secondary" v-if="posts.length == null">Il n'y a aucun contenu !</b-alert> -->
            </b-col>
        </b-row>
        
    </div>
</template>

<script>
    import axios from "axios"
    import PostCard from '@/components/posts/PostCard'

    export default {
        name: "postsList",
        components: {
            PostCard
        },
        data () {
            return {
                posts: {}
            }
        },
        methods: {
            getPosts() {
                axios.get('posts').then(response => {
                    this.posts = response.data
                    console.log(response.data);
                });
            }
        },
        created () {
            this.getPosts();
        }
    };
</script>

