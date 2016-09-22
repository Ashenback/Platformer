precision highp float;

varying vec2 vTextureCoord; // Texture coordinate
varying vec4 vColor;

uniform vec4 dimensions; // canvas width, canvas height
uniform sampler2D uSampler; // sampler for the processed texture
uniform float time;

uniform vec2 center;
uniform float range;
uniform float maxDist;
uniform float iter;

void main(void)
{
    float px = 1.0 - vTextureCoord.x - 0.5;
    float py = 1.0 - vTextureCoord.y - 0.5;
    vec2 p, c, p0;

    c.x = center.x + 2.0 * range * px;
    c.y = center.y + 2.0 * range * py;

    float r = 0.0;
    for(int i = 0; i < 9999; i++)
    {
        p.x = p0.x * p0.x - p0.y * p0.y - c.x;
        p.y = 2.0 * abs(p0.x * p0.y) - c.y;
        p0 = p;

        if ((p.x * p.x + p.y * p.y) > maxDist || float(i) > iter)
        {
            r = float(i);
            break;
        }
    }

    float res = r/float(iter);
    vec4 pc = texture2D(uSampler, vec2(res, 0.0));

    gl_FragColor = pc;
}