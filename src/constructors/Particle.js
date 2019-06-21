import utils from '../utils'
export default class Particle {
    constructor(particle = {}) {
        this.pJS = particle.pJS
        /* size */
        this.radius = (this.pJS.particles.size.random ? Math.random() : 1) * this.pJS.particles.size.value;
        if (this.pJS.particles.size.anim.enable) {
            this.size_status = false;
            this.vs = this.pJS.particles.size.anim.speed / 100;
            if (!this.pJS.particles.size.anim.sync) {
                this.vs = this.vs * Math.random();
            }
        }

        /* position */
        let position = particle.position;
        this.x = position ? position.x : Math.random() * this.pJS.canvas.w;
        this.y = position ? position.y : Math.random() * this.pJS.canvas.h;

        /* check position  - into the canvas */
        if (this.x > this.pJS.canvas.w - this.radius * 2) this.x = this.x - this.radius;
        else if (this.x < this.radius * 2) this.x = this.x + this.radius;
        if (this.y > this.pJS.canvas.h - this.radius * 2) this.y = this.y - this.radius;
        else if (this.y < this.radius * 2) this.y = this.y + this.radius;

        /* check position - avoid overlap */
        if (this.pJS.particles.move.bounce) {
            this.pJS.checkOverlap(this, position);
        }

        /* color */
        let color = particle.color;
        if (typeof (color.value) == 'object') {

            if (color.value instanceof Array) {
                let color_selected = color.value[Math.floor(Math.random() * this.pJS.particles.color.value.length)];
                this.color.rgb = utils.hexToRgb(color_selected);
            } else {
                if (color.value.r != undefined && color.value.g != undefined && color.value.b != undefined) {
                    this.color.rgb = {
                        r: color.value.r,
                        g: color.value.g,
                        b: color.value.b
                    }
                }
                if (color.value.h != undefined && color.value.s != undefined && color.value.l != undefined) {
                    this.color.hsl = {
                        h: color.value.h,
                        s: color.value.s,
                        l: color.value.l
                    }
                }
            }

        }
        else if (color.value == 'random') {
            this.color.rgb = {
                r: (Math.floor(Math.random() * (255 - 0 + 1)) + 0),
                g: (Math.floor(Math.random() * (255 - 0 + 1)) + 0),
                b: (Math.floor(Math.random() * (255 - 0 + 1)) + 0)
            }
        }
        else if (typeof (color.value) == 'string') {
            this.color = color;
            this.color.rgb = utils.hexToRgb(this.color.value);
        }

        /* opacity */
        this.opacity = (this.pJS.particles.opacity.random ? Math.random() : 1) * this.pJS.particles.opacity.value;
        if (this.pJS.particles.opacity.anim.enable) {
            this.opacity_status = false;
            this.vo = this.pJS.particles.opacity.anim.speed / 100;
            if (!this.pJS.particles.opacity.anim.sync) {
                this.vo = this.vo * Math.random();
            }
        }

        /* animation - velocity for speed */
        let velbase = {}
        switch (this.pJS.particles.move.direction) {
            case 'top':
                velbase = { x: 0, y: -1 };
                break;
            case 'top-right':
                velbase = { x: 0.5, y: -0.5 };
                break;
            case 'right':
                velbase = { x: 1, y: -0 };
                break;
            case 'bottom-right':
                velbase = { x: 0.5, y: 0.5 };
                break;
            case 'bottom':
                velbase = { x: 0, y: 1 };
                break;
            case 'bottom-left':
                velbase = { x: -0.5, y: 1 };
                break;
            case 'left':
                velbase = { x: -1, y: 0 };
                break;
            case 'top-left':
                velbase = { x: -0.5, y: -0.5 };
                break;
            default:
                velbase = { x: 0, y: 0 };
                break;
        }

        if (this.pJS.particles.move.straight) {
            this.vx = velbase.x;
            this.vy = velbase.y;
            if (this.pJS.particles.move.random) {
                this.vx = this.vx * (Math.random());
                this.vy = this.vy * (Math.random());
            }
        } else {
            this.vx = velbase.x + Math.random() - 0.5;
            this.vy = velbase.y + Math.random() - 0.5;
        }

        // var theta = 2.0 * Math.PI * Math.random();
        // this.vx = Math.cos(theta);
        // this.vy = Math.sin(theta);

        this.vx_i = this.vx;
        this.vy_i = this.vy;



        /* if shape is image */

        let shape_type = this.pJS.particles.shape.type;
        if (typeof (shape_type) == 'object') {
            if (shape_type instanceof Array) {
                let shape_selected = shape_type[Math.floor(Math.random() * shape_type.length)];
                this.shape = shape_selected;
            }
        } else {
            this.shape = shape_type;
        }

        if (this.shape == 'image') {
            let sh = this.pJS.particles.shape;
            this.img = {
                src: sh.image.src,
                ratio: sh.image.width / sh.image.height
            }
            if (!this.img.ratio) this.img.ratio = 1;
            if (this.pJS.tmp.img_type == 'svg' && this.pJS.tmp.source_svg != undefined) {
                this.pJS.createSvgImg(this);
                if (this.pJS.tmp.pushing) {
                    this.img.loaded = false;
                }
            }
        }
    }

