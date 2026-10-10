# Skyrim NPC Web Application --- Master Implementation Plan

## 1. Project Overview

Build an immersive, Skyrim-inspired web application for an offline NPC
chatbot.

The first implementation is intentionally **2D**: the NPC is represented
by the existing `npc_image.jpeg`, while the rest of the experience is
built as a polished fantasy/RPG interface.

The long-term goal is to evolve this into a constrained, performant 3D
tavern experience where the user sits across from an NPC bartender,
speaks naturally, and receives spoken responses from the custom chatbot.

The key architectural principle is:

> **Build the conversation and AI system independently from the
> rendering layer so the 2D NPC can later be replaced by a Three.js /
> React Three Fiber scene without rewriting the chatbot system.**

------------------------------------------------------------------------

## 2. Current AI System

The existing Tkinter implementation is the functional reference.

Core pipeline:

``` text
User speech
    ↓
Vosk STT
    ↓
Custom Transformer
    ↓
Silero TTS
    ↓
Audio playback
```

The project currently includes assets/code such as:

-   `skyrim_theme.mp3`
-   `skyrim_vocab_q.pkl`
-   `training.ipynb`
-   `transformer_chatbot.py`
-   `npc_image.jpeg`

The custom model is intentionally small:

-   approximately 2 million parameters
-   trained on approximately 7,000 dialogue pairs

The web implementation must preserve the existing chatbot behavior
rather than replacing it with an external LLM or browser AI.

------------------------------------------------------------------------

## 3. Phase 1 Product Experience

The initial website should feel like an **unofficial Skyrim-inspired NPC
experiment**, not like a generic chatbot.

The user journey:

``` text
Open website
    ↓
Dark cinematic introduction
    ↓
Read an old parchment / scroll notice
    ↓
Click PROCEED
    ↓
Browser audio interaction is unlocked
    ↓
Skyrim-inspired soundtrack starts
    ↓
Tavern scene appears
    ↓
NPC portrait appears
    ↓
User types or speaks
    ↓
Vosk STT (voice input)
    ↓
Custom Transformer
    ↓
Silero TTS
    ↓
Browser plays NPC voice
    ↓
Dialogue appears
    ↓
User continues conversation
```

------------------------------------------------------------------------

## 4. Intro / Notice

The first screen should be an aged parchment/scroll over a dark fantasy
environment.

It should explain that:

-   this is an experimental educational project
-   the chatbot is based on a very small custom Transformer
-   the model has approximately 2 million parameters
-   it was trained on roughly 7,000 dialogue pairs
-   responses may be repetitive, inaccurate, or nonsensical
-   the project is unofficial and fan-made
-   the project does not claim ownership of Skyrim/Bethesda intellectual
    property
-   the purpose is educational/research experimentation

Avoid making inaccurate statements such as "there is no copyright."

The `PROCEED` button is intentionally the user's explicit interaction
that starts the soundtrack because browsers restrict unsolicited
autoplay.

------------------------------------------------------------------------

## 5. Phase 1 Visual Direction

The UI should use a Skyrim/fantasy RPG visual language throughout.

Avoid:

-   generic SaaS cards
-   Bootstrap styling
-   Material UI
-   modern dashboard layouts
-   blue chatbot bubbles
-   glassmorphism
-   excessive rounded rectangles
-   generic HTML form appearance

Prefer:

-   parchment
-   aged paper
-   dark wood
-   iron
-   stone
-   leather
-   bronze/gold accents
-   engraved borders
-   decorative corners
-   fantasy/medieval serif typography
-   RPG-style separators
-   subtle vignette
-   restrained atmospheric animation

The visual goal is:

> **The UI should feel like an RPG interface, not a normal website with
> a Skyrim background.**

Use only appropriately licensed/local fonts and assets.

------------------------------------------------------------------------

## 6. Main 2D Tavern Experience

For Phase 1, use a 2D tavern/fantasy background and the existing
`npc_image.jpeg`.

