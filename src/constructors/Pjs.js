import Particle from './Particle'
const particlesConfig = {
    number: {
        value: 400,
        density: {
            enable: true,
            value_area: 800
        }
    },
    color: {
        value: '#fff'
    },
    shape: {
        type: 'circle',
        stroke: {
            width: 0,
            color: '#ff0000'
        },
        polygon: {
            nb_sides: 5
        },
        image: {
            src: '',
            width: 100,
            height: 100
        }
    },
    opacity: {
        value: 1,
        random: false,
        anim: {
            enable: false,
            speed: 2,
            opacity_min: 0,
            sync: false
        }
    },
    size: {
        value: 20,
        random: false,
        anim: {
            enable: false,
            speed: 20,
            size_min: 0,
            sync: false
        }
    },
    line_linked: {
        enable: true,
        distance: 100,
        color: '#fff',
        opacity: 1,
        width: 1
    },
    move: {
        enable: true,
        speed: 2,
        direction: 'none',
        random: false,
        straight: false,
        out_mode: 'out',
        bounce: false,
        attract: {
            enable: false,
            rotateX: 3000,
            rotateY: 3000
        }
    },
    array: []
}
const interactivity = {
    detect_on: 'canvas',
    events: {
        onhover: {
            enable: true,
            mode: 'grab'
        },
        onclick: {
            enable: true,
            mode: 'push'
        },
        resize: true
    },
    modes: {
        grab: {
            distance: 100,
            line_linked: {
                opacity: 1
            }
        },
        bubble: {
            distance: 200,
            size: 80,
            duration: 0.4
        },
        repulse: {
            distance: 200,
            duration: 0.4
        },
        push: {
            particles_nb: 4
        },
        remove: {
            particles_nb: 2
        }
    },
    mouse: {}
}
const retina_detect = false

function hexToRgb(hex) {
    // By Tim Down - http://stackoverflow.com/a/5624139/3493650
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
    });
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};

function clamp(number, min, max) {
    return Math.min(Math.max(number, min), max);
};

function isInArray(value, array) {
    return array.indexOf(value) > -1;
}

export default class Pjs {
    constructor(pjs = {}) {
        this._element = pjs._element
        this.params = pjs.params
        this.window = pjs.window

        let _canvas_el = this._element.getElementsByClassName('particles-js-canvas-el');
        this.canvas_el = _canvas_el[0];

        this.canvas = {
            el: this.canvas_el,
            w: this.canvas_el.offsetWidth,
            h: this.canvas_el.offsetHeight
        }
        this.particles = pjs.particles || particlesConfig
        this.interactivity = pjs.interactivity || interactivity
        this.retina_detect = pjs.retina_detect || retina_detect
        console.log('TRALALAL :', this.interactivity)
        this.tmp = {}
        this.tmp.obj = {
            size_value: this.particles.size.value,
            size_anim_speed: this.particles.size.anim.speed,
            move_speed: this.particles.move.speed,
            line_linked_distance: this.particles.line_linked.distance,
            line_linked_width: this.particles.line_linked.width,
            mode_grab_distance: this.interactivity.modes.grab.distance,
            mode_bubble_distance: this.interactivity.modes.bubble.distance,
            mode_bubble_size: this.interactivity.modes.bubble.size,
            mode_repulse_distance: this.interactivity.modes.repulse.distance
        }

        this.radius = 0
        this.size_status = false
        this.vs = 0

        this.window.requestAnimFrame = (function () {
            return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function (callback) {
                    window.setTimeout(callback, 1000 / 60);
                };
        })()

        this.window.cancelRequestAnimFrame = (function () {
            return window.cancelAnimationFrame ||
                window.webkitCancelRequestAnimationFrame ||
                window.mozCancelRequestAnimationFrame ||
                window.oCancelRequestAnimationFrame ||
                window.msCancelRequestAnimationFrame ||
                clearTimeout
        })()

        // START
        this.eventsListeners();
        this.start();
    }
    test() {
        return {
            interactivity: this.interactivity
        }
    }

