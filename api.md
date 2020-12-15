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

the "memory" export is required, and must be a memory export.

### events

the host will invoke exported functions in response to events.

it will not invoke unrecognized functions, and continue working as normal should
an event it supports not be present.

#### elapse

the "elapse" export is executed 60 times per second while the game is running.

it must be deterministic.

#### render

the "render" export is executed whenever the host wishes to refresh its outputs.

this may be executed without calling elapse.

### state

any export prefixed "state_" except "state_version" is a pointer to the start
of a region of "memory", representing an area of the game's internal state.

games must only read from these buffers during a render event.

games are free to read from and write to these buffers during an elapse event.

all state exports must also include a "state_" prefixed, "_size" suffixed export
which is a constant indicating how large the state region is, in bytes.

the host will abort the game should the specified range not fit in the memory
export, or should the size be less than or equal to zero.

the host will initialize all state memory with zeroes before any events are
invoked.

if the host has state values on hand (such as from a previous session, a network
multiplayer session or a hot reload), these will be injected between
initialization and the invocation of the first event.

if the buffer is smaller than that the host wishes to inject, the host will only
inject as many bytes as now possible (effectively truncating it).

if the buffer is larger than that the host wishes to inject, the host will only
inject the bytes it has, leaving the rest of the buffer as zeroes.

if the host has states value on hand for which there is are longer state
exports, it is to discard them and continue executing the game.

#### version tolerance

it is recommended that games keep simple, primitive types in state buffers for
easier version tolerance.

if breaking changes are unavoidable, the game can rename affected fields (in
which case the host will not inject the previous, incompatible value,
preserving all other state).

if all state should be discarded, the "state_version" export can be added to the
game.  hosts are to discard all state and start from a clean slate should this
number not match on attempting to continue a previous session.

### timing

export "output_refresh_rate" specifies the game's refresh rate, in hertz.

the host is to abort the game should this export be missing or less than or
equal to zero.

### gamepad quantity

export "gamepad_quantity" specifies the maximum number of gamepads.

the host is to abort the game should this be missing or less than zero.

### outputs

any export prefixed "output_" is a pointer to the start of a region of "memory",
through which the game can output information to the host.

hosts are to ignore any "output_"-prefixed export they do not recognize, and
continue working as normal should outputs it supports not be present.

games must only write to these buffers, and only during a render event.

the host will abort the game should the specified range not fit in the memory
export.

#### video

"output_video" is a pointer to an array of u8s, representing the video
framebuffer.

each u8 represents the intensity of a channel within a pixel, running through
channels red, green and blue, then from left to right, then from top to bottom.

export "output_video_width" specifies the width of the framebuffer (in pixel
columns).

the host is to abort the game should this be missing or less than or equal to
zero.

export "output_video_height" specifies an override for the height of the
framebuffer (in pixel rows).

the host is to abort the game should this be missing or less than or equal to
zero.

#### audio

"output_audio" is a pointer to an array of f32s, representing the audio buffer.

each f32 is a single sample, with each pair representing a single sample for the
left and right channels respectively.

the expected range is from -1 to +1.  hosts are to clip if games output values
outside this range.

export "output_audio_sample_rate" specifies the game's sample rate, in hertz.

the host is to abort the game should this be missing, less than or equal to
zero, or not evenly divisible by the refresh rate.

#### gamepad rumble

"output_gamepad_rumble" is a pointer to an array of u8s, representing force
feedback intensity.

each u8 is the intensity of the rumble for a specific gamepad, where 0 is a
total absence of force feedback, and 255 is the most force feedback the gamepad
can produce.

values are ignored for gamepads which are either not connected locally, or do
not have force feedback.

### inputs

any export prefixed "input_" is a pointer to the start of a region of "memory",
through which the host can output information to the game.

hosts are to ignore any "input_"-prefixed export they do not recognize, and
continue working as normal should inputs it supports not be present.

games must only read from these buffers, and only during an elapse or render
event.

the host will abort the game should the specified range not fit in the memory
export.

#### gamepad state

"input_gamepad_connected" is a pointer to an array of u8s, where each represents
the state of a gamepad.

| value | name         | description                                  |
| ----- | ------------ | -------------------------------------------- |
| 0     | disconnected | the gamepad is not connected.                |
| 1     | remote       | the gamepad is connected to another machine. |
| 2     | local        | the gamepad is connected to this machine.    |

a remote gamepad might represent a player on another system participating over a
network connection.  they are playing the same game, but the game may render
differently, such as not including a split screen viewport for them.

remote and local gamepads must be treated identically during the elapse event.

all other possible values are reserved.

#### gamepad buttons

the following inputs are pointers to arrays of u8s, where each u8 represents the
state of a button on a gamepad.

- input_gamepad_dpad_up
- input_gamepad_dpad_down
- input_gamepad_dpad_left
- input_gamepad_dpad_right
- input_gamepad_face_up
- input_gamepad_face_down
- input_gamepad_face_left
- input_gamepad_face_right
- input_gamepad_trigger_left
- input_gamepad_trigger_right
- input_gamepad_pause

each u8 is to be 0 should the controller be disconnected or the button not be
active, and 1 should the button be active.

all other possible values are reserved.