    draw() {
        let p = this;
        let radius
        if (p.radius_bubble != undefined) {
            radius = p.radius_bubble;
        } else {
            radius = p.radius;
        }
        let opacity
        if (p.opacity_bubble != undefined) {
            opacity = p.opacity_bubble;
        } else {
            opacity = p.opacity;
        }
        let color_value
        if (p.color.rgb) {
            color_value = 'rgba(' + p.color.rgb.r + ',' + p.color.rgb.g + ',' + p.color.rgb.b + ',' + opacity + ')';
        } else {
            color_value = 'hsla(' + p.color.hsl.h + ',' + p.color.hsl.s + '%,' + p.color.hsl.l + '%,' + opacity + ')';
        }

        this.pJS.canvas.ctx.fillStyle = color_value;
        this.pJS.canvas.ctx.beginPath();

        switch (p.shape) {

            case 'circle':
                this.pJS.canvas.ctx.arc(p.x, p.y, radius, 0, Math.PI * 2, false);
                break;

            case 'edge':
                this.pJS.canvas.ctx.rect(p.x - radius, p.y - radius, radius * 2, radius * 2);
                break;

            case 'triangle':
                this.pJS.drawShape(this.pJS.canvas.ctx, p.x - radius, p.y + radius / 1.66, radius * 2, 3, 2);
                break;

            case 'polygon':
                this.pJS.drawShape(
                    this.pJS.canvas.ctx,
                    p.x - radius / (this.pJS.particles.shape.polygon.nb_sides / 3.5), // startX
                    p.y - radius / (2.66 / 3.5), // startY
                    radius * 2.66 / (this.pJS.particles.shape.polygon.nb_sides / 3), // sideLength
                    this.pJS.particles.shape.polygon.nb_sides, // sideCountNumerator
                    1 // sideCountDenominator
                );
                break;

            case 'star':
                this.pJS.drawShape(
                    this.pJS.canvas.ctx,
                    p.x - radius * 2 / (this.pJS.particles.shape.polygon.nb_sides / 4), // startX
                    p.y - radius / (2 * 2.66 / 3.5), // startY
                    radius * 2 * 2.66 / (this.pJS.particles.shape.polygon.nb_sides / 3), // sideLength
                    this.pJS.particles.shape.polygon.nb_sides, // sideCountNumerator
                    2 // sideCountDenominator
                );
                break;

            case 'image':

                function _draw() {
                    this.pJS.canvas.ctx.drawImage(
                        img_obj,
                        p.x - radius,
                        p.y - radius,
                        radius * 2,
                        radius * 2 / p.img.ratio
                    );
                }
                let img_obj
                if (this.pJS.tmp.img_type == 'svg') {
                    img_obj = p.img.obj;
                } else {
                    img_obj = this.pJS.tmp.img_obj;
                }

                if (img_obj) {
                    _draw();
                }

                break;

        }

        this.pJS.canvas.ctx.closePath();

        if (this.pJS.particles.shape.stroke.width > 0) {
            this.pJS.canvas.ctx.strokeStyle = this.pJS.particles.shape.stroke.color;
            this.pJS.canvas.ctx.lineWidth = this.pJS.particles.shape.stroke.width;
            this.pJS.canvas.ctx.stroke();
        }

        this.pJS.canvas.ctx.fill();

    }

}