    /* ---------- Interact functions  ------------ */
    linkParticles(p1, p2) {

        let dx = p1.x - p2.x,
            dy = p1.y - p2.y,
            dist = Math.sqrt(dx * dx + dy * dy);

        /* draw a line between p1 and p2 if the distance between them is under the config distance */
        if (dist <= this.particles.line_linked.distance) {

            let opacity_line = this.particles.line_linked.opacity - (dist / (1 / this.particles.line_linked.opacity)) / this.particles.line_linked.distance;

            if (opacity_line > 0) {

                /* style */
                let color_line = this.particles.line_linked.color_rgb_line;
                this.canvas.ctx.strokeStyle = 'rgba(' + color_line.r + ',' + color_line.g + ',' + color_line.b + ',' + opacity_line + ')';
                this.canvas.ctx.lineWidth = this.particles.line_linked.width;
                //pJS.canvas.ctx.lineCap = 'round'; /* performance issue */

                /* path */
                this.canvas.ctx.beginPath();
                this.canvas.ctx.moveTo(p1.x, p1.y);
                this.canvas.ctx.lineTo(p2.x, p2.y);
                this.canvas.ctx.stroke();
                this.canvas.ctx.closePath();

            }

        }

    }
    attractParticles(p1, p2) {

        /* condensed particles */
        var dx = p1.x - p2.x,
            dy = p1.y - p2.y,
            dist = Math.sqrt(dx * dx + dy * dy);

        if (dist <= this.particles.line_linked.distance) {

            var ax = dx / (this.particles.move.attract.rotateX * 1000),
                ay = dy / (this.particles.move.attract.rotateY * 1000);

            p1.vx -= ax;
            p1.vy -= ay;

            p2.vx += ax;
            p2.vy += ay;

        }


    }
    bounceParticles(p1, p2) {

        let dx = p1.x - p2.x,
            dy = p1.y - p2.y,
            dist = Math.sqrt(dx * dx + dy * dy),
            dist_p = p1.radius + p2.radius;

        if (dist <= dist_p) {
            p1.vx = -p1.vx;
            p1.vy = -p1.vy;

            p2.vx = -p2.vx;
            p2.vy = -p2.vy;
        }

    }

    /* ---------- Modes functions  ------------ */
    pushParticles(nb, pos) {

        this.tmp.pushing = true;

        for (let i = 0; i < nb; i++) {
            this.particles.array.push(
                new Particle(
                    this.particles.color,
                    this.particles.opacity.value,
                    {
                        'x': pos ? pos.pos_x : Math.random() * pJS.canvas.w,
                        'y': pos ? pos.pos_y : Math.random() * pJS.canvas.h
                    }
                )
            )
            if (i == nb - 1) {
                if (!this.particles.move.enable) {
                    this.particlesDraw();
                }
                this.tmp.pushing = false;
            }
        }

    }

    removeParticles(nb) {
        this.particles.array.splice(0, nb);
        if (!this.particles.move.enable) {
            this.particlesDraw();
        }
    }