The NPC should be the visual focus.

The portrait should not sit inside a generic card. It should appear
embedded into the environment using:

-   dark framing
-   subtle shadows
-   vignette
-   fantasy borders
-   controlled lighting
-   subtle idle movement if inexpensive

The conversation should feel like an RPG dialogue system rather than a
messaging app.

Example conceptual presentation:

``` text
NPC NAME

"Dialogue from the NPC..."

YOU

"Player dialogue..."
```

------------------------------------------------------------------------

## 7. Input Modes

The user must be able to communicate in two ways.

### Text

-   text input
-   Enter submits
-   empty messages rejected
-   clear processing state
-   errors handled without losing the scene

### Voice

-   microphone button
-   microphone permission handling
-   recording/listening state
-   Vosk transcription
-   visible recognized text where appropriate
-   Transformer inference
-   Silero TTS
-   browser audio playback

Voice states:

``` text
IDLE
LISTENING
TRANSCRIBING
THINKING
SPEAKING
ERROR
```

------------------------------------------------------------------------

## 8. Audio Architecture

The soundtrack:

-   is loaded once
-   starts after `PROCEED`
-   loops
-   has volume control
-   has mute control
-   does not restart per message
-   remains lower than NPC speech volume

NPC TTS audio should be generated by the existing Python TTS
implementation and played by the browser.

Do not depend on browser `speechSynthesis` if the Tkinter implementation
uses Silero.

The browser is the playback layer; Python remains the
inference/audio-generation layer.

------------------------------------------------------------------------

## 9. Backend Architecture

Use a Python FastAPI backend around the existing Python implementation.

The exact API should be determined after inspecting the existing Tkinter
code.

A possible text endpoint:

``` text
POST /api/chat
```

Request:

``` json
{
  "message": "Hello"
}
```

Response:

``` json
{
  "text": "NPC response",
  "audio_url": "/api/audio/..."
}
```

For voice and future low-latency streaming, use an appropriate WebSocket
or streaming endpoint.

Critical requirement:

> Load the Transformer, vocabulary, Vosk, and Silero once when the
> backend starts.

Do not reload models on every request.

------------------------------------------------------------------------

## 10. Frontend Architecture

Recommended stack:

-   React
-   TypeScript
-   Vite
-   CSS/CSS modules
-   FastAPI backend

Suggested conceptual structure:

``` text
frontend/
  src/
    components/
      IntroScroll.tsx
      TavernScene.tsx
      NPCPortrait.tsx
      DialoguePanel.tsx
      ChatInput.tsx
      VoiceButton.tsx
      AudioControls.tsx
      StatusIndicator.tsx

    state/
      conversationStore.ts

    services/
      chatService.ts
      voiceService.ts
      audioService.ts

    styles/
      global.css
      fantasy.css

    App.tsx
    main.tsx

backend/
  main.py
  api/
  services/
```

Adapt this to the existing repository instead of forcing a new structure
if the project already has an appropriate organization.

------------------------------------------------------------------------

## 11. State Architecture

Application state should be independent from visual rendering.

Core state:

``` text
INTRO
ENTERING_TAVERN
IDLE
LISTENING
TRANSCRIBING
THINKING
SPEAKING
ERROR
```

The background and NPC should remain rendered during network/model
failures.

Do not couple WebSocket/network state directly to whether the visual
scene exists. A backend failure must not produce a black screen or
destroy the scene.

This separation is especially important because the future 3D scene will
consume the same state.

------------------------------------------------------------------------

## 12. Future 3D Architecture

After the 2D application is stable, add:

-   Three.js
-   React Three Fiber
-   Drei
-   optimized GLB/GLTF assets
-   a single tavern environment
-   one NPC
-   controlled camera
-   lighting
-   animation clips

Conceptually:

