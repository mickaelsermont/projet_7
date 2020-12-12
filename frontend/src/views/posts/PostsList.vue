<template>
    <div>
        <b-row align-h="center">


            <b-col cols="7">
                <b-alert 
                    show
                    dismissible
                    fade
                    variant="success" v-if="$route.params.message"
                    > {{ $route.params.message }}</b-alert>
        
                <PostCard v-for="post in posts" :key="post.id" :post="post" class="mb-2" />
                <!-- <b-alert show variant="secondary" v-if="posts.length == null">Il n'y a aucun contenu !</b-alert> -->
                <div class="d-flex justify-content-center mb-3" v-if="posts.length == null">
                    <b-spinner label="Loading..."></b-spinner>
                </div>
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
                });
            }
        },
        created () {
            this.getPosts();
        }
    };
</script>

<style lang="scss" scoped>

</style>