    bubbleParticle(p) {

        /* on hover event */
        if (this.interactivity.events.onhover.enable && isInArray('bubble', this.interactivity.events.onhover.mode)) {

            let dx_mouse = p.x - this.interactivity.mouse.pos_x,
                dy_mouse = p.y - this.interactivity.mouse.pos_y,
                dist_mouse = Math.sqrt(dx_mouse * dx_mouse + dy_mouse * dy_mouse),
                ratio = 1 - dist_mouse / this.interactivity.modes.bubble.distance;

            function init() {
                p.opacity_bubble = p.opacity;
                p.radius_bubble = p.radius;
            }

            /* mousemove - check ratio */
            if (dist_mouse <= this.interactivity.modes.bubble.distance) {

                if (ratio >= 0 && this.interactivity.status == 'mousemove') {

                    /* size */
                    if (this.interactivity.modes.bubble.size != this.particles.size.value) {

                        if (this.interactivity.modes.bubble.size > this.particles.size.value) {
                            let size = p.radius + (this.interactivity.modes.bubble.size * ratio);
                            if (size >= 0) {
                                p.radius_bubble = size;
                            }
                        } else {
                            let dif = p.radius - this.interactivity.modes.bubble.size,
                                size = p.radius - (dif * ratio);
                            if (size > 0) {
                                p.radius_bubble = size;
                            } else {
                                p.radius_bubble = 0;
                            }
                        }

                    }

                    /* opacity */
                    if (this.interactivity.modes.bubble.opacity != this.particles.opacity.value) {

                        if (this.interactivity.modes.bubble.opacity > this.particles.opacity.value) {
                            let opacity = this.interactivity.modes.bubble.opacity * ratio;
                            if (opacity > p.opacity && opacity <= this.interactivity.modes.bubble.opacity) {
                                p.opacity_bubble = opacity;
                            }
                        } else {
                            let opacity = p.opacity - (this.particles.opacity.value - this.interactivity.modes.bubble.opacity) * ratio;
                            if (opacity < p.opacity && opacity >= this.interactivity.modes.bubble.opacity) {
                                p.opacity_bubble = opacity;
                            }
                        }

                    }

                }

            } else {
                init();
            }


            /* mouseleave */
            if (this.interactivity.status == 'mouseleave') {
                init();
            }

        }

        /* on click event */
        else if (this.interactivity.events.onclick.enable && isInArray('bubble', this.interactivity.events.onclick.mode)) {


            if (this.tmp.bubble_clicking) {
                let dx_mouse = p.x - this.interactivity.mouse.click_pos_x,
                    dy_mouse = p.y - this.interactivity.mouse.click_pos_y,
                    dist_mouse = Math.sqrt(dx_mouse * dx_mouse + dy_mouse * dy_mouse),
                    time_spent = (new Date().getTime() - this.interactivity.mouse.click_time) / 1000;

                if (time_spent > this.interactivity.modes.bubble.duration) {
                    this.tmp.bubble_duration_end = true;
                }

                if (time_spent > this.interactivity.modes.bubble.duration * 2) {
                    this.tmp.bubble_clicking = false;
                    this.tmp.bubble_duration_end = false;
                }
            }


            function process(bubble_param, particles_param, p_obj_bubble, p_obj, id) {

                if (bubble_param != particles_param) {

                    if (!this.tmp.bubble_duration_end) {
                        if (dist_mouse <= this.interactivity.modes.bubble.distance) {
                            let obj
                            if (p_obj_bubble != undefined) obj = p_obj_bubble;
                            else obj = p_obj;
                            if (obj != bubble_param) {
                                let value = p_obj - (time_spent * (p_obj - bubble_param) / this.interactivity.modes.bubble.duration);
                                if (id == 'size') p.radius_bubble = value;
                                if (id == 'opacity') p.opacity_bubble = value;
                            }
                        } else {
                            if (id == 'size') p.radius_bubble = undefined;
                            if (id == 'opacity') p.opacity_bubble = undefined;
                        }
                    } else {
                        if (p_obj_bubble != undefined) {
                            let value_tmp = p_obj - (time_spent * (p_obj - bubble_param) / pJS.interactivity.modes.bubble.duration),
                                dif = bubble_param - value_tmp;
                            value = bubble_param + dif;
                            if (id == 'size') p.radius_bubble = value;
                            if (id == 'opacity') p.opacity_bubble = value;
                        }
                    }

                }

            }

            if (this.tmp.bubble_clicking) {
                /* size */
                process(this.interactivity.modes.bubble.size, this.particles.size.value, p.radius_bubble, p.radius, 'size');
                /* opacity */
                process(this.interactivity.modes.bubble.opacity, this.particles.opacity.value, p.opacity_bubble, p.opacity, 'opacity');
            }

        }

    }
    repulseParticle(p) {

        if (this.interactivity.events.onhover.enable && isInArray('repulse', this.interactivity.events.onhover.mode) && this.interactivity.status == 'mousemove') {

            let dx_mouse = p.x - this.interactivity.mouse.pos_x,
                dy_mouse = p.y - this.interactivity.mouse.pos_y,
                dist_mouse = Math.sqrt(dx_mouse * dx_mouse + dy_mouse * dy_mouse);

            let normVec = { x: dx_mouse / dist_mouse, y: dy_mouse / dist_mouse },
                repulseRadius = this.interactivity.modes.repulse.distance,
                velocity = 100,
                repulseFactor = clamp((1 / repulseRadius) * (-1 * Math.pow(dist_mouse / repulseRadius, 2) + 1) * repulseRadius * velocity, 0, 50);

            let pos = {
                x: p.x + normVec.x * repulseFactor,
                y: p.y + normVec.y * repulseFactor
            }

            if (pJS.particles.move.out_mode == 'bounce') {
                if (pos.x - p.radius > 0 && pos.x + p.radius < pthisJS.canvas.w) p.x = pos.x;
                if (pos.y - p.radius > 0 && pos.y + p.radius < this.canvas.h) p.y = pos.y;
            } else {
                p.x = pos.x;
                p.y = pos.y;
            }

        }


        else if (this.interactivity.events.onclick.enable && isInArray('repulse', this.interactivity.events.onclick.mode)) {

            if (!this.tmp.repulse_finish) {
                this.tmp.repulse_count++;
                if (this.tmp.repulse_count == this.particles.array.length) {
                    this.tmp.repulse_finish = true;
                }
            }

            if (this.tmp.repulse_clicking) {

                let repulseRadius = Math.pow(this.interactivity.modes.repulse.distance / 6, 3);

                let dx = pJS.interactivity.mouse.click_pos_x - p.x,
                    dy = pJS.interactivity.mouse.click_pos_y - p.y,
                    d = dx * dx + dy * dy;

                let force = -repulseRadius / d * 1;

                function process() {

                    let f = Math.atan2(dy, dx);
                    p.vx = force * Math.cos(f);
                    p.vy = force * Math.sin(f);

                    if (this.particles.move.out_mode == 'bounce') {
                        let pos = {
                            x: p.x + p.vx,
                            y: p.y + p.vy
                        }
                        if (pos.x + p.radius > this.canvas.w) p.vx = -p.vx;
                        else if (pos.x - p.radius < 0) p.vx = -p.vx;
                        if (pos.y + p.radius > this.canvas.h) p.vy = -p.vy;
                        else if (pos.y - p.radius < 0) p.vy = -p.vy;
                    }

                }

                // default
                if (d <= repulseRadius) {
                    process();
                }

                // bang - slow motion mode
                // if(!pJS.tmp.repulse_finish){
                //   if(d <= repulseRadius){
                //     process();
                //   }
                // }else{
                //   process();
                // }


            } else {

                if (this.tmp.repulse_clicking == false) {

                    p.vx = p.vx_i;
                    p.vy = p.vy_i;

                }

            }

        }

    }
    grabParticle(p) {

        if (this.interactivity.events.onhover.enable && this.interactivity.status == 'mousemove') {

            let dx_mouse = p.x - this.interactivity.mouse.pos_x,
                dy_mouse = p.y - this.interactivity.mouse.pos_y,
                dist_mouse = Math.sqrt(dx_mouse * dx_mouse + dy_mouse * dy_mouse);

            /* draw a line between the cursor and the particle if the distance between them is under the config distance */
            if (dist_mouse <= this.interactivity.modes.grab.distance) {

                let opacity_line = pthisJS.interactivity.modes.grab.line_linked.opacity - (dist_mouse / (1 / pJS.interactivity.modes.grab.line_linked.opacity)) / pJS.interactivity.modes.grab.distance;

                if (opacity_line > 0) {

                    /* style */
                    let color_line = this.particles.line_linked.color_rgb_line;
                    this.canvas.ctx.strokeStyle = 'rgba(' + color_line.r + ',' + color_line.g + ',' + color_line.b + ',' + opacity_line + ')';
                    this.canvas.ctx.lineWidth = this.particles.line_linked.width;
                    //pJS.canvas.ctx.lineCap = 'round'; /* performance issue */

                    /* path */
                    this.canvas.ctx.beginPath();
                    this.canvas.ctx.moveTo(p.x, p.y);
                    this.canvas.ctx.lineTo(pJS.interactivity.mouse.pos_x, pJS.interactivity.mouse.pos_y);
                    this.canvas.ctx.stroke();
                    this.canvas.ctx.closePath();

                }

            }

        }

    }

