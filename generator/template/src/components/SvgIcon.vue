<template>
  <svg :class="svgClass" aria-hidden="true">
    <use :href="icon"></use>
      <linearGradient id="gradient-horizontal">
        <stop offset="0%" stop-color="var(--color-stop-1)" />
        <stop offset="50%" stop-color="var(--color-stop-2)" />
        <stop offset="100%" stop-color="var(--color-stop-3)" />
      </linearGradient>
      <linearGradient id="gradient-vertical" x2="0" y2="1">
        <stop offset="0%" stop-color="var(--color-stop-1)" />
        <stop offset="50%" stop-color="var(--color-stop-2)" />
        <stop offset="100%" stop-color="var(--color-stop-3)" />
      </linearGradient>
  </svg>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import {computed, h, ref} from "vue";
export default {
  name: "SvgIcon",
    props: {
      iconName: {
        required: true,
      },
      className: {
        type: String,
        required: false
      },
      outline:{
        type:Boolean,
        require: false,
        default: false
      }

    },
    setup(props){
      let icon = ref(null)
      let svgClass = computed(()=>{
        let className = props.className
        if(props.outline){
          className += ' outlined '
        }
        return className ? `svg-icon ${className}` : 'svg-icon '
      })
      // eslint-disable-next-line no-unused-vars
      // let IconFolder = "<%= IconFolderPath %>"
      const ExtractSprite = "<%= ExtractSprite %>"
      // icon.value =  require(`@/assets/${IconFolder}/${props.iconName}.svg`).default
      icon.value =JSON.parse(ExtractSprite)? `sprite.svg#icon-${props.iconName}`: `#icon-${props.iconName}`
      
      return{svgClass, icon}

    //   return () => h('svg',  {viewBox:icon.value.viewBox, class:svgClass.value,'aria-hidden':true, ...props},[
    //     h('use', {'href':icon.value.url})
    // ])
  }

}
</script>

<style scoped lang="scss">
.outlined{
  fill:none;
  stroke-width: 1;
}
.svg-icon {
    // fill: currentColor;
    //stroke: $svg-icon-stroke-color;
    //stroke: currentColor;
    //stroke-width: $svg-icon-stroke-width;
    overflow: hidden;
  &.stroke-animate {
      stroke-dasharray:60;
      stroke-dashoffset: 0;
      animation: dash 1s ease-in-out;
  }

}
@keyframes dash {
  from{
    stroke-dashoffset: 60;
  }
  to {
    stroke-dashoffset: 0;
  }
}

#gradient-horizontal {
  --color-stop-1: #a770ef;
  --color-stop-2: #cf8bf3;
  --color-stop-3: #fdb99b;
}
#gradient-vertical {
  --color-stop-1: #00c3ff;
  --color-stop-2: #77e190;
  --color-stop-3: #ffff1c;
}
.icon-hgradient {
    fill: url(#gradient-horizontal) #F59E0B;
}
.icon-vgradient {
    fill: url(#gradient-vertical) #1D4ED8;
}
</style>
