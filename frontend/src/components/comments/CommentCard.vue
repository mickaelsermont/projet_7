<template>
    <div>
        <b-card>
            <b-media>
                <template #aside>
                    <b-img :src="review.User.imgUrl" width="64" :alt="review.User.fullname"></b-img>
                </template>

                <h5 class="mt-0">{{ review.User.fullname }}</h5>
                <p>{{ review.text }}</p>
            </b-media>
        </b-card>
    </div>
</template>

<script>
    export default {
        name: "CommentCard",
        props: ['comment']
    };
</script>
