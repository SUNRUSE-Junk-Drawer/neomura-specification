# neomura > [specification](./readme.md) > features

## video

| property           | value                                      |
| ------------------ | ------------------------------------------ |
| resolution         | 270x180*                                   |
| orientation        | landscape*                                 |
| aspect ratio       | 3:2*                                       |
| pixel aspect ratio | 1:1                                        |
| color depth        | 24-bit (8-8-8 red/green/blue, interleaved) |
| color range        | full (0 - 255) (not nstc-safe)             |
| color space        | gamma (2.2)                                |
| refresh rate       | 60Hz*                                      |
| vsync              | yes                                        |
| safe area          | full frame; no overscan                    |

any values marked with an asterisk are specified by games, and are provided as
recommendations.

### resolution and scaling notes

the aspect ratio of 3:2 was chosen as a compromise between the retro gaming
authenticity of 4:3 and the need to fill 16:9 widescreen monitors.

the virtual display is to be scaled to the largest integer scaling which will
fit within physical display without cropping, then centered.  any remaining is
to be black (rgb 0, 0, 0).

the vertical resolution of 180 is a factor of most common display resolutions,
and should therefore fit most displays well with integer scaling:

| physical resolution | scale factor | scaled resolution | horizontal padding |
| ------------------- | ------------ | ----------------- | ------------------ |
| 1280x720            | 4x           | 1080x720          | 100px              |
| 1920x1080           | 6x           | 1620x1080         | 150px              |
| 2560x1440           | 8x           | 2160x1440         | 200px              |
| 3840x2160           | 12x          | 3240x2160         | 300px              |

## audio

| property      | value                       |
| ------------- | --------------------------- |
| sample rate   | 44100hz*                    |
| bit depth     | 32 (ieee floating point)    |
| channels      | 2 (left/right, interleaved) |
| buffer length | 735 per channel*            |

any values marked with an asterisk are specified by games, and are provided as
recommendations.

### timing notes

audio and video generation are to be kept in perfect sync, 735 samples being one
buffer per 60hz frame at the sample rate of 44100hz.

the buffer length of 735 is as exposed to the game.  in most cases, it will be
recommended for performance and compatability reasons to allocate a larger
buffer internal to the host which batches several frames' samples together for
submission to a system audio api.

## input

| property                       | value                                      |
| ------------------------------ | ------------------------------------------ |
| maximum simulataneous gamepads | 4*                                         |
| force feedback/rumble          | 256 intensity levels including deactivated |
| d-pads per gamepad             | 1                                          |
| face buttons per gamepad       | 4 (arranged like a d-pad)                  |
| triggers per gamepad           | 2 (left/right)                             |
| other buttons per gamepad      | 1 (pause)                                  |

any values marked with an asterisk are specified by games, and are provided as
recommendations.

### suggested layout

```
    .-------------.----------------------------------------.---------------.
   | left trigger |                                        | right trigger |
 .-'--------------'                                        '----------------'-.
|                                                                              |
|              ^                                             ( )               |
|                                                                              |
|                                  .-------.                                   |
|      <     d-pad     >           | pause |        ( ) face buttons ( )       |
|                                  '-------'                                   |
|                                                                              |
|              v                                             ( )               |
|                                                                              |
 '----------------------------------------------------------------------------'
```

### suggested mappings

these may be tweaked for game-specific hosts, and should generally be remappable
in the host's settings.

#### left joy con (held horizontally with strap attached)

| input         | mapping             |
| ------------- | ------------------- |
| d-pad         | left stick          |
| face buttons  | directional buttons |
| left trigger  | sl button           |
| right trigger | sr button           |
| pause button  | - button            |

#### right joy con (held horizontally with strap attached)

| input         | mapping             |
| ------------- | ------------------- |
| d-pad         | right stick         |
| face buttons  | a/b/x/y buttons     |
| left trigger  | sl button           |
| right trigger | sr button           |
| pause button  | + button            |

#### joy con pair

| input         | mapping                           |
| ------------- | --------------------------------- |
| d-pad         | left stick or directional buttons |
| face buttons  | a/b/x/y buttons                   |
| left trigger  | l/zl buttons                      |
| right trigger | r/zr buttons                      |
| pause button  | -/+ buttons                       |

#### dualshock 4

| input         | mapping                              |
| ------------- | ------------------------------------ |
| d-pad         | directional buttons or left stick    |
| face buttons  | cross/square/circle/triangle buttons |
| left trigger  | l1/l2 buttons                        |
| right trigger | r1/r2 buttons                        |
| pause button  | options/touch pad buttons            |

#### xbox series controller

| input         | mapping                       |
| ------------- | ----------------------------- |
| d-pad         | left stick or directional pad |
| face buttons  | a/b/x/y buttons               |
| left trigger  | left bumper/left trigger      |
| right trigger | right bumper/right trigger    |
| pause button  | back/start buttons            |

#### keyboard (us layout)

| input         | mapping                       |
| ------------- | ----------------------------- |
| d-pad         | w/a/s/d keys                  |
| face buttons  | i/j/k/l keys                  |
| left trigger  | q/u keys                      |
| right trigger | e/o keys                      |
| pause button  | esc key                       |
