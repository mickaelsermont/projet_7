<template>
    <div>
        <!-- <router-link :to="{ name: 'showMedia', params: {mediaId: media.id } }"> -->
        <b-card no-body class="post_card">
            <template #header>
                <b-media class="p-0">
                    <template #aside vertical-align="center" class="mb-1">
                        <b-img :src="post.User.imgUrl" width="48" height="48" :alt="post.User.fullname" rounded></b-img>
                    </template>

                    <h5 class="mt-0 mb-0">{{ post.User.fullname }}</h5>
                    <em class="mb-0">{{ post.createdAt | moment("from", "now") }}</em>

                    <p left class="mt-2 mb-0">{{ post.text }}</p>
                </b-media>
            </template>
            
            <!-- image of post card -->
            <b-img-lazy v-if="post.mediaUrl !== null" :src="post.mediaUrl" fluid-grow alt="Fluid-grow image"></b-img-lazy>

            <template #footer>
                <div class="line_post">
                    <a href="#" class="card-link">
                        <div class="like_button">
                            <b-icon class="mr-1" icon="heart" font-scale="1.3"></b-icon>
                            <span class="pl-1">J'aime</span>
                        </div>
                    </a>
                    
                    <span>{{ post.countLikes }} likes | {{ reviews.length }} commentaires</span>
                </div>
                <!-- <hr v-if="reviews.length > 0"> -->
                <hr>
                <!-- List comments -->
                <b-media v-for="review in reviews" :key="review.id">
                    <template #aside>
                        <b-img :src="review.User.imgUrl" width="40" height="40" :alt="review.User.fullname" rounded></b-img>
                    </template>

                    <h6 class="m-0">{{ review.User.fullname }}
                    </h6>
                        <span v-if="review.UserId === user.id" v-on:click="deleteComment(review.id)">Delete</span>
                    <p>{{ review.text }}</p>
                </b-media>

                <!-- Form for to add comment -->
                <b-media>
                    <template #aside>
                        <b-img :src="user.imgUrl" width="40" height="40" alt="profil" rounded></b-img>
                    </template>

                    <b-form inline v-on:submit.prevent="addNewComment()">
                        <b-form-input
                            id="inline-form-comment"
                            class="mr-sm-2 mb-sm-0"
                            placeholder="Laisser un commentaire"
                            v-model="text"
                            type="text"
                        ></b-form-input>

                        <b-button variant="outline-primary" type="submit">
                            <b-icon icon="reply-fill" font-scale="1.3"></b-icon>
                        </b-button>
                    </b-form>
                </b-media>
            
            </template>
        </b-card>
    </div>
</template>

<script>
    import axios from "axios"
    import { mapGetters } from 'vuex'

    export default {
        name: "PostCard",
        props: {
            post: Object,
            reviews: Array,
            getData: Function
        },
        data () {
            return {
                text: ""
            }
        },
        methods: {
            addNewComment() {
                axios
                    .post('comments/', {
                        text: this.text,
                        post_id: this.post.id
                    })
                    .then(() => {
                        this.text = '';
                        this.getData();
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            },
            deleteComment(id) {
                axios
                    .delete('comments/'+id, { data : { post_id: this.post.id } })
                    .then(() => {
                        this.getData();
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        },
        computed: {
            ...mapGetters({
                user: 'auth/user'
            })
        },
    };
</script>

<style lang="scss" scoped>
.post_card {
    border-radius: 9px;
    overflow: hidden;
    margin-bottom: 14px;
}
.like_button, .line_post {
    display: flex;
    flex-direction: row;
    align-items: center;
}
.line_post {
    justify-content: space-between;
}
.card-header, .card-footer {
    background-color: rgba(0,0,0,0.01)!important;
}
#inline-form-comment {
    // width: 100%;
    flex: 1;
}
</style>