    /* ---------- Vendors functions  ------------ */
    eventsListeners() {
        console.log('eventsListeners', this)
        /* events target element */
        if (this.interactivity.detect_on == 'window') {
            this.interactivity.el = this.window;
        } else {
            this.interactivity.el = this.canvas.el;
        }


        /* detect mouse pos - on hover / click event */
        if (this.interactivity.events.onhover.enable || this.interactivity.events.onclick.enable) {

            /* el on mousemove */
            this.interactivity.el.addEventListener('mousemove', function (e) {

                let pos_x, pos_y
                if (this.interactivity.el == this.window) {
                    pos_x = e.clientX
                    pos_y = e.clientY;
                }
                else {
                    pos_x = e.offsetX || e.clientX
                    pos_y = e.offsetY || e.clientY;
                }

                this.interactivity.mouse.pos_x = pos_x;
                this.interactivity.mouse.pos_y = pos_y;

                if (this.tmp.retina) {
                    this.interactivity.mouse.pos_x *= this.canvas.pxratio;
                    this.interactivity.mouse.pos_y *= this.canvas.pxratio;
                }

                this.interactivity.status = 'mousemove';

            });

            /* el on onmouseleave */
            this.interactivity.el.addEventListener('mouseleave', function (e) {

                this.interactivity.mouse.pos_x = null;
                this.interactivity.mouse.pos_y = null;
                this.interactivity.status = 'mouseleave';

            });

        }

        /* on click event */
        if (this.interactivity.events.onclick.enable) {

            this.interactivity.el.addEventListener('click', function () {

                this.interactivity.mouse.click_pos_x = this.interactivity.mouse.pos_x;
                this.interactivity.mouse.click_pos_y = this.interactivity.mouse.pos_y;
                this.interactivity.mouse.click_time = new Date().getTime();

                if (this.interactivity.events.onclick.enable) {

                    switch (this.interactivity.events.onclick.mode) {

                        case 'push':
                            if (this.particles.move.enable) {
                                this.pushParticles(this.interactivity.modes.push.particles_nb, this.interactivity.mouse);
                            } else {
                                if (this.interactivity.modes.push.particles_nb == 1) {
                                    this.pushParticles(this.interactivity.modes.push.particles_nb, this.interactivity.mouse);
                                }
                                else if (this.interactivity.modes.push.particles_nb > 1) {
                                    this.pushParticles(this.interactivity.modes.push.particles_nb);
                                }
                            }
                            break;

                        case 'remove':
                            this.removeParticles(this.interactivity.modes.remove.particles_nb);
                            break;

                        case 'bubble':
                            this.tmp.bubble_clicking = true;
                            break;

                        case 'repulse':
                            this.tmp.repulse_clicking = true;
                            this.tmp.repulse_count = 0;
                            this.tmp.repulse_finish = false;
                            $timeout(() => {
                                this.tmp.repulse_clicking = false;
                            }, this.interactivity.modes.repulse.duration * 1000)
                            break;

                    }

                }

            });

        }


    }
    densityAutoParticles() {

        if (this.particles.number.density.enable) {

            /* calc area */
            let area = this.canvas.el.width * this.canvas.el.height / 1000;
            if (pJS.tmp.retina) {
                area = area / (this.canvas.pxratio * 2);
            }

            /* calc number of particles based on density area */
            let nb_particles = area * this.particles.number.value / this.particles.number.density.value_area;

            /* add or remove X particles */
            let missing_particles = this.particles.array.length - nb_particles;
            if (missing_particles < 0) this.pushParticles(Math.abs(missing_particles));
            else this.removeParticles(missing_particles);

        }

    }
    checkOverlap(p1, position) {
        for (let i = 0; i < this.particles.array.length; i++) {
            let p2 = this.particles.array[i];

            let dx = p1.x - p2.x,
                dy = p1.y - p2.y,
                dist = Math.sqrt(dx * dx + dy * dy);

            if (dist <= p1.radius + p2.radius) {
                p1.x = position ? position.x : Math.random() * this.canvas.w;
                p1.y = position ? position.y : Math.random() * this.canvas.h;
                //pJS.fn.vendors.checkOverlap(p1);
            }
        }
    }
    createSvgImg(p) {
        /* set color to svg element */
        let svgXml = this.tmp.source_svg,
            rgbHex = /#([0-9A-F]{3,6})/gi,
            coloredSvgXml = svgXml.replace(rgbHex, function (m, r, g, b) {
                if (p.color.rgb) {
                    var color_value = 'rgba(' + p.color.rgb.r + ',' + p.color.rgb.g + ',' + p.color.rgb.b + ',' + p.opacity + ')';
                } else {
                    var color_value = 'hsla(' + p.color.hsl.h + ',' + p.color.hsl.s + '%,' + p.color.hsl.l + '%,' + p.opacity + ')';
                }
                return color_value;
            });

        /* prepare to create img with colored svg */
        var svg = new Blob([coloredSvgXml], { type: 'image/svg+xml;charset=utf-8' }),
            DOMURL = this.window.URL || this.window.webkitURL || this.window,
            url = DOMURL.createObjectURL(svg);

        /* create particle img obj */
        let img = new Image();
        img.addEventListener('load', function () {
            p.img.obj = img;
            p.img.loaded = true;
            DOMURL.revokeObjectURL(url);
            pJS.tmp.count_svg++;
        });
        img.src = url;

    }
    destroypJS() {
        this.window.cancelAnimationFrame(this.drawAnimFrame);
        canvas_el.remove();
        this.pJSDom = null;
    }
    drawShape(c, startX, startY, sideLength, sideCountNumerator, sideCountDenominator) {

        // By Programming Thomas - https://programmingthomas.wordpress.com/2013/04/03/n-sided-shapes/
        let sideCount = sideCountNumerator * sideCountDenominator;
        let decimalSides = sideCountNumerator / sideCountDenominator;
        let interiorAngleDegrees = (180 * (decimalSides - 2)) / decimalSides;
        let interiorAngle = Math.PI - Math.PI * interiorAngleDegrees / 180; // convert to radians
        c.save();
        c.beginPath();
        c.translate(startX, startY);
        c.moveTo(0, 0);
        for (var i = 0; i < sideCount; i++) {
            c.lineTo(sideLength, 0);
            c.translate(sideLength, 0);
            c.rotate(interiorAngle);
        }
        //c.stroke();
        c.fill();
        c.restore();

    }
    exportImg() {
        this._element.open(this.canvas.el.toDataURL('image/png'), '_blank');
    }
    loadImg(type) {

        this.tmp.img_error = undefined;

        if (this.particles.shape.image.src != '') {

            if (type == 'svg') {

                let xhr = new XMLHttpRequest();
                xhr.open('GET', this.particles.shape.image.src);
                xhr.onreadystatechange = function (data) {
                    if (xhr.readyState == 4) {
                        if (xhr.status == 200) {
                            this.tmp.source_svg = data.currentTarget.response;
                            this.checkBeforeDraw();
                        } else {
                            console.log('Error pJS - Image not found');
                            this.tmp.img_error = true;
                        }
                    }
                }
                xhr.send();

            } else {

                var img = new Image();
                img.addEventListener('load', function () {
                    this.tmp.img_obj = img;
                    this.checkBeforeDraw();
                });
                img.src = this.particles.shape.image.src;

            }

        } else {
            console.log('Error pJS - No image.src');
            pJS.tmp.img_error = true;
        }

    }
    draw() {

        if (this.particles.shape.type == 'image') {

            if (this.tmp.img_type == 'svg') {

                if (this.tmp.count_svg >= this.particles.number.value) {
                    this.particlesDraw();
                    if (!this.particles.move.enable) this.window.cancelRequestAnimFrame(this.drawAnimFrame);
                    else this.drawAnimFrame = this.window.requestAnimFrame(this.draw);
                } else {
                    //console.log('still loading...');
                    if (!this.tmp.img_error) this.drawAnimFrame = this.window.requestAnimFrame(this.draw);
                }

            } else {

                if (this.tmp.img_obj != undefined) {
                    this.particlesDraw();
                    if (!this.particles.move.enable) this.window.cancelRequestAnimFrame(pJS.fn.drawAnimFrame);
                    else this.drawAnimFrame = this.window.requestAnimFrame(this.draw);
                } else {
                    if (!this.tmp.img_error) this.drawAnimFrame = this.window.requestAnimFrame(this.draw);
                }

            }

        } else {
            this.particlesDraw();
            if (!this.particles.move.enable) this.window.cancelRequestAnimFrame(this.drawAnimFrame);
            else this.drawAnimFrame = this.window.requestAnimFrame(this.draw);
        }

    }
    checkBeforeDraw() {

        // if shape is image
        if (this.particles.shape.type == 'image') {

            if (this.tmp.img_type == 'svg' && this.tmp.source_svg == undefined) {
                this.tmp.checkAnimFrame = this.window.requestAnimFrame(check);
            } else {
                //console.log('images loaded! cancel check');
                this.window.cancelRequestAnimFrame(this.checkAnimFrame);
                if (!this.tmp.img_error) {
                    this.init();
                    this.draw();
                }

            }

        } else {
            this.init();
            this.draw();
        }

    }
    init() {

        /* init canvas + particles */
        this.retinaInit();
        this.canvasInit();
        this.canvasSize();
        this.canvasPaint();
        this.particlesCreate();
        this.densityAutoParticles();

        /* particles.line_linked - convert hex colors to rgb */
        this.particles.line_linked.color_rgb_line = hexToRgb(this.particles.line_linked.color);

    }
    start() {
        if (isInArray('image', this.particles.shape.type)) {
            this.tmp.img_type = this.particles.shape.image.src.substr(this.particles.shape.image.src.length - 3);
            this.loadImg(pJS.tmp.img_type);
        } else {
            this.checkBeforeDraw();
        }
        this.canvasResize()
    };



