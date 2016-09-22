import fragSrc from 'assets/shader/Dist.frag';

function Dist(uniforms) {
    PIXI.Filter.call(this,
        null,
        fragSrc,
        uniforms
    );
}

Dist.prototype = Object.create(PIXI.Filter.prototype);
Dist.prototype.constructor = Dist;

export default Dist;
