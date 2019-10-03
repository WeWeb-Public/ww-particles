<template>
    <div class="ww-particles">
        <!-- <wwObject class="background" :ww-object="wwObject.content.data.background" ww-category="background"></wwObject> -->
        <div class="particles-js"></div>
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
    methods: {
        init() {
            this.loaded = true
            this.wwObject.content.data = this.wwObject.content.data || {}
            if (!this.wwObject.content.data.background) {
                this.wwObject.content.data.background = wwLib.wwObject.getDefault({
                    type: 'ww-color',
                    data: {
                        backgroundColor: '#f3f5f7'
                    }
                });
            }

            this.wwObject.content.data.particlesNumberValue = this.wwObject.content.data.particlesNumberValue || 50
            this.wwObject.content.data.particlesColorValue = this.wwObject.content.data.particlesColorValue || "#5aac3e"
            this.wwObject.content.data.particlesShapeType = this.wwObject.content.data.particlesShapeType || "circle"
            this.wwObject.content.data.particlesShapeStrokeWidth = this.wwObject.content.data.particlesShapeStrokeWidth || 5
            this.wwObject.content.data.particlesShapeStrokeColor = this.wwObject.content.data.particlesShapeStrokeColor || "#5aac3e"
            this.wwObject.content.data.particlesOpacityValue = this.wwObject.content.data.particlesOpacityValue || 0.5
            this.wwObject.content.data.particlesSizeValue = this.wwObject.content.data.particlesSizeValue || 3
            this.wwObject.content.data.particlesLine_linkedEnable = this.wwObject.content.data.particlesLine_linkedEnable || true
            this.wwObject.content.data.particlesLine_linkedDistance = this.wwObject.content.data.particlesLine_linkedDistance || 200
            this.wwObject.content.data.particlesLine_linkedColor = this.wwObject.content.data.particlesLine_linkedColor || "#deeed6"
            this.wwObject.content.data.particlesLine_linkedOpacity = this.wwObject.content.data.particlesLine_linkedOpacity || 0.4
            this.wwObject.content.data.particlesLine_linkedWidth = this.wwObject.content.data.particlesLine_linkedWidth || 1
            this.wwObject.content.data.particlesMoveEnable = this.wwObject.content.data.particlesMoveEnable || true
            this.wwObject.content.data.particlesMoveSpeed = this.wwObject.content.data.particlesMoveSpeed || 6
            this.wwObject.content.data.particlesMoveDirection = this.wwObject.content.data.particlesMoveDirection || "none"
            this.wwObject.content.data.particlesMoveRandom = this.wwObject.content.data.particlesMoveRandom || true
            this.wwObject.content.data.particlesMoveStraight = this.wwObject.content.data.particlesMoveStraight || false
            this.wwObject.content.data.particlesMoveOut_mode = this.wwObject.content.data.particlesMoveOut_mode || "out"
            this.wwObject.content.data.particlesMoveOut_mode = this.wwObject.content.data.particlesMoveOut_mode == 'bounce'

            this.particlesJS('particles-js', this.wwObject.content.data.config || this.getConfig(), this.$el);
        },
        particlesJS(tag_id, params, el) {

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

            /* launch particle.js */
            if (canvas != null) {
                // let pJS = new Pjs({ _element: pJS_tag[0], params: params, window: window })
                this.pJSDom.push(new Pjs({ _element: pJS_tag[0], params: params, window: window }));
                // pJS.eventsListeners();
                // pJS.start()
            }

        },
        removePaticles() {

            /* pJS elements */
            var pJS_tag = element[0].getElementsByClassName('particles-js'),
                pJS_canvas_class = 'particles-js-canvas-el',
                exist_canvas = pJS_tag[0].getElementsByClassName(pJS_canvas_class);

            /* remove canvas if exists into the pJS target tag */
            if (exist_canvas.length) {
                while (exist_canvas.length > 0) {
                    pJS_tag[0].removeChild(exist_canvas[0]);
                }
            }
            this.pJSDom = []
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
                        "bounce": this.wwObject.content.data.particlesMoveOut_mode == 'bounce',
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
        // async options() {
        //     try {
        //         wwLib.wwObjectHover.setLock(this);
        //         let options = await this.edit()
        //         const result = await wwLib.wwPopups.open(options);
        //         /*=============================================m_ÔÔ_m=============================================\
        //           STYLE
        //         \================================================================================================*/
        //         if (typeof (result) != 'undefined') {
        //             if (typeof (result.backgroundColor) != 'undefined') {
        //                 this.wwObject.content.data.background = wwLib.wwObject.getDefault({
        //                     type: "ww-color",
        //                     data: {
        //                         backgroundColor: result.backgroundColor
        //                     }
        //                 })
        //             }
        //             if (typeof (result.borderColor) != 'undefined') {
        //                 this.wwObject.content.data.borderColor = result.borderColor;
        //             }
        //             if (typeof (result.styleColor) != 'undefined') {
        //                 this.wwObject.content.data.styleColor = result.styleColor;
        //             }
        //             if (typeof (result.title) != 'undefined') {
        //                 if (typeof (this.wwObject.content.data.tips) != 'undefined') {
        //                     this.wwObject.content.data.tips[0] = wwLib.wwObject.getDefault({
        //                         type: "ww-text",
        //                         data: {
        //                             text: result.title
        //                         }
        //                     })
        //                 }
        //             }
        //             this.wwObjectCtrl.update(this.wwObject)
        //         }
        //         wwLib.wwObjectHover.removeLock();
        //     } catch (error) {
        //         console.error(error);
        //     }
        // },
        /* wwManager:start */
        async edit() {
            let editList = {
                WWPARTICLES_CONFIG: {
                    title: {
                        en: 'Config particles',
                        fr: 'Configurer les particules'
                    },
                    desc: {
                        en: 'Change colors, shapes, movments, etc.',
                        fr: 'Changer les couleurs, les formes, le mouvement, etc.'
                    },
                    icon: 'wwi wwi-config',
                    shortcut: 'c',
                    next: 'WWPARTICLES_CONFIG'
                }
            }
            wwLib.wwPopups.addStory('WWPARTICLES_EDIT', {
                title: {
                    en: 'Edit particles',
                    fr: 'Editer les particules '
                },
                type: 'wwPopupEditWwObject',
                buttons: null,
                storyData: {
                    list: editList
                }
            })
            wwLib.wwPopups.addStory('WWPARTICLES_CONFIG', {
                title: {
                    en: 'Color picker',
                    fr: 'Choisir une couleur'
                },
                type: 'wwPopupForm',
                storyData: {
                    fields: [
                        {
                            label: {
                                en: 'Number of particles:',
                                fr: 'Nombre de particules :'
                            },
                            type: 'text',
                            key: 'particlesNumberValue',
                            valueData: 'wwObject.content.data.particlesNumberValue'
                        },
                        {
                            label: {
                                en: 'Particle color:',
                                fr: 'Couleur des particules :'
                            },
                            type: 'color',
                            key: 'particlesColorValue',
                            valueData: 'wwObject.content.data.particlesColorValue',
                        },
                        {
                            label: {
                                en: 'Particle Shape :',
                                fr: 'Forme des particules :'
                            },
                            type: 'select',
                            key: 'particlesShapeType',
                            valueData: 'wwObject.content.data.particlesShapeType',
                            options: {
                                type: 'text',
                                values: [
                                    {
                                        value: 'circle',
                                        default: true,
                                        text: {
                                            en: 'Circle',
                                            fr: 'Rond'
                                        }
                                    },
                                    {
                                        value: 'edge',
                                        default: true,
                                        text: {
                                            en: 'Edge',
                                            fr: 'Carré'
                                        }
                                    },
                                    {
                                        value: 'triangle',
                                        default: true,
                                        text: {
                                            en: 'Triangle',
                                            fr: 'Triangle'
                                        }
                                    },
                                    {
                                        value: 'polygon',
                                        default: true,
                                        text: {
                                            en: 'Polygon',
                                            fr: 'Polygone'
                                        }
                                    },
                                    {
                                        value: 'star',
                                        default: true,
                                        text: {
                                            en: 'Star',
                                            fr: 'Étoile'
                                        }
                                    },
                                ]
                            }
                        },
                        {
                            label: {
                                en: 'Widh of particles border:',
                                fr: 'Épaisseur des bordures des particules :'
                            },
                            type: 'text',
                            key: 'particlesShapeStrokeWidth',
                            valueData: 'wwObject.content.data.particlesShapeStrokeWidth'
                        },
                        {
                            label: {
                                en: 'Border particle color:',
                                fr: 'Couleur des bordures des particules :'
                            },
                            type: 'color',
                            key: 'particlesShapeStrokeColor',
                            valueData: 'wwObject.content.data.particlesShapeStrokeColor',
                        },
                        {
                            label: {
                                en: 'Particle opacity:',
                                fr: 'Opacité des particules :'
                            },
                            type: 'text',
                            key: 'particlesOpacityValue',
                            valueData: 'wwObject.content.data.particlesOpacityValue'
                        },
                        {
                            label: {
                                en: 'Particle size:',
                                fr: 'Epaisseur des particules :'
                            },
                            type: 'text',
                            key: 'particlesSizeValue',
                            valueData: 'wwObject.content.data.particlesSizeValue'
                        },
                        {
                            label: {
                                en: 'Enable links between particles:',
                                fr: 'Activer les liens entre les particules :'
                            },
                            type: 'radio',
                            key: 'particlesLine_linkedEnable',
                            valueData: 'wwObject.content.data.particlesLine_linkedEnable'
                        },
                        {
                            label: {
                                en: 'Distance when to activate links:',
                                fr: 'Distace d\'activation des liens :'
                            },
                            type: 'text',
                            key: 'particlesLine_linkedDistance',
                            valueData: 'wwObject.content.data.particlesLine_linkedDistance'
                        },
                        {
                            label: {
                                en: 'Link color:',
                                fr: 'Couleur des liens :'
                            },
                            type: 'color',
                            key: 'particlesLine_linkedColor',
                            valueData: 'wwObject.content.data.particlesLine_linkedColor',
                        },
                        {
                            label: {
                                en: 'Link opacity:',
                                fr: 'Opacité des liens :'
                            },
                            type: 'text',
                            key: 'particlesLine_linkedOpacity',
                            valueData: 'wwObject.content.data.particlesLine_linkedOpacity'
                        },
                        {
                            label: {
                                en: 'Link size:',
                                fr: 'Epaisseur des liens :'
                            },
                            type: 'text',
                            key: 'particlesLine_linkedWidth',
                            valueData: 'wwObject.content.data.particlesLine_linkedWidth'
                        },
                        {
                            label: {
                                en: 'Enable particles movement:',
                                fr: 'Activer le mouvement des particules :'
                            },
                            type: 'radio',
                            key: 'particlesMoveEnable',
                            valueData: 'wwObject.content.data.particlesMoveEnable'
                        },
                        {
                            label: {
                                en: 'Movement speed:',
                                fr: 'Vitesse de déplacement des particules :'
                            },
                            type: 'text',
                            key: 'particlesMoveSpeed',
                            valueData: 'wwObject.content.data.particlesMoveSpeed'
                        },
                        {
                            label: {
                                en: 'Particle Shape :',
                                fr: 'Forme des particules :'
                            },
                            type: 'select',
                            key: 'particlesMoveDirection',
                            valueData: 'wwObject.content.data.particlesMoveDirection',
                            options: {
                                type: 'text',
                                values: [
                                    {
                                        value: 'top',
                                        default: true,
                                        text: {
                                            en: 'Top',
                                            fr: 'Vers le haut'
                                        }
                                    },
                                    {
                                        value: 'top-right',
                                        default: true,
                                        text: {
                                            en: 'Top right',
                                            fr: 'En haut à droite'
                                        }
                                    },
                                    {
                                        value: 'right',
                                        default: true,
                                        text: {
                                            en: 'Right',
                                            fr: 'À droite'
                                        }
                                    },
                                    {
                                        value: 'bottom-right',
                                        default: true,
                                        text: {
                                            en: 'Bottom right',
                                            fr: 'En bas à droite'
                                        }
                                    },
                                    {
                                        value: 'bottom',
                                        default: true,
                                        text: {
                                            en: 'Bottom',
                                            fr: 'Vers le bas'
                                        }
                                    },
                                    {
                                        value: 'bottom',
                                        default: true,
                                        text: {
                                            en: 'Bottom',
                                            fr: 'Vers le bas'
                                        }
                                    },
                                    {
                                        value: 'left',
                                        default: true,
                                        text: {
                                            en: 'Left',
                                            fr: 'À Gauche'
                                        }
                                    },
                                    {
                                        value: 'top-left',
                                        default: true,
                                        text: {
                                            en: 'Top Left',
                                            fr: 'En haut à gauche'
                                        }
                                    },
                                ]
                            }
                        },
                        {
                            label: {
                                en: 'Enable random movement:',
                                fr: 'Activer un mouvement aléatoire des particules :'
                            },
                            type: 'radio',
                            key: 'particlesMoveRandom',
                            valueData: 'wwObject.content.data.particlesMoveRandom'
                        },
                        {
                            label: {
                                en: 'Enable straight movement:',
                                fr: 'Activer un mouvement droit des particules :'
                            },
                            type: 'radio',
                            key: 'particlesMoveStraight',
                            valueData: 'wwObject.content.data.particlesMoveStraight'
                        },
                        {
                            label: {
                                en: 'Border behaviour :',
                                fr: 'Comportement au bord :'
                            },
                            type: 'select',
                            key: 'particlesMoveOut_mode',
                            valueData: 'wwObject.content.data.particlesMoveOut_mode',
                            options: {
                                type: 'text',
                                values: [
                                    {
                                        value: 'out',
                                        default: true,
                                        text: {
                                            en: 'Out',
                                            fr: 'Sortant'
                                        }
                                    },
                                    {
                                        value: 'bounce',
                                        default: true,
                                        text: {
                                            en: 'Bounce',
                                            fr: 'Rebondissant au bord'
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            label: {
                                en: 'Enable attraction between particles:',
                                fr: 'Activer l\'attraction entre les particules :'
                            },
                            type: 'radio',
                            key: 'particlesMoveAttractEnable',
                            valueData: 'wwObject.content.data.particlesMoveAttractEnable'
                        },
                    ]
                },
                buttons: {
                    NEXT: {
                        text: {
                            en: 'Ok',
                            fr: 'Ok'
                        },
                        next: false
                    }
                }
            })
            let options = {
                firstPage: 'WWPARTICLES_EDIT',
                data: {
                    wwObject: this.wwObject,
                }
            }
            try {
                const result = await wwLib.wwPopups.open(options);
                console.log('result', result)
                /*=============================================m_ÔÔ_m=============================================\
                  FORM CONFIGURATION
                \================================================================================================*/
                if (typeof (result.particlesNumberValue) != 'undefined') {
                    this.wwObject.content.data.particlesNumberValue = result.particlesNumberValue;
                }
                if (typeof (result.particlesColorValue) != 'undefined') {
                    this.wwObject.content.data.particlesColorValue = result.particlesColorValue;
                }
                if (typeof (result.particlesShapeType) != 'undefined') {
                    this.wwObject.content.data.particlesShapeType = result.particlesShapeType;
                }
                if (typeof (result.particlesShapeStrokeWidth) != 'undefined') {
                    this.wwObject.content.data.particlesShapeStrokeWidth = result.particlesShapeStrokeWidth;
                }
                if (typeof (result.particlesShapeType) != 'undefined') {
                    this.wwObject.content.data.particlesShapeStrokeColor = result.particlesShapeStrokeColor;
                }
                if (typeof (result.particlesOpacityValue) != 'undefined') {
                    this.wwObject.content.data.particlesOpacityValue = result.particlesOpacityValue;
                }
                if (typeof (result.particlesSizeValue) != 'undefined') {
                    this.wwObject.content.data.particlesSizeValue = result.particlesSizeValue;
                }
                if (typeof (result.particlesLine_linkedEnable) != 'undefined') {
                    this.wwObject.content.data.particlesLine_linkedEnable = result.particlesLine_linkedEnable;
                }
                if (typeof (result.particlesLine_linkedDistance) != 'undefined') {
                    this.wwObject.content.data.particlesLine_linkedDistance = result.particlesLine_linkedDistance;
                }
                if (typeof (result.particlesLine_linkedColor) != 'undefined') {
                    this.wwObject.content.data.particlesLine_linkedColor = result.particlesLine_linkedColor;
                }
                if (typeof (result.particlesLine_linkedOpacity) != 'undefined') {
                    this.wwObject.content.data.particlesLine_linkedOpacity = result.particlesLine_linkedOpacity;
                }
                if (typeof (result.particlesLine_linkedWidth) != 'undefined') {
                    this.wwObject.content.data.particlesLine_linkedWidth = result.particlesLine_linkedWidth;
                }
                if (typeof (result.particlesMoveEnable) != 'undefined') {
                    this.wwObject.content.data.particlesMoveEnable = result.particlesMoveEnable;
                }
                if (typeof (result.particlesMoveSpeed) != 'undefined') {
                    this.wwObject.content.data.particlesMoveSpeed = result.particlesMoveSpeed;
                }
                if (typeof (result.particlesMoveDirection) != 'undefined') {
                    this.wwObject.content.data.particlesMoveDirection = result.particlesMoveDirection;
                }
                if (typeof (result.particlesMoveRandom) != 'undefined') {
                    this.wwObject.content.data.particlesMoveRandom = result.particlesMoveRandom;
                }
                if (typeof (result.particlesMoveStraight) != 'undefined') {
                    this.wwObject.content.data.particlesMoveStraight = result.particlesMoveStraight;
                }
                if (typeof (result.particlesMoveOut_mode) != 'undefined') {
                    this.wwObject.content.data.particlesMoveOut_mode = result.particlesMoveOut_mode;
                }
                if (typeof (result.particlesMoveAttractEnable) != 'undefined') {
                    this.wwObject.content.data.particlesMoveAttractEnable = result.particlesMoveAttractEnable;
                }

                this.wwObjectCtrl.update(this.wwObject);
                this.wwObjectCtrl.globalEdit(result);

                this.init()
                // this.wwObjectCtrl.globalEdit(result);
            } catch (error) {
                console.log(error);
            }
            wwLib.wwObjectHover.removeLock();
        }
        /* wwManager:end */

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
        this.removePaticles()
        //window.removeEventListener('resize', this.wwOnResize);
    }
};
</script>

<style lang="scss" thisd>
.ww-particles {
    position: relative;
    width: 100%;
    height: 100%;
    .background {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
    }
    .particles-js {
        height: 100%;
        width: 100%;
    }
}
</style>
