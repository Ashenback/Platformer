precision highp float;

varying vec2 vTextureCoord; // Texture coordinate
varying vec4 vColor;

uniform vec4 dimensions; // canvas width, canvas height
uniform sampler2D uSampler; // sampler for the processed texture
uniform float time;

vec4 getCrossPix(void)
{
    float px = vTextureCoord.x - 0.5;
	float py = vTextureCoord.y - 0.5;
	float dist = abs(px * px - py * py) * 4.0;

    return texture2D(uSampler, vec2(fract(dist + time), 0.0));
}

vec4 getCirclePix(void)
{
    float px = vTextureCoord.x - 0.5;
	float py = vTextureCoord.y - 0.5;
	float dist = sqrt(pow(px, 2.0) + pow(py, 2.0)) * 2.0;

    return texture2D(uSampler, vec2(fract(dist + time), 0.0));
}

void cross(void)
{
    gl_FragColor = getCrossPix();
}

void circle(void)
{

    gl_FragColor = getCirclePix();
}

void comboMul(void)
{
    vec4 crossPix = getCrossPix();
    vec4 circlePix = getCirclePix();

    gl_FragColor = vec4(crossPix.rgb * circlePix.rgb, 1.0);
}

void comboAdd(void)
{
    vec4 crossPix = getCrossPix();
    vec4 circlePix = getCirclePix();

    gl_FragColor = vec4((crossPix.rgb + circlePix.rgb) / 2.0, 1.0);
}

void main(void)
{
    comboMul();
}