    retinaInit(devicePixelRatio) {

        if (this.retina_detect && this.window.devicePixelRatio > 1) {
            this.canvas.pxratio = this.window.devicePixelRatio;
            this.tmp.retina = true;
        }
        else {
            this.canvas.pxratio = 1;
            this.tmp.retina = false;
        }

        this.canvas.w = this.canvas.el.offsetWidth * this.canvas.pxratio;
        this.canvas.h = this.canvas.el.offsetHeight * this.canvas.pxratio;

        this.particles.size.value = this.tmp.obj.size_value * this.canvas.pxratio;
        this.particles.size.anim.speed = this.tmp.obj.size_anim_speed * this.canvas.pxratio;
        this.particles.move.speed = this.tmp.obj.move_speed * this.canvas.pxratio;
        this.particles.line_linked.distance = this.tmp.obj.line_linked_distance * this.canvas.pxratio;
        this.interactivity.modes.grab.distance = this.tmp.obj.mode_grab_distance * this.canvas.pxratio;
        this.interactivity.modes.bubble.distance = this.tmp.obj.mode_bubble_distance * this.canvas.pxratio;
        this.particles.line_linked.width = this.tmp.obj.line_linked_width * this.canvas.pxratio;
        this.interactivity.modes.bubble.size = this.tmp.obj.mode_bubble_size * this.canvas.pxratio;
        this.interactivity.modes.repulse.distance = this.tmp.obj.mode_repulse_distance * this.canvas.pxratio;

    }

