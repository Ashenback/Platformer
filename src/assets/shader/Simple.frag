precision highp float;

varying vec2 vTextureCoord;
varying vec4 vColor;

uniform sampler2D uSampler;

void main(void)
{
   vec2 uvs = vTextureCoord.xy;
   vec4 fg = texture2D(uSampler, vTextureCoord);
   gl_FragColor = fg;
}
