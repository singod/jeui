<template>
    <div :class="cardClass">
        <div class="je-card-title" v-if="$slots.title">
            <slot name="title"></slot>
        </div>
        <div class="je-card-content" :style="bodyStyle">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'jeCard',
    props: {
        bordered: {
            type: Boolean,
            default: true
        },
        // always / hover / never
        shadow: {
            type: String,
            default: 'hover'
        },
        padding: {
            type: Number,
            default: 10
        }
    },
    computed: {
        cardClass(){
            return [
                'je-card',
                {
                    ['je-card-border']: this.bordered,
                    [`je-card-${this.shadow}-shadow`]: this.shadow != ''
                }
                
            ]
        },
        bodyStyle () {
            return {
                padding: `${this.padding}px`
            }
        }
    }
}
</script>

<style>
.je-card {border-radius: 4px;background-color: #fff;overflow: hidden;transition: .3s;position: relative;}
.je-card.je-card-border{border: 1px solid #e9e9e9;}
.je-card.je-card-always-shadow, 
.je-card.je-card-hover-shadow:focus, 
.je-card.je-card-hover-shadow:hover{box-shadow: 0 0 4px rgba(0,0,0,.15);}
.je-card .je-card-title{border-bottom: 1px solid #e9e9e9;box-sizing: border-box;padding: 10px;position: relative;}
.je-card .je-card-content{padding: 10px;position: relative;}
</style>
