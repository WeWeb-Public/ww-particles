<template>
    <div class="ww-particles">
        <div class="ww-particles">
            <!-- <wwObject class="background" v-bind:ww-object="wwObject.content.data.background" ww-category="background"></wwObject> -->
            <div>patate</div>
            <div class="particles-js"></div>
        </div>
    </div>
</template>
 

<script>			
import Vue from 'vue';
import Pjs from './constructors/Pjs'

/* ---------- global functions - vendors ------------ */

export default {
    name: "__COMPONENT_NAME__",
    props: {
        wwObjectCtrl: Object,
        wwAttrs: {
            type: Object,
            default: {}
        }
    },
    data() {
        return {
            pJS: {},
            pJSDom: []
        }
    },
    computed: {
        wwObject() {
            return this.wwObjectCtrl.get();
        },
        editMode() {
            return this.wwObjectCtrl.getEditMode() == 'CONTENT'
        }
    },
    watch: {
    },
    methods: {
        init() {
            this.loaded = true
            this.wwObject.content.data = this.wwObject.content.data || {}
            if (!this.wwObject.content.data.background) {
                this.wwObject.content.data.background = wwLib.wwObject.getDefault({
                    type: 'ww-color',
                    data: {}
                });
            }
            console.log('LAUNCH PARTICLEJS')
            this.particlesJS('particles-js', this.wwObject.content.data.config || this.getConfig(), this.$el);
            // this.loadParticles()
        },
        particlesJS(tag_id, params, el) {

            //console.log(params);

            /* no string id? so it's object params, and set the id with default id */
            if (typeof (tag_id) != 'string') {
                params = tag_id;
                tag_id = 'particles-js';
            }

            /* no id? set the id to default id */
            if (!tag_id) {
                tag_id = 'particles-js';
            }

            let _element = this.$el;
            /* pJS elements */
            let pJS_tag = _element.getElementsByClassName(tag_id),
                pJS_canvas_class = 'particles-js-canvas-el',
                exist_canvas = pJS_tag[0].getElementsByClassName(pJS_canvas_class);

            /* remove canvas if exists into the pJS target tag */
            if (exist_canvas.length) {
                while (exist_canvas.length > 0) {
                    pJS_tag[0].removeChild(exist_canvas[0]);
                }
            }

            /* create canvas element */
            let canvas_el = document.createElement('canvas');
            canvas_el.className = pJS_canvas_class;

            /* set size canvas */
            canvas_el.style.width = "100%";
            canvas_el.style.height = "100%";

            canvas_el.setAttribute("preserveAspectRatio", "none");

            /* append canvas */
            let canvas = pJS_tag[0].appendChild(canvas_el);

            console.log('CANVAS : ', canvas);

            /* launch particle.js */
            if (canvas != null) {
                // let pJS = new Pjs({ _element: pJS_tag[0], params: params, window: window })
                this.pJSDom.push(new Pjs({ _element: pJS_tag[0], params: params, window: window }));
                // pJS.eventsListeners();
                // pJS.start()
            }

        },
        getConfig() {
            let json = {
                "particles": {
                    "number": {
                        "value": this.wwObject.content.data.particlesNumberValue || 50,
                        "density": {
                            "enable": true,
                            "value_area": 800
                        }
                    },
                    "color": {
                        "value": this.wwObject.content.data.particlesColorValue || "#5aac3e"
                    },
                    "shape": {
                        "type": this.wwObject.content.data.particlesShapeType || "circle",
                        "stroke": {
                            "width": this.wwObject.content.data.particlesShapeStrokeWidth || 5,
                            "color": this.wwObject.content.data.particlesShapeStrokeColor || "#5aac3e"
                        },
                        "polygon": {
                            "nb_sides": 5
                        },
                        "image": {
                            "src": "img/github.svg",
                            "width": 100,
                            "height": 100
                        }
                    },
                    "opacity": {
                        "value": this.wwObject.content.data.particlesOpacityValue || 0.5,
                        "random": false,
                        "anim": {
                            "enable": false,
                            "speed": 1,
                            "opacity_min": 0.1,
                            "sync": false
                        }
                    },
                    "size": {
                        "value": this.wwObject.content.data.particlesSizeValue || 3,
                        "random": true,
                        "anim": {
                            "enable": false,
                            "speed": 40,
                            "size_min": 0.1,
                            "sync": false
                        }
                    },
                    "line_linked": {
                        "enable": this.wwObject.content.data.particlesLine_linkedEnable || true,
                        "distance": this.wwObject.content.data.particlesLine_linkedDistance || 200,
                        "color": this.wwObject.content.data.particlesLine_linkedColor || "#deeed6",
                        "opacity": this.wwObject.content.data.particlesLine_linkedOpacity || 0.4,
                        "width": this.wwObject.content.data.particlesLine_linkedWidth || 1
                    },
                    "move": {
                        "enable": this.wwObject.content.data.particlesMoveEnable || true,
                        "speed": this.wwObject.content.data.particlesMoveSpeed || 6,
                        "direction": this.wwObject.content.data.particlesMoveDirection || "none",
                        "random": this.wwObject.content.data.particlesMoveRandom || true,
                        "straight": this.wwObject.content.data.particlesMoveStraight || false,
                        "out_mode": this.wwObject.content.data.particlesMoveOut_mode || "out",
                        "bounce": this.wwObject.content.data.particlesMoveBounce || false,
                        "attract": {
                            "enable": this.wwObject.content.data.particlesMoveAttractEnable || false,
                            "rotateX": 600,
                            "rotateY": 1200
                        }
                    }
                },
                "interactivity": {
                    "detect_on": "canvas",
                    "events": {
                        "onhover": {
                            "enable": true,
                            "mode": "grab"
                        },
                        "onclick": {
                            "enable": true,
                            "mode": "push"
                        },
                        "resize": true
                    },
                    "modes": {
                        "grab": {
                            "distance": 450,
                            "line_linked": {
                                "opacity": 1
                            }
                        },
                        "bubble": {
                            "distance": 400,
                            "size": 40,
                            "duration": 2,
                            "opacity": 8,
                            "speed": 3
                        },
                        "repulse": {
                            "distance": 200,
                            "duration": 0.4
                        },
                        "push": {
                            "particles_nb": 4
                        },
                        "remove": {
                            "particles_nb": 2
                        }
                    }
                },
                "retina_detect": true
            }
            return json;
        },

        // initContentDataConfig() {
        //     this.wwObject.content.data.particlesNumberValue = this.wwObject.content.data.particlesNumberValue || 50;
        //     this.wwObject.content.data.particlesColorValue = this.wwObject.content.data.particlesColorValue || "#5aac3e";
        //     this.wwObject.content.data.particlesShapeType = this.wwObject.content.data.particlesShapeType || "circle";
        //     this.wwObject.content.data.particlesShapeStrokeWidth = this.wwObject.content.data.particlesShapeStrokeWidth || 5;
        //     this.wwObject.content.data.particlesShapeStrokeColor = this.wwObject.content.data.particlesShapeStrokeColor || "#5aac3e";
        //     this.wwObject.content.data.particlesOpacityValue = this.wwObject.content.data.particlesOpacityValue || 0.5;
        //     this.wwObject.content.data.particlesSizeValue = this.wwObject.content.data.particlesSizeValue || 3;
        //     this.wwObject.content.data.particlesLine_linkedEnable = this.wwObject.content.data.particlesLine_linkedEnable || true;
        //     this.wwObject.content.data.particlesLine_linkedDistance = this.wwObject.content.data.particlesLine_linkedDistance || 200;
        //     this.wwObject.content.data.particlesLine_linkedColor = this.wwObject.content.data.particlesLine_linkedColor || "#deeed6";
        //     this.wwObject.content.data.particlesLine_linkedOpacity = this.wwObject.content.data.particlesLine_linkedOpacity || 0.4;
        //     this.wwObject.content.data.particlesLine_linkedWidth = this.wwObject.content.data.particlesLine_linkedWidth || 1;
        //     this.wwObject.content.data.particlesMoveEnable = this.wwObject.content.data.particlesMoveEnable || true;
        //     this.wwObject.content.data.particlesMoveSpeed = this.wwObject.content.data.particlesMoveSpeed || 6;
        //     this.wwObject.content.data.particlesMoveDirection = this.wwObject.content.data.particlesMoveDirection || "none";
        //     this.wwObject.content.data.particlesMoveRandom = this.wwObject.content.data.particlesMoveRandom || true;
        //     this.wwObject.content.data.particlesMoveStraight = this.wwObject.content.data.particlesMoveStraight || false;
        //     this.wwObject.content.data.particlesMoveOut_mode = this.wwObject.content.data.particlesMoveOut_mode || "out";
        //     this.wwObject.content.data.particlesMoveBounce = this.wwObject.content.data.particlesMoveBounce || false;
        //     this.wwObject.content.data.particlesMoveAttractEnable = this.wwObject.content.data.particlesMoveAttractEnable || false;
        // }


    },
    mounted() {
        this.init();

        wwLib.wwElementsStyle.applyAllStyles({
            wwObject: this.wwObject,
            lastWwObject: null,
            element: this.$el,
            noAnim: this.wwAttrs.wwNoAnim,
            noClass: false,
        });

        this.$emit('ww-loaded', this);

    },
    beforeDestroyed() {
        //window.removeEventListener('resize', this.wwOnResize);
    }
};
</script>

<style lang="scss" thisd>
.ww-markdown {
    position: relative;
    width: 100%;
    height: 100%;
}
</style>
