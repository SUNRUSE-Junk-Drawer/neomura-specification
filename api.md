# neomura > [specification](./readme.md) > api

neomura games must be stateless.  any state they appear to have is injected and
managed by the host.

this allows for:

- hot reload, as the game module can be swapped out for an updated build without
  losing game state.
- network multiplayer, as game state can be exchanged over the network.
- save state functionality.

## types

| name | description                                       |
| ---- | ------------------------------------------------- |
| u8   | unsigned 8-bit integer                            |
| s8   | 2's complement 8-bit integer                      |
| u16  | unsigned little-endian 16-bit integer             |
| s16  | little-endian 2's complement 16-bit integer       |
| u32  | unsigned little-endian 32-bit integer             |
| s32  | little-endian 2's complement 32-bit integer       |
| u64  | unsigned little-endian 64-bit integer             |
| s64  | little-endian 2's complement 64-bit integer       |
| f32  | little-endian ieee 32-bit float                   |
| f64  | little-endian ieee 64-bit float                   |

## game webassembly module exports

the host is to stop and raise an error should an export be present as an invalid
type, out of range, or without one of its dependencies.  otherwise, all exports
are optional.

| name                | type     | dependencies                                 |
| ------------------- | -------- | -------------------------------------------- |
| memory              | memory   | n/a                                          |
| refresh_rate        | i32      | n/a                                          |
| elapse              | function | refresh_rate                                 |
| video_render        | function | refresh_rate video_buffer                    |
| video_buffer        | i32      | memory video_render video_width video_height |
| video_width         | i32      | video_buffer                                 |
| video_height        | i32      | video_buffer                                 |
| audio_render        | function | refresh_rate audio_buffer                    |
| audio_buffer        | i32      | memory audio_render audio_length             |
| audio_length        | i32      | audio_buffer                                 |
| inputs              | i32      | n/a                                          |
| input_state         | i32      | memory inputs                                |
| input_dpad_left     | i32      | memory inputs                                |
| input_dpad_right    | i32      | memory inputs                                |
| input_dpad_up       | i32      | memory inputs                                |
| input_dpad_down     | i32      | memory inputs                                |
| input_face_left     | i32      | memory inputs                                |
| input_face_right    | i32      | memory inputs                                |
| input_face_up       | i32      | memory inputs                                |
| input_face_down     | i32      | memory inputs                                |
| input_trigger_left  | i32      | memory inputs                                |
| input_trigger_right | i32      | memory inputs                                |
| input_pause         | i32      | memory inputs                                |
| input_rumble_render | function | input_rumble_buffer                          |
| input_rumble_buffer | i32      | memory inputs input_rumble_render            |
| state_version       | i32      | n/a                                          |
| state_*_buffer      | i32      | memory state_version state_*_size            |
| state_*_size        | i32      | state_*_buffer                               |

### memory

export of the module's internal memory space.

### refresh_rate

synchronized display refresh rate and gameplay tick rate, in hertz.

the host is to stop and raise an error should this be less than or equal to
zero.

### elapse

called once per gameplay tick.  must be a deterministic function which only
reads from input_* and state_*\_buffer, and may write back to state_\*_buffer.

may be called multiple times without calling any *_render functions.

### video_render

called when the display must be refreshed.  must be a deterministic function
which only reads from input_* and state_*_buffer, and writes to video_buffer.

may be called multiple times without calling elapse.

### video_buffer

pointer within memory to a buffer of u8s.

each u8 represents the intensity of a color channel for a pixel, where 0 is
the minimum possible intensity and 255 is the maximum possible intensity.

runs through channels red, green and blue, then from left to right, then from
top to bottom.

the host is to stop and raise an error should this not fit within memory, or
overlap any other described memory region.

### video_width

the width of the display, in pixel columns.

the host is to stop and raise an error should this be less than or equal to
zero.

### video_height

the height of the display, in pixel rows.

the host is to stop and raise an error should this be less than or equal to
zero.

### audio_render

called when the audio output buffer must be refreshed.  must be a deterministic
function which only reads from input_* and state_*_buffer, and writes to
audio_buffer.

may be called multiple times without calling elapse.

### audio_buffer

pointer within memory to a buffer of f32s.

each f32 represents sound pressure for a single audio sample, where the expected
range is from -1 to +1.  hosts are to clamp to this range.

interleaved stereo; the first sample is from the left channel, the second from
the right channel, and so forth.

the host is to stop and raise an error should this not fit within memory, or
overlap any other described memory region.

### audio_length

the number of samples per channel per gameplay tick; multply by refresh_rate to
calculate effective sample rate.

the host is to stop and raise an error should this be less than or equal to
zero.

### inputs

the number of gamepads connected to the system.

the host is to stop and raise an error should this be less than or equal to
zero.

### input_state

pointer within memory to a buffer of u8s.

each u8 represents the state of a gamepad.

| input_state | description                                    |
| ----------- | ---------------------------------------------- |
| 0           | the gamepad is not connected.                  |
| 1           | the gamepad is connected to the local machine. |
| 2           | the gamepad is connected to a remote machine.  |

elapse must treat locally and remotely connected gamepads as equivalent, so that
game logic is executed in the same manner on all machines in the session.

*_render may distinguish between them; for instance, a split-screen game might
only render video and audio for players with gamepads connected locally, or
indicate which players are local and remote in the user interface.

all other values are reserved for future use.

the host is to stop and raise an error should this not fit within memory, or
overlap any other described memory region.

### input_dpad_*, input_face_*, input_trigger_*, input_pause

pointer within memory to a buffer of u8s.

each u8 represents the state of the named button on a specific gamepad.

| input_* | description                                                   |
| ------- | ------------------------------------------------------------- |
| 0       | the gamepad is not connected, or its button is not depressed. |
| 255     | the gamepad is connected, and its button is depressed.        |

all other values are reserved for future use.

the host is to stop and raise an error should this not fit within memory, or
overlap any other described memory region.

### input_rumble_render

called when gamepad force feedback must be refreshed.  must be a deterministic
function which only reads from input_* and state_*_buffer, and writes to
input_rumble_buffer.

may be called multiple times without calling elapse.

### input_rumble_buffer

pointer within memory to a buffer of u8s.

each u8 represents the intensity of the force feedback for a specific gamepad,
where 0 is an absence of force feedback, and 255 is the most force feedback the
gamepad is capable of producing.

the host is to stop and raise an error should this not fit within memory, or
overlap any other described memory region.

the host is to ignore values given for gamepads not connected locally, or which
do not support force feedback.

### state_version

if the host has state to restore for this game, it must have also have a record
of the state_version of the game from which that state was taken.

if this value has changed, it represents a breaking change in how the game
structures or interacts with its internal state, and any saved state is to be
discarded, instead starting afresh.

### state_*_buffer

pointer with memory to a buffer where game state is stored.

the host is to stop and raise an error should this not fit within memory, or
overlap any other described memory region.

on startup, there are five possibilities:

- if the host does not have a value to restore for this state buffer, it is
  initialized with all zero bytes.
- if the host has a value to restore for this state buffer and the size matches,
  the value is written verbatim to the module.
- if the host has a value to restore for this state buffer which is shorter than
  the size now described, the value is written, and the remaining space in the
  state buffer initialized with all zero bytes.
- if the host has a value to restore for ths state buffer which is longer than
  the size now described, the value is written, but truncated at the end to fit
  within the new buffer size.
- if the host has a value, but the corresponding state buffer no longer exists,
  it is to be discarded.

### state_*_size

length, in bytes, of the corresponding state_*_buffer.