    /* ---------- pJS functions - canvas ------------ */
    canvasInit() {
        this.canvas.ctx = this.canvas.el.getContext('2d');
    }
    canvasResize() {

        this.canvas.w = this.canvas.el.offsetWidth;
        this.canvas.h = this.canvas.el.offsetHeight;

        /* resize canvas */
        if (this.tmp.retina) {
            this.canvas.w *= this.canvas.pxratio;
            this.canvas.h *= this.canvas.pxratio;
        }

        this.canvas.el.width = this.canvas.w;
        this.canvas.el.height = this.canvas.h;

        /* repaint canvas on anim disabled */
        if (!this.particles.move.enable) {
            this.particlesEmpty();
            this.particlesCreate();
            this.particlesDraw();
            this.densityAutoParticles();
        }

        /* density particles enabled */
        this.densityAutoParticles();

    }
    canvasPaint() {
        this.canvas.ctx.fillRect(0, 0, this.canvas.w, this.canvas.h);
    }
    canvasClear() {
        this.canvas.ctx.clearRect(0, 0, this.canvas.w, this.canvas.h);
    }
    canvasSize() {
        setTimeout(() => {
            this.canvasResize()
        }, 1000)

        if (this.interactivity.events.resize) {
            this.window.addEventListener('resize', this.canvasResize);
        }

    };