``` text
React Application
│
├── Conversation UI
│
├── Audio Controls
│
└── Tavern Scene
      ├── Environment
      ├── NPC
      ├── Camera
      ├── Lighting
      └── Animation Controller
```

The conversation system remains unchanged.

Replace:

``` text
<TavernScene />
```

with:

``` text
<ThreeTavernScene />
```

without rewriting STT, Transformer, TTS, dialogue history, or audio
management.

------------------------------------------------------------------------

## 13. Future NPC Animation System

The NPC should eventually react to conversation state.

Map:

``` text
IDLE
    → idle animation

LISTENING
    → look toward player / listening animation

THINKING
    → subtle idle/gesture

SPEAKING
    → talking animation / head movement / gesture
```

The first 3D implementation does not need advanced facial animation.

Prioritize:

-   idle
-   look-at-player
-   talking
-   one or two gestures
-   subtle movement

The goal is believable presence, not a full game character system.

------------------------------------------------------------------------

## 14. Future 3D Scene Scope

Keep the scene deliberately small.

The first 3D environment should contain approximately:

-   one tavern room
-   one fireplace
-   one table
-   NPC bartender
-   chairs
-   shelves
-   barrels/props
-   limited lighting
-   atmospheric effects

Do not attempt to reproduce all of Skyrim.

A small, polished scene will perform better and look more coherent than
a large unoptimized environment.

------------------------------------------------------------------------

## 15. Asset Strategy

Prefer free assets with clear licenses.

Potential sources include:

-   Poly Haven --- textures/HDRIs/environment assets
-   Quaternius --- characters, props, animations
-   Kenney --- game assets and UI/prototyping assets

Always verify the license for the exact asset before shipping.

Avoid blindly mixing hundreds of unrelated assets.

Target:

``` text
small number of coherent assets
+
optimized textures
+
few materials
+
few dynamic lights
+
baked/static lighting where practical
```

------------------------------------------------------------------------

## 16. Performance Targets

The application should prioritize responsiveness.

Phase 1:

-   lightweight CSS animation
-   compressed images
-   no unnecessary canvas rendering
-   minimal dependencies

Phase 3+ 3D:

-   one compact scene
-   low/medium-poly assets where appropriate
-   optimized GLB files
-   texture resolution based on visual importance
-   limited dynamic lights
-   avoid expensive post-processing
-   avoid unnecessary physics
-   avoid continuous expensive CPU work

The AI pipeline is already the main computational component, so the
browser scene must not unnecessarily compete with it.

------------------------------------------------------------------------

## 17. Implementation Philosophy

Build in vertical slices.

Do not build the entire frontend first and connect the backend later.

Instead:

``` text
Backend text inference
    ↓
Backend TTS
    ↓
Frontend text conversation
    ↓
Frontend audio playback
    ↓
Backend voice input
    ↓
Frontend microphone interaction
    ↓
Intro/audio experience
    ↓
Visual polish
```

Every phase should produce something testable.

------------------------------------------------------------------------

## 18. Long-Term Goal

The final application should feel like:

> "I have entered a tavern, sat down across from an NPC, and can
> actually speak to them."

The user should not feel like they are interacting with:

> "a web chatbot with a Skyrim skin."

The AI, audio, UI, environment, camera, and NPC animation should
eventually behave as one coherent interactive system.

------------------------------------------------------------------------

## 19. Definition of Success

Phase 1 is successful when:

1.  The website opens reliably.
2.  The user can read the notice.
3.  `PROCEED` starts the soundtrack.
4.  The tavern scene appears.
5.  The NPC image appears correctly.
6.  Text input reaches the actual custom Transformer.
7.  The real response appears.
8.  Silero-generated audio plays in the browser.
9.  Microphone input reaches Vosk.
10. The transcription can be used as the chatbot input.
11. Errors do not destroy the visual scene.
12. The experience is responsive.
13. The visual design consistently feels like a fantasy RPG.
14. The architecture can later accept a Three.js/R3F scene without
    replacing the conversation system.