    /* --------- pJS functions - particles ----------- */

    particlesCreate() {
        for (let i = 0; i < this.particles.number.value; i++) {
            this.particles.array.push(new Particle({ pJS: this, color: this.particles.color, opacity: this.particles.opacity.value, position: '' }));
        }
    }
    particlesUpdate() {

        for (let i = 0; i < this.particles.array.length; i++) {

            /* the particle */
            let p = this.particles.array[i];

            // var d = ( dx = pJS.interactivity.mouse.click_pos_x - p.x ) * dx + ( dy = pJS.interactivity.mouse.click_pos_y - p.y ) * dy;
            // var f = -BANG_SIZE / d;
            // if ( d < BANG_SIZE ) {
            //     var t = Math.atan2( dy, dx );
            //     p.vx = f * Math.cos(t);
            //     p.vy = f * Math.sin(t);
            // }

            /* move the particle */
            if (this.particles.move.enable) {
                var ms = pJS.particles.move.speed / 2;
                p.x += p.vx * ms;
                p.y += p.vy * ms;
            }

            /* change opacity status */
            if (this.particles.opacity.anim.enable) {
                if (p.opacity_status == true) {
                    if (p.opacity >= pJS.particles.opacity.value) p.opacity_status = false;
                    p.opacity += p.vo;
                } else {
                    if (p.opacity <= pJS.particles.opacity.anim.opacity_min) p.opacity_status = true;
                    p.opacity -= p.vo;
                }
                if (p.opacity < 0) p.opacity = 0;
            }

            /* change size */
            if (this.particles.size.anim.enable) {
                if (p.size_status == true) {
                    if (p.radius >= pJS.particles.size.value) p.size_status = false;
                    p.radius += p.vs;
                } else {
                    if (p.radius <= pJS.particles.size.anim.size_min) p.size_status = true;
                    p.radius -= p.vs;
                }
                if (p.radius < 0) p.radius = 0;
            }

            /* change particle position if it is out of canvas */
            let new_pos
            if (this.particles.move.out_mode == 'bounce') {
                new_pos = {
                    x_left: p.radius,
                    x_right: pJS.canvas.w,
                    y_top: p.radius,
                    y_bottom: pJS.canvas.h
                }
            } else {
                new_pos = {
                    x_left: -p.radius,
                    x_right: pJS.canvas.w + p.radius,
                    y_top: -p.radius,
                    y_bottom: pJS.canvas.h + p.radius
                }
            }

            if (p.x - p.radius > pJS.canvas.w) {
                p.x = new_pos.x_left;
                p.y = Math.random() * pJS.canvas.h;
            }
            else if (p.x + p.radius < 0) {
                p.x = new_pos.x_right;
                p.y = Math.random() * pJS.canvas.h;
            }
            if (p.y - p.radius > pJS.canvas.h) {
                p.y = new_pos.y_top;
                p.x = Math.random() * pJS.canvas.w;
            }
            else if (p.y + p.radius < 0) {
                p.y = new_pos.y_bottom;
                p.x = Math.random() * pJS.canvas.w;
            }

            /* out of canvas modes */
            switch (this.particles.move.out_mode) {
                case 'bounce':
                    if (p.x + p.radius > pJS.canvas.w) p.vx = -p.vx;
                    else if (p.x - p.radius < 0) p.vx = -p.vx;
                    if (p.y + p.radius > pJS.canvas.h) p.vy = -p.vy;
                    else if (p.y - p.radius < 0) p.vy = -p.vy;
                    break;
            }

            /* events */
            if (isInArray('grab', this.interactivity.events.onhover.mode)) {
                this.grabParticle(p);
            }

            if (isInArray('bubble', this.interactivity.events.onhover.mode) || isInArray('bubble', this.interactivity.events.onclick.mode)) {
                this.bubbleParticle(p);
            }

            if (isInArray('repulse', this.interactivity.events.onhover.mode) || isInArray('repulse', this.interactivity.events.onclick.mode)) {
                this.repulseParticle(p);
            }

            /* interaction auto between particles */
            if (this.particles.line_linked.enable || this.particles.move.attract.enable) {
                for (var j = i + 1; j < this.particles.array.length; j++) {
                    var p2 = this.particles.array[j];

                    /* link particles */
                    if (this.particles.line_linked.enable) {
                        this.linkParticles(p, p2);
                    }

                    /* attract particles */
                    if (this.particles.move.attract.enable) {
                        this.attractParticles(p, p2);
                    }

                    /* bounce particles */
                    if (this.particles.move.bounce) {
                        this.bounceParticles(p, p2);
                    }

                }
            }


        }
    }

    particlesDraw() {

        /* clear canvas */
        this.canvas.ctx.clearRect(0, 0, this.canvas.w, this.canvas.h);

        /* update each particles param */
        this.particlesUpdate();

        /* draw each particle */
        for (let i = 0; i < this.particles.array.length; i++) {
            let p = this.particles.array[i];
            p.draw();
        }
    }

    particlesEmpty() {
        this.particles.array = [];
    }

    particlesRefresh() {

        /* init all */
        this.window.cancelRequestAnimFrame(pJS.fn.checkAnimFrame);
        this.window.cancelRequestAnimFrame(pJS.fn.drawAnimFrame);
        pJS.tmp.source_svg = undefined;
        pJS.tmp.img_obj = undefined;
        pJS.tmp.count_svg = 0;
        this.particlesEmpty();
        this.canvasClear();

        /* restart */
        this.start();

    